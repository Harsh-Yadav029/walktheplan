import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { Reveal } from './MotionPrimitives';
import {
  BUSINESS_CONTACT,
  STUDIO_LOCATIONS,
  buildWhatsAppUrl,
  validateConsultationInput,
  type ConsultationInput,
} from '../lib/bookingLogic';

interface ConsultationSectionProps {
  onBookClick: () => void;
}

const FLOATING_INPUT_CLASSES =
  'peer w-full border-0 border-b border-[#191A18]/22 bg-transparent px-0 pt-5 pb-2.5 text-sm text-[#191A18] placeholder-transparent focus:border-[#191A18]/22 focus:outline-none transition-colors';

const FLOATING_LABEL_CLASSES =
  'pointer-events-none absolute left-0 top-0 origin-left text-[11px] uppercase tracking-[0.14em] text-[#77746D] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[#6B6861] peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-[#B97856]';

const FLOATING_SELECT_LABEL_CLASSES =
  'pointer-events-none absolute left-0 top-0 text-[11px] uppercase tracking-[0.14em] text-[#77746D] transition-colors duration-300 peer-focus:text-[#B97856]';

const UNDERLINE_BAR_CLASSES =
  'pointer-events-none absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-[#B97856] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100';

export function ConsultationSection({ onBookClick }: ConsultationSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<ConsultationInput['role']>('Homeowner');
  const [cityId, setCityId] = useState<string>(STUDIO_LOCATIONS[0].id);
  const [projectStage, setProjectStage] = useState<ConsultationInput['projectStage']>(
    'Pre-Construction Validation'
  );
  const [areaSqFt, setAreaSqFt] = useState('2200');
  const [timeline, setTimeline] = useState<ConsultationInput['timeline']>('Within 1 Month');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const payload: ConsultationInput = {
      fullName,
      email,
      phone,
      role,
      cityId,
      projectStage,
      areaSqFt: Number(areaSqFt),
      timeline,
      message,
    };

    const validation = validateConsultationInput(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || 'Could not submit consultation inquiry.');
      }
      setSubmittedId(data.consultation.id);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to send your consultation request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#E8E3D9] text-[#191A18]">
      {/* Final Editorial Call To Action */}
      <div className="bg-[#191A18] text-[#F5F2EB] py-10 md:py-14 border-b border-white/10">
        <div className="mx-auto max-w-[1360px] px-5 md:px-10 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-4">
              Begin With Certainty
            </p>
            <h2 className="font-serif text-[clamp(2.4rem,4.6vw,4.25rem)] leading-[1.06] tracking-[-0.02em] text-white max-w-3xl mx-auto">
              Don&apos;t Just Imagine Your Home. Walk It.
            </h2>
            <p className="mt-5 text-base md:text-lg text-[#E8E3D9]/80 max-w-xl mx-auto leading-relaxed">
              Experience your future space at actual scale before the first brick is laid.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center gap-2.5 bg-[#B97856] px-7 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#a66847] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book Your Studio Experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={buildWhatsAppUrl(
                  BUSINESS_CONTACT.phoneRaw,
                  'Hello Walk The Plan team, I would like to speak with a spatial specialist about my floor plan.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Talk to Our Team</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Streamlined Lead Generation & Project Qualification Form */}
      <div className="py-10 md:py-14">
        <div className="mx-auto max-w-[1360px] px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <Reveal>
                <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                  Design Consultation &amp; Project Qualification
                </p>
                <h2 className="font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1.1] text-[#191A18]">
                  Have a Floor Plan Ready for Review?
                </h2>
                <p className="mt-4 text-sm md:text-base text-[#77746D] leading-relaxed">
                  Share your project stage, approximate area, and nearest studio city. Our spatial
                  engineering team will advise on the ideal session duration and DWG/PDF preparation.
                </p>
              </Reveal>

              <Reveal delay={0.1} yOffset={20}>
                <div className="border-t border-[#191A18]/12 pt-6 space-y-3 text-sm text-[#191A18]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#77746D]">
                      Direct Phone &amp; WhatsApp
                    </p>
                    <a
                      href={`tel:${BUSINESS_CONTACT.phoneRaw}`}
                      className="font-medium hover:text-[#B97856] transition-colors tabular-nums"
                    >
                      {BUSINESS_CONTACT.phoneDisplay}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#77746D]">Email</p>
                    <a
                      href={`mailto:${BUSINESS_CONTACT.email}`}
                      className="font-medium hover:text-[#B97856] transition-colors"
                    >
                      {BUSINESS_CONTACT.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#77746D]">Hours</p>
                    <p>{BUSINESS_CONTACT.hours}</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.14} yOffset={30} className="lg:col-span-7">
            <div className="bg-[#F5F2EB] border border-[#191A18]/12 p-6 md:p-10">
              {submittedId ? (
                <div data-testid="consultation-confirmation" className="space-y-5 py-6">
                  <div className="inline-flex items-center gap-2 text-[#B97856] text-xs font-medium uppercase tracking-[0.14em]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Consultation Request Received</span>
                  </div>
                  <h3 className="font-serif text-3xl text-[#191A18]">
                    Thank you, {fullName}. Our Spatial Team Will Reach Out Shortly.
                  </h3>
                  <p className="text-sm text-[#77746D] leading-relaxed">
                    Reference ID <span className="font-mono text-[#191A18]">{submittedId}</span> has
                    been logged for your {areaSqFt} sq.ft. {projectStage.toLowerCase()} review.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedId(null);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="border border-[#191A18] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#191A18] hover:bg-[#191A18] hover:text-[#F5F2EB] transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-6">
                    <div>
                      <div className="relative">
                        <input
                          id="consult-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder=" "
                          className={`${FLOATING_INPUT_CLASSES} ${
                            errors.fullName ? 'border-[#9e3f22]' : ''
                          }`}
                        />
                        <label htmlFor="consult-name" className={FLOATING_LABEL_CLASSES}>
                          Full Name *
                        </label>
                        <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1.5 text-xs text-[#9e3f22]">{errors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          id="consult-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder=" "
                          className={`${FLOATING_INPUT_CLASSES} ${
                            errors.phone ? 'border-[#9e3f22]' : ''
                          }`}
                        />
                        <label htmlFor="consult-phone" className={FLOATING_LABEL_CLASSES}>
                          Phone / WhatsApp *
                        </label>
                        <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                      </div>
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-[#9e3f22]">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          id="consult-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder=" "
                          className={`${FLOATING_INPUT_CLASSES} ${
                            errors.email ? 'border-[#9e3f22]' : ''
                          }`}
                        />
                        <label htmlFor="consult-email" className={FLOATING_LABEL_CLASSES}>
                          Email Address *
                        </label>
                        <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-[#9e3f22]">{errors.email}</p>
                      )}
                    </div>

                    <div className="relative">
                      <select
                        id="consult-role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as ConsultationInput['role'])}
                        className={`${FLOATING_INPUT_CLASSES} appearance-none pr-6 cursor-pointer`}
                      >
                        <option value="Homeowner">Homeowner</option>
                        <option value="Architect">Architect</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Builder / Developer">Builder / Developer</option>
                      </select>
                      <label htmlFor="consult-role" className={FLOATING_SELECT_LABEL_CLASSES}>
                        Role
                      </label>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-3 w-4 h-4 text-[#77746D]"
                      />
                      <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                    </div>

                    <div className="relative">
                      <select
                        id="consult-city"
                        value={cityId}
                        onChange={(e) => setCityId(e.target.value)}
                        className={`${FLOATING_INPUT_CLASSES} appearance-none pr-6 cursor-pointer`}
                      >
                        {STUDIO_LOCATIONS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.city}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="consult-city" className={FLOATING_SELECT_LABEL_CLASSES}>
                        Preferred Studio City
                      </label>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-3 w-4 h-4 text-[#77746D]"
                      />
                      <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                    </div>

                    <div className="relative">
                      <select
                        id="consult-stage"
                        value={projectStage}
                        onChange={(e) =>
                          setProjectStage(e.target.value as ConsultationInput['projectStage'])
                        }
                        className={`${FLOATING_INPUT_CLASSES} appearance-none pr-6 cursor-pointer`}
                      >
                        <option value="Concept / Floor Plan Draft">
                          Concept / Floor Plan Draft
                        </option>
                        <option value="Pre-Construction Validation">
                          Pre-Construction Validation
                        </option>
                        <option value="Interior Fit-Out">Interior Fit-Out</option>
                        <option value="Commercial / Real Estate Launch">
                          Commercial / Real Estate Launch
                        </option>
                      </select>
                      <label htmlFor="consult-stage" className={FLOATING_SELECT_LABEL_CLASSES}>
                        Project Stage
                      </label>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-3 w-4 h-4 text-[#77746D]"
                      />
                      <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          id="consult-area"
                          type="number"
                          min={250}
                          max={100000}
                          value={areaSqFt}
                          onChange={(e) => setAreaSqFt(e.target.value)}
                          placeholder=" "
                          className={`${FLOATING_INPUT_CLASSES} tabular-nums ${
                            errors.areaSqFt ? 'border-[#9e3f22]' : ''
                          }`}
                        />
                        <label htmlFor="consult-area" className={FLOATING_LABEL_CLASSES}>
                          Project Area (sq.ft.) *
                        </label>
                        <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                      </div>
                      {errors.areaSqFt && (
                        <p className="mt-1.5 text-xs text-[#9e3f22]">{errors.areaSqFt}</p>
                      )}
                    </div>

                    <div className="relative">
                      <select
                        id="consult-timeline"
                        value={timeline}
                        onChange={(e) =>
                          setTimeline(e.target.value as ConsultationInput['timeline'])
                        }
                        className={`${FLOATING_INPUT_CLASSES} appearance-none pr-6 cursor-pointer`}
                      >
                        <option value="Within 2 Weeks">Within 2 Weeks</option>
                        <option value="Within 1 Month">Within 1 Month</option>
                        <option value="1–3 Months">1–3 Months</option>
                        <option value="Exploratory">Exploratory</option>
                      </select>
                      <label htmlFor="consult-timeline" className={FLOATING_SELECT_LABEL_CLASSES}>
                        Expected Construction Start
                      </label>
                      <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-0 bottom-3 w-4 h-4 text-[#77746D]"
                      />
                      <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      id="consult-message"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder=" "
                      className={`${FLOATING_INPUT_CLASSES} resize-none`}
                    />
                    <label htmlFor="consult-message" className={FLOATING_LABEL_CLASSES}>
                      Scope &amp; Questions (Optional)
                    </label>
                    <span aria-hidden="true" className={UNDERLINE_BAR_CLASSES} />
                  </div>

                  {submitError && (
                    <p className="text-xs text-[#9e3f22] bg-[#9e3f22]/10 p-3">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#191A18] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#F5F2EB] hover:bg-[#B97856] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    <span>{submitting ? 'Submitting Request...' : 'Request Design Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
