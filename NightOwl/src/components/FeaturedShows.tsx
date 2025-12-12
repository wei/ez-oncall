import { Clock, MapPin } from 'lucide-react';

export default function FeaturedShows() {
  const movies = [
    {
      title: 'Neon Midnight',
      time: '11:45 PM',
      cinema: 'Downtown Cinema',
      price: '$12',
    },
    {
      title: 'Dark Horizon',
      time: '12:00 AM',
      cinema: 'Metro Theater',
      price: '$14',
    },
    {
      title: 'After Hours',
      time: '11:30 PM',
      cinema: 'Sunset Multiplex',
      price: '$12',
    },
    {
      title: 'Silent Dreams',
      time: '12:15 AM',
      cinema: 'Plaza Cinema',
      price: '$13',
    },
    {
      title: 'Night Runner',
      time: '11:50 PM',
      cinema: 'Grand Theater',
      price: '$15',
    },
    {
      title: 'Twilight Echo',
      time: '12:30 AM',
      cinema: 'Cinema Luxe',
      price: '$16',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Tonight's Featured Shows
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Catch these late-night screenings before they're sold out
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
            <div
              key={index}
              className="bg-gray-950 rounded-lg p-6 border border-gray-800 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-amber-500 transition-colors">
                  {movie.title}
                </h3>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-sm font-medium">
                  From {movie.price}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{movie.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{movie.cinema}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
