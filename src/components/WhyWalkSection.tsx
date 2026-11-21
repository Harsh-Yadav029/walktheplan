import { Reveal } from './MotionPrimitives';

const BENEFITS = [
  {
    index: '01',
    title: 'Understand Actual Room Dimensions',
    detail:
      'Replace abstract square-footage numbers on drawings with immediate physical perception of bedroom, kitchen, and foyer proportions.',
  },
  {
    index: '02',
    title: 'Test Furniture Placement',
    detail:
      'Position real-scale sofa sectionals, dining tables, wardrobes, and beds inside your plan to verify visual balance and legroom.',
  },
  {
    index: '03',
    title: 'Evaluate Circulation Space',
    detail:
      'Walk naturally around dining islands, passageways, and staircase landings to ensure every family member moves comfortably.',
  },
  {
    index: '04',
    title: 'Identify Potential Layout Issues',
    detail:
      'Spot awkward door swing collisions, tight bathroom clearances, or cramped storage alcoves before civil execution begins.',
  },
  {
    index: '05',
    title: 'Improve Stakeholder Communication',
    detail:
      'Unite homeowners, architects, interior designers, and contractors on one calibrated floor where everyone sees the exact same space.',
  },
  {
    index: '06',
    title: 'Reduce Avoidable Design Changes',
    detail:
      'Lock architectural decisions early so on-site masonry and MEP teams build cleanly from a verified, agreed-upon blueprint.',
  },
];

export function WhyWalkSection() {
  return (
    <section className="bg-[#191A18] text-[#F5F2EB] py-22 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 border-b border-white/12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-4">
                Why Walk The Plan
              </p>
              <h2 className="font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.06] tracking-[-0.015em] text-white">
                Better Decisions Begin Before Construction.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <Reveal delay={0.08}>
              <p className="text-sm md:text-base text-[#E8E3D9]/75 leading-relaxed">
                Changes on a projected floor take minutes. Modifying brick walls, plumbing lines,
                or structural openings on site costs months and compromises your design.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 pt-14">
          {BENEFITS.map((item, idx) => (
            <Reveal
              key={item.index}
              delay={idx * 0.04}
              className="border-t border-white/12 pt-6 space-y-3"
            >
              <span className="font-serif text-xl text-[#B97856] tabular-nums block">
                {item.index}
              </span>
              <h3 className="font-serif text-2xl text-white tracking-wide">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#E8E3D9]/75">{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
