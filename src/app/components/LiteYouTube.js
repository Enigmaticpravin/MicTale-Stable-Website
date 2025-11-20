"use client"

export default function LiteYouTube({ videoId }) {
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div
      className="relative w-full h-0"
      style={{ paddingBottom: "56.25%" }}
    >
      <button
        className="absolute top-0 left-0 w-full h-full bg-black/20 flex items-center justify-center"
        onClick={(e) => {
          const container = e.currentTarget.parentNode
          container.innerHTML = `
            <iframe 
              src="https://www.youtube.com/embed/${videoId}?autoplay=1"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
              class="absolute top-0 left-0 w-full h-full"
            ></iframe>
          `
        }}
      >
        <img
          src={thumbnail}
          alt="YouTube thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="z-10 text-white bg-red-600 px-4 py-2 rounded-full">Play</div>
      </button>
    </div>
  )
}
