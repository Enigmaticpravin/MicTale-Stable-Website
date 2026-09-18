export default function DetailedSchedule() {
  const schedule = [
    {
      day: "Day 1",
      title: "Arrival & The First Connection",
      accent: "text-[#173d78]",
      bgAccent: "bg-[#173d78]",
      events: [
        { time: "10:00 AM", name: "Arrive at Basecamp", desc: "Drop your bags at goSTOPS, freshen up, and breathe in the thinner air." },
        { time: "11:30 AM", name: "Welcome Circle", desc: "No corporate speeches. Just our Retreat Kits, warm introductions, and the only rule: everyone participates." },
        { time: "2:30 PM", name: "The Landour Walk", desc: "A slow 'walk & talk' through Char Dukan and Sisters Bazaar. New partners every 15 minutes to break the ice." },
        { time: "8:00 PM", name: "The First Baithak", desc: "Dim lights. No stage. Just unfiltered conversations, stories, and midnight chai to close the night." },
      ],
    },
    {
      day: "Day 2",
      title: "The Big MicTale Day",
      accent: "text-[#e51c2b]",
      bgAccent: "bg-[#e51c2b]",
      events: [
        { time: "10:00 AM", name: "Create Something", desc: "A dedicated hour to write the mountain. Bring your journals, write a poem, or build a collaborative story with strangers." },
        { time: "3:00 PM", name: "Prep the Stage", desc: "We build the main event together. Everyone gets a micro-role: photographer, stagehand, or audience hype." },
        { time: "6:00 PM", name: "Mountain Open Mic", desc: "The centerpiece. First-time performers, travellers, and MicTale artists taking the mic as the valley goes dark." },
        { time: "9:30 PM", name: "Bonfire & Letters", desc: "Acoustic guitars, deep conversations around the fire, and writing a secret letter to your future self." },
      ],
    },
    {
      day: "Day 3",
      title: "The Mountain Day",
      accent: "text-[#2f4f3e]",
      bgAccent: "bg-[#2f4f3e]",
      events: [
        { time: "8:00 AM", name: "Drive to Cloud's End", desc: "Leaving the noise behind. A short group transit to the forested western edge of Mussoorie." },
        { time: "9:00 AM", name: "Silent Walk & Frames", desc: "No phones. No talking. Just a 20-minute silent walk, followed by a team photography challenge." },
        { time: "4:30 PM", name: "Final Gathering", desc: "Back at goSTOPS. We open our notebooks and share three things we are taking home from the weekend." },
        { time: "6:00 PM", name: "The Goodbye", desc: "No formal thank-you speeches. We capture individual portraits, sing one last song, and close the circle." },
      ],
    },
  ];

  return (
    <section className="relative px-6 py-20 md:py-32 bg-[#fbf7ee]">
      {/* Subtle Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(23,61,120,0.05)_1px,transparent_0)] [background-size:14px_14px]" />

      <div className="mx-auto max-w-4xl">
        <div className="mb-16 md:mb-24 text-center">
          <h2
            className="text-2xl md:text-5xl text-[#173d78]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Peek into the Deep
          </h2>
          <p className="md:mt-4 text-xs md:text-base text-[#173d78]/70">
            A closer look at how our hours unfold in the mountains.
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {schedule.map((dayPlan, index) => (
            <div key={dayPlan.day} className="relative">
              
          <div className="mb-10 flex flex-col items-center text-center md:flex-row md:text-left md:gap-6">
                <span 
                  className={`text-4xl md:text-7xl opacity-20 font-bold ${dayPlan.accent}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {dayPlan.day}
                </span>
                <h3 
                  className={`mt-2 text-xl md:mt-0 md:text-3xl ${dayPlan.accent}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {dayPlan.title}
                </h3>
              </div>
              <div className="relative ml-3 md:ml-8 border-l border-dashed border-[#173d78]/20 pl-8 md:pl-12">
                <div className="flex flex-col gap-4 md:gap-10">
                  {dayPlan.events.map((event, i) => (
                    <div key={i} className="relative group">
                      
                      <span className={`absolute -left-[37px] md:-left-[53px] top-1.5 h-2.5 w-2.5 rounded-full ${dayPlan.bgAccent} shadow-[0_0_0_4px_#fbf7ee] transition-transform duration-300 group-hover:scale-150`} />
                      
                      <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                        <span 
                          className="mb-2 shrink-0 rounded-sm bg-[#173d78]/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#173d78]/70 md:mb-0 md:w-28 md:text-right"
                        >
                          {event.time}
                        </span>
                        
                        <div>
                          <h4 
                            className="text-lg md:text-xl text-[#173d78]"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {event.name}
                          </h4>
                          <p className="md:mt-2 max-w-lg text-xs md:text-[15px] leading-relaxed text-[#173d78]/75">
                            {event.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}