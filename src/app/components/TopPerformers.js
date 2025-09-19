import Image from 'next/image';

const TopPerformers = () => {
  const performers = [
    {
      id: 1,
      name: 'Bharat V.',
      category: 'Poetry',
      image: 'https://i.imgur.com/HiENo3L.jpeg',
      description:
        "Mesmerized the audience with a haunting rendition of 'The Phantom of the Opera'"
    },
    {
      id: 2,
      name: 'Yati Sharma',
      category: 'Music',
      image: 'https://i.imgur.com/srhGRdu.jpeg',
      description:
        "Delivered an emotionally charged contemporary piece to 'Running Up That Hill'"
    },
    {
      id: 3,
      name: 'Gaurav',
      category: 'Music',
      image: 'https://i.imgur.com/oDKoXCj.jpeg',
      description: "Masterful interpretation of Chopin's Nocturne Op. 9 No. 2"
    }
  ];

  return (
    <section className="py-12 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-10">
          <p className="uppercase text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400 tracking-wide font-poppins">
            Meet our
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-white veronica-class">
            Top Performers
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
      {performers.map((performer) => (
  <div
    key={performer.id}
    className="group relative rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
  >
 <div className="aspect-[3/3] w-full relative p-2">
  <Image
    src={performer.image}
    alt={performer.name}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover rounded-2xl"
  />
</div>

    <div className="p-3 bg-gray-900 backdrop-blur-sm text-center">
      <h3 className="text-sm font-semibold text-white truncate">
        {performer.name}
      </h3>
      <span className="block mt-1 text-xs text-gray-400">
        {performer.category}
      </span>
    </div>
  </div>
))}
        </div>
      </div>
    </section>
  );
};

export default TopPerformers;
