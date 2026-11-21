import { Reveal } from './MotionPrimitives';
import { PROCESS_STEPS } from '../data/siteContent';
import { BUSINESS_CONTACT } from '../lib/bookingLogic';

export function ProcessSection() {
  return (
    <section
      id="process"
      className="bg-[#E8E3D9] text-[#191A18] py-20 md:py-28 border-b border-[#191A18]/10"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[#191A18]/12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                Four-Step Workflow
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
                From Floor Plan Submission to Day-1 Plan Freeze.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <p className="text-sm md:text-base text-[#77746D] leading-relaxed">
                {BUSINESS_CONTACT.turnaroundSummary}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
          {PROCESS_STEPS.map((item, idx) => (
            <Reveal
              key={item.step}
              delay={idx * 0.06}
              className="flex flex-col justify-between border-t border-[#191A18]/20 pt-6"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <span className="font-serif text-4xl text-[#B97856] tabular-nums">
                    {item.step}
                  </span>
                  <span className="text-xs text-[#77746D]">{item.subtitle}</span>
                </div>
                <h3 className="font-serif text-2xl text-[#191A18] mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#77746D]">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
