## Project Title
**EZ OnCall – Voice-First DevOps Incident Agent**

---

## Brief Project Description

EZ OnCall is a voice-first DevOps agent that replaces noisy Slack alerts and dashboards with a short, focused phone call. When our deliberately broken demo app (NightOwl Tickets) fails in production, Sentry sends an alert to EZ OnCall. The agent immediately calls the on-call engineer via Twilio, explains the incident using an ElevenLabs voice, and waits for a simple spoken command like “rollback” or “escalate.”

The core flow shows a full end-to-end loop: a real HTTP 500 in NightOwl’s checkout service produces a Sentry event, which triggers a webhook into our backend. The backend creates an incident record in Redis, initiates a call, generates a natural-language summary, and acts on the engineer’s voice command by triggering n8n workflows (e.g., rollback, open a GitHub issue), while updating a live Redis-backed dashboard. Judges can see the incident, call, decision, and action all wired together in real time.

---

## How the Submission Runs End-to-End

1. **NightOwl Tickets breaks**  
   - A user triggers the “checkout” flow in the NightOwl Tickets app.  
   - The `/api/checkout` endpoint returns HTTP 500 with `CheckoutServiceTimeoutError`.  
   - Optionally, a special “DevOps crash” button hits an endpoint that throws an unhandled error and crashes the backend process.

2. **Sentry sends the alert**  
   - Sentry captures the error or crash and tags it as `service=checkout-service`.  
   - A Sentry alert rule sends a webhook to `EZ_ONCALL_BACKEND_URL/sentry-webhook`.

3. **EZ OnCall creates an incident and calls the engineer**  
   - The webhook handler parses the Sentry payload into a clean incident object (service, endpoint, error type, message, timestamp, Sentry URL).  
   - EZ OnCall stores/updates the incident in Redis.  
   - EZ OnCall uses Twilio to place an outbound call to the on-call engineer.

4. **Voice summary + voice command**  
   - When the engineer answers, Twilio hits `/twilio/voice`.  
   - The backend generates a short summary from the incident and sends it to ElevenLabs for TTS.  
   - Twilio plays the ElevenLabs audio: a concise explanation plus options (“Say rollback to roll back the latest deploy, or escalate to page a senior engineer”).  
   - Twilio `<Gather>` captures the spoken response and posts it to `/twilio/gather`.

5. **Agent executes tools via n8n**  
   - The backend parses the speech transcript (simple intent mapping: “rollback”, “reboot”, “escalate”).  
   - For “rollback”, EZ OnCall calls an n8n webhook that simulates a rollback (e.g., hitting a fake deploy/rollback endpoint) and returns a result.  
   - For “fix”, EZ OnCall creates a GitHub issue with Sentry context and a snippet of the call transcript.  
   - The result is stored as an `action` for the incident in Redis.

6. **Dashboard + status page update**  
   - The EZ OnCall dashboard shows:  
     - Open incidents (NightOwl Checkout Service outage).  
     - The last call and the command the engineer gave.  
     - Actions taken (rollback triggered, issue created).  
   - The NightOwl Tickets status section reflects the degraded Checkout Service and can show “mitigated” after rollback.

---

## Judging Criteria

### 1. Working Prototype

- **End-to-end functionality**:
  - Real failing HTTP endpoint (`/api/checkout`) and crash endpoint in NightOwl Tickets.
  - Sentry receiving and forwarding error events via webhook.
  - EZ OnCall backend creating incidents in Redis and initiating outbound Twilio calls.
  - ElevenLabs generating voice summaries for the live incident.
  - Voice commands captured via Twilio `<Gather>` and converted into actions through n8n workflows.
  - Redis-backed dashboard showing incident timeline (error → call → decision → action).
- The system runs on a DigitalOcean droplet with a long-lived Node process; crashes are visible to Sentry and the process manager, enabling repeated demos.

### 2. Technical Complexity & Integration

- **Multiple systems integrated**:
  - Application + API (NightOwl Tickets: React/Tailwind + Node/Next backend).
  - Monitoring (Sentry alerting via webhook).
  - Telephony (Twilio Programmable Voice for outbound calls and webhooks).
  - Voice AI (ElevenLabs for text-to-speech of dynamic incident summaries).
  - Workflow engine (n8n for rollback/fix/escalate flows).
  - State storage (Redis) for incidents, calls, and actions.
  - Source control + issues (GitHub, with CodeRabbit used for code review in the development workflow).
- **Agent orchestration**:
  - Parses structured Sentry payloads into a unified incident model.
  - Generates human-readable summaries and options.
  - Maps natural speech to discrete tool calls.
  - Updates state and UI based on tool outcomes.

### 3. Innovation & Creativity

- Moves incident response from **clicking dashboards** to **speaking on a phone call**:
  - The agent behaves like a “voice runbook”: it calls you, explains what’s wrong, and asks what to do.
- Uses a realistic, narrative demo app (NightOwl Tickets) instead of a toy example:
  - Standard SaaS patterns: checkout failure, status page, incident panel, “For DevOps” note.
- Connects familiar DevOps building blocks (Sentry, Twilio, automation, GitHub) through a conversational interface rather than another web UI.
- Extensible design: new tools (e.g., real rollback pipelines, deeper review steps) can be added as additional voice commands.

### 4. Real-World Impact

- Targets on-call engineers and SREs dealing with:
  - Production errors at bad times (overnight, away from a laptop).
  - Alert overload and context switching between Sentry, logs, dashboards, and terminals.
- Potential improvements:
  - Faster initial triage and mitigation for common incidents (“roll back last deploy”, “restart service”).
  - Lower cognitive load: the agent surfaces just the key incident details and options.
  - Keeps human approval in the loop: no remediation runs until the engineer explicitly says “rollback” or “escalate.”
- Built using tools that teams already use (Sentry, GitHub, Twilio, n8n, Redis), so the concept can be dropped into real organizations.

### 5. Theme Alignment – Conversational Agents

- EZ OnCall is a true **conversational agent**:
  - Listens: receives monitoring events from Sentry and speech from the engineer.
  - Reasons: turns structured error data into a spoken summary and maps human commands to tools.
  - Acts: invokes concrete tools (rollback workflow, issue creation, escalation) and logs the result.
- Multimodal:
  - Voice output (ElevenLabs), voice input (Twilio speech), plus a web dashboard and status page.
- Agentic behavior:
  - Autonomous in detection and initiation (it calls you when something breaks).
  - Tool-using agent: uses n8n, GitHub, and deployment endpoints as its actuators.

---

## Technologies, Frameworks, APIs, and Services

**Frontend**
- React (SPA)
- Tailwind CSS
- NightOwl Tickets UI (hero, shows grid, status page)  
- EZ OnCall dashboard (incidents, calls, actions)

**Backend**
- Node.js (Express or Next.js API routes)
- Redis (incident, call, and action storage)
- JSON webhooks and REST endpoints

**Monitoring & Observability**
- Sentry (error and crash monitoring for NightOwl Tickets)
- Structured `console.error` logging

**Telephony & Voice**
- Twilio Programmable Voice:
  - Outbound call creation
  - Webhook handling (`/twilio/voice`, `/twilio/gather`)
  - Speech input via `<Gather input="speech">`
- ElevenLabs:
  - Text-to-speech for dynamic incident summaries and prompts

**Automation & DevOps**
- n8n:
  - Webhook-driven workflows for “rollback” and other actions
- GitHub:
  - API to create issues populated with Sentry context and call transcript snippets
- CodeRabbit:
  - Automated code review on EZ OnCall-related branches/PRs

**Infrastructure**
- DigitalOcean droplet (long-running Node processes managed via `pm2` or similar)
- Deployed NightOwl Tickets app and EZ OnCall backend running on the droplet

---
