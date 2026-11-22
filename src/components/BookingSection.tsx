import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar, Clock, MapPin } from 'lucide-react';
import { Reveal, MagneticButton } from './MotionPrimitives';
import {
  BUSINESS_CONTACT,
  SERVICE_PACKAGES,
  STUDIO_LOCATIONS,
  buildWhatsAppUrl,
  formatINR,
  getMinimumBookableDate,
  validateBookingInput,
  type BookingInput,
  type BookingRecord,
} from '../lib/bookingLogic';

interface SlotOption {
  id: string;
  startHour: number;
  label: string;
  available: boolean;
  reason?: string;
}

interface BookingSectionProps {
  preselectedStudioId?: string;
  preselectedPackageId?: string;
  presetNote?: string;
}

const STEPS = [
  { num: 1, label: 'Select Service' },
  { num: 2, label: 'Choose Date' },
  { num: 3, label: 'Time Slot' },
  { num: 4, label: 'Your Details' },
  { num: 5, label: 'Confirm' },
];

export function BookingSection({
  preselectedStudioId,
  preselectedPackageId,
  presetNote,
}: BookingSectionProps) {
  const minDate = useMemo(() => getMinimumBookableDate(), []);

  const [step, setStep] = useState<number>(1);
  const [studioId, setStudioId] = useState<string>(preselectedStudioId || STUDIO_LOCATIONS[0].id);
  const [packageId, setPackageId] = useState<string>(
    preselectedPackageId || SERVICE_PACKAGES[1].id
  );
  const [date, setDate] = useState<string>(minDate);
  const [slotId, setSlotId] = useState<string>('');
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerRole, setCustomerRole] = useState<BookingInput['customerRole']>('Homeowner');
  const [blueprintFormat, setBlueprintFormat] =
    useState<BookingInput['blueprintFormat']>('DWG / AutoCAD');
  const [projectAreaSqFt, setProjectAreaSqFt] = useState<string>('2400');
  const [notes, setNotes] = useState<string>(presetNote ?? '');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (preselectedStudioId) setStudioId(preselectedStudioId);
  }, [preselectedStudioId]);

  useEffect(() => {
    if (preselectedPackageId) setPackageId(preselectedPackageId);
  }, [preselectedPackageId]);

  useEffect(() => {
    if (presetNote) setNotes(presetNote);
  }, [presetNote]);

  // Fetch live slot availability whenever studio, date, or package changes
  useEffect(() => {
    let cancelled = false;
    async function loadAvailability() {
      if (!studioId || !date || !packageId) return;
      setLoadingSlots(true);
      setSlotsError(null);
      try {
        const res = await fetch(
          `/api/availability?studioId=${encodeURIComponent(studioId)}&date=${encodeURIComponent(
            date
          )}&packageId=${encodeURIComponent(packageId)}`
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Could not load slot availability.');
        }
        if (!cancelled) {
          setSlots(data.slots ?? []);
          const stillValid = (data.slots ?? []).some(
            (s: SlotOption) => s.id === slotId && s.available
          );
          if (!stillValid) {
            const firstOpen = (data.slots ?? []).find((s: SlotOption) => s.available);
            setSlotId(firstOpen ? firstOpen.id : '');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setSlotsError(
            err instanceof Error ? err.message : 'Unable to check studio availability.'
          );
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }
    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [studioId, date, packageId]);

  const activeStudio =
    STUDIO_LOCATIONS.find((s) => s.id === studioId) ?? STUDIO_LOCATIONS[0];
  const activePackage =
    SERVICE_PACKAGES.find((p) => p.id === packageId) ?? SERVICE_PACKAGES[1];
  const activeSlot = slots.find((s) => s.id === slotId);

  const handleNext = () => {
    setFieldErrors({});
    setSubmitError(null);

    if (step === 2) {
      if (!date || date < minDate) {
        setFieldErrors({ date: `Please select a date on or after ${minDate}.` });
        return;
      }
    }
    if (step === 3) {
      if (!slotId) {
        setFieldErrors({ slotId: 'Please choose an available studio time slot.' });
        return;
      }
    }
    if (step === 4) {
      const check = validateBookingInput({
        studioId,
        packageId,
        date,
        slotId,
        customerName,
        customerEmail,
        customerPhone,
        customerRole,
        blueprintFormat,
        projectAreaSqFt: Number(projectAreaSqFt),
        notes,
      });
      if (!check.valid) {
        setFieldErrors(check.errors);
        return;
      }
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studioId,
          packageId,
          date,
          slotId,
          customerName,
          customerEmail,
          customerPhone,
          customerRole,
          blueprintFormat,
          projectAreaSqFt: Number(projectAreaSqFt),
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors);
        throw new Error(data.error || 'Could not confirm your studio booking.');
      }
      setConfirmedBooking(data.booking);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong confirming your booking.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForNewBooking = () => {
    setConfirmedBooking(null);
    setStep(1);
    setFieldErrors({});
    setSubmitError(null);
  };

  return (
    <section
      id="book"
      className="bg-[#F5F2EB] text-[#191A18] py-10 md:py-14 border-b border-[#191A18]/10"
    >
      <div className="mx-auto max-w-[1360px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-[#B97856] font-medium mb-3">
                Reserve Your Studio Bay
              </p>
              <h2 className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.015em]">
                Book Your 1:1 Architectural Walkthrough.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <p className="text-sm md:text-base text-[#77746D] leading-relaxed">
                Select your session package, preferred India studio, and time slot. Submit your
                drawings in PDF or AutoCAD format after confirmation for pre-session calibration.
              </p>
            </Reveal>
          </div>
        </div>

        {confirmedBooking ? (
          <div
            data-testid="booking-confirmation"
            className="bg-white border border-[#191A18]/15 p-8 md:p-12 space-y-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#191A18]/12 pb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#B97856] font-medium">
                  Studio Reservation Confirmed
                </p>
                <h3 className="mt-2 font-serif text-3xl md:text-4xl text-[#191A18]">
                  We Look Forward to Welcoming You in {activeStudio.city}.
                </h3>
              </div>
              <div className="bg-[#F5F2EB] border border-[#191A18]/12 px-5 py-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#77746D]">
                  Booking Reference
                </p>
                <p className="font-mono text-base font-semibold text-[#191A18] tabular-nums mt-0.5">
                  {confirmedBooking.referenceId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.12em] text-[#77746D]">Service &amp; Fee</p>
                <p className="font-medium text-[#191A18]">{activePackage.name}</p>
                <p className="text-[#77746D]">{activePackage.shortTitle}</p>
                <p className="tabular-nums font-medium text-[#B97856] pt-1">
                  {formatINR(confirmedBooking.totalPriceInr)} · Advance{' '}
                  {formatINR(confirmedBooking.advanceAmountInr)}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.12em] text-[#77746D]">Date &amp; Time</p>
                <p className="font-medium text-[#191A18] tabular-nums">{confirmedBooking.date}</p>
                <p className="text-[#77746D] tabular-nums">{activeSlot?.label ?? confirmedBooking.slotId}</p>
                <p className="text-xs text-[#77746D] pt-1">{activeStudio.hours}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.12em] text-[#77746D]">Studio Address</p>
                <p className="font-medium text-[#191A18]">{activeStudio.city} Studio</p>
                <p className="text-[#77746D] leading-relaxed">{activeStudio.address}</p>
              </div>
            </div>

            <div className="bg-[#F5F2EB] p-5 border border-[#191A18]/10 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-[#191A18]/80 max-w-2xl leading-relaxed">
                Next Step: Share your {confirmedBooking.blueprintFormat} floor plan on WhatsApp or
                email to <span className="font-medium">{BUSINESS_CONTACT.email}</span> referencing{' '}
                <span className="font-mono">{confirmedBooking.referenceId}</span> so our engineers
                can calibrate your 1:1 projection prior to arrival.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={buildWhatsAppUrl(
                    BUSINESS_CONTACT.phoneRaw,
                    `Hello Walk The Plan! Booking Ref ${confirmedBooking.referenceId} confirmed for ${activeStudio.city} on ${confirmedBooking.date} (${activeSlot?.label ?? ''}). Sharing my ${confirmedBooking.blueprintFormat} floor plan next.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#191A18] text-[#F5F2EB] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] hover:bg-[#B97856] transition-colors whitespace-nowrap shrink-0"
                >
                  Send Plan via WhatsApp
                </a>
                <button
                  type="button"
                  onClick={resetForNewBooking}
                  className="border border-[#191A18]/25 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#191A18] hover:border-[#191A18] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Multi-Step Form Panel */}
            <Reveal delay={0.08} yOffset={30} className="lg:col-span-8">
            <div className="bg-white border border-[#191A18]/12 p-6 md:p-10">
              {/* Step Progress Bar */}
              <div
                aria-label="Booking progress"
                className="flex flex-wrap items-center gap-y-3 gap-x-6 border-b border-[#191A18]/10 pb-6 mb-8"
              >
                {STEPS.map((s) => {
                  const isCurrent = step === s.num;
                  const isDone = step > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      disabled={s.num > step}
                      onClick={() => s.num < step && setStep(s.num)}
                      className={`inline-flex items-center gap-2 text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                        isCurrent
                          ? 'text-[#191A18]'
                          : isDone
                            ? 'text-[#B97856] cursor-pointer'
                            : 'text-[#77746D]/60 cursor-default'
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-[11px] tabular-nums border ${
                          isCurrent
                            ? 'bg-[#191A18] text-[#F5F2EB] border-[#191A18]'
                            : isDone
                              ? 'bg-[#B97856] text-white border-[#B97856]'
                              : 'border-[#191A18]/20 text-[#77746D]'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step 1: Select Service & Studio */}
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-serif text-2xl text-[#191A18] mb-4">
                      1. Choose Your Session Package
                    </h3>
                    <div className="space-y-3">
                      {SERVICE_PACKAGES.map((pkg) => {
                        const selected = pkg.id === packageId;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setPackageId(pkg.id)}
                            className={`w-full text-left p-5 border transition-colors cursor-pointer ${
                              selected
                                ? 'border-[#191A18] bg-[#F5F2EB]'
                                : 'border-[#191A18]/15 bg-white hover:border-[#B97856]'
                            }`}
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2.5 text-xs text-[#77746D]">
                                  <span className="tabular-nums font-medium text-[#B97856]">
                                    {pkg.code}
                                  </span>
                                  <span>·</span>
                                  <span>{pkg.durationLabel}</span>
                                  {pkg.isPopular && (
                                    <>
                                      <span>·</span>
                                      <span className="text-[#B97856] font-semibold">
                                        Most Popular
                                      </span>
                                    </>
                                  )}
                                </div>
                                <p className="font-serif text-2xl text-[#191A18] mt-1">
                                  {pkg.name} — {pkg.shortTitle}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-serif text-2xl text-[#191A18] tabular-nums">
                                  {formatINR(pkg.priceInr)}
                                </p>
                                <p className="text-[11px] text-[#77746D] tabular-nums">
                                  Booking advance {formatINR(pkg.advanceInr)}
                                </p>
                              </div>
                            </div>
                            <p className="mt-2.5 text-sm text-[#77746D] leading-relaxed">
                              {pkg.summary}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl text-[#191A18] mb-3">
                      Select Studio Location
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {STUDIO_LOCATIONS.map((studio) => {
                        const selected = studio.id === studioId;
                        return (
                          <button
                            key={studio.id}
                            type="button"
                            onClick={() => setStudioId(studio.id)}
                            className={`px-3 py-3 text-xs font-medium border text-center transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              selected
                                ? 'bg-[#191A18] text-[#F5F2EB] border-[#191A18]'
                                : 'bg-white text-[#191A18] border-[#191A18]/15 hover:border-[#B97856]'
                            }`}
                          >
                            {studio.city}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Choose Date */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#191A18]">
                      2. Choose Your Walkthrough Date
                    </h3>
                    <p className="mt-1 text-sm text-[#77746D]">
                      All five studios operate Monday through Sunday from 10:00 AM to 7:00 PM.
                    </p>
                  </div>

                  <div className="max-w-sm">
                    <label
                      htmlFor="booking-date"
                      className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-2"
                    >
                      Preferred Studio Date
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-[#191A18]/25 bg-[#F5F2EB] px-4 py-3 text-sm text-[#191A18] focus:border-[#B97856] focus:outline-none"
                    />
                    {fieldErrors.date && (
                      <p className="mt-2 text-xs text-[#9e3f22]">{fieldErrors.date}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Choose Time Slot */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#191A18]">
                      3. Choose an Available Time Slot
                    </h3>
                    <p className="mt-1 text-sm text-[#77746D]">
                      Live bay availability at {activeStudio.city} Studio on{' '}
                      <span className="tabular-nums font-medium text-[#191A18]">{date}</span> for{' '}
                      {activePackage.durationLabel}.
                    </p>
                  </div>

                  {loadingSlots ? (
                    <p className="text-sm text-[#77746D]">Checking studio bay availability...</p>
                  ) : slotsError ? (
                    <p className="text-sm text-[#9e3f22]">{slotsError}</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {slots.map((slot) => {
                        const selected = slot.id === slotId;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSlotId(slot.id)}
                            className={`p-4 border text-left transition-colors ${
                              !slot.available
                                ? 'border-[#191A18]/10 bg-[#F5F2EB]/60 text-[#77746D]/60 cursor-not-allowed'
                                : selected
                                  ? 'border-[#191A18] bg-[#191A18] text-[#F5F2EB] cursor-pointer'
                                  : 'border-[#191A18]/20 bg-white text-[#191A18] hover:border-[#B97856] cursor-pointer'
                            }`}
                          >
                            <p className="font-medium text-sm tabular-nums">{slot.label}</p>
                            <p
                              className={`text-xs mt-1 ${
                                selected ? 'text-[#E8E3D9]/80' : 'text-[#77746D]'
                              }`}
                            >
                              {slot.available ? 'Available' : slot.reason ?? 'Unavailable'}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {fieldErrors.slotId && (
                    <p className="text-xs text-[#9e3f22]">{fieldErrors.slotId}</p>
                  )}
                </div>
              )}

              {/* Step 4: Enter Customer Details */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#191A18]">
                      4. Project &amp; Contact Details
                    </h3>
                    <p className="mt-1 text-sm text-[#77746D]">
                      Provide your contact details so our spatial coordinator can prepare your CAD
                      or PDF projection file.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="booking-name"
                        className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm focus:border-[#B97856] focus:outline-none"
                      />
                      {fieldErrors.customerName && (
                        <p className="mt-1 text-xs text-[#9e3f22]">{fieldErrors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-email"
                        className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm focus:border-[#B97856] focus:outline-none"
                      />
                      {fieldErrors.customerEmail && (
                        <p className="mt-1 text-xs text-[#9e3f22]">{fieldErrors.customerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                      >
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm focus:border-[#B97856] focus:outline-none"
                      />
                      {fieldErrors.customerPhone && (
                        <p className="mt-1 text-xs text-[#9e3f22]">{fieldErrors.customerPhone}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="booking-role"
                        className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                      >
                        I am booking as
                      </label>
                      <select
                        id="booking-role"
                        value={customerRole}
                        onChange={(e) =>
                          setCustomerRole(e.target.value as BookingInput['customerRole'])
                        }
                        className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm focus:border-[#B97856] focus:outline-none"
                      >
                        <option value="Homeowner">Homeowner</option>
                        <option value="Architect">Architect</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Builder / Developer">Builder / Developer</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="booking-format"
                        className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                      >
                        Floor Plan Format
                      </label>
                      <select
                        id="booking-format"
                        value={blueprintFormat}
                        onChange={(e) =>
                          setBlueprintFormat(e.target.value as BookingInput['blueprintFormat'])
                        }
                        className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm focus:border-[#B97856] focus:outline-none"
                      >
                        <option value="DWG / AutoCAD">DWG / AutoCAD</option>
                        <option value="PDF Floor Plan">PDF Floor Plan</option>
                        <option value="Revit / BIM">Revit / BIM</option>
                        <option value="Need Design Assistance">Need Design Assistance</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="booking-area"
                        className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                      >
                        Approximate Area (sq.ft.) *
                      </label>
                      <input
                        id="booking-area"
                        type="number"
                        min={300}
                        max={50000}
                        value={projectAreaSqFt}
                        onChange={(e) => setProjectAreaSqFt(e.target.value)}
                        className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm tabular-nums focus:border-[#B97856] focus:outline-none"
                      />
                      {fieldErrors.projectAreaSqFt && (
                        <p className="mt-1 text-xs text-[#9e3f22]">
                          {fieldErrors.projectAreaSqFt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-notes"
                      className="block text-xs uppercase tracking-[0.12em] text-[#77746D] mb-1.5"
                    >
                      Project Notes (Optional)
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Number of floors, family members attending, or specific rooms to validate"
                      className="w-full border border-[#191A18]/20 bg-[#F5F2EB] px-4 py-3 text-sm focus:border-[#B97856] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Confirm Booking */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-[#191A18]">
                      5. Review &amp; Confirm Reservation
                    </h3>
                    <p className="mt-1 text-sm text-[#77746D]">
                      Verify your studio session schedule and advance settlement rules before
                      confirming.
                    </p>
                  </div>

                  <div className="bg-[#F5F2EB] border border-[#191A18]/10 p-6 space-y-4 text-sm">
                    <div className="flex justify-between gap-4 border-b border-[#191A18]/10 pb-3">
                      <span className="text-[#77746D]">Package</span>
                      <span className="font-medium text-right">
                        {activePackage.name} ({activePackage.shortTitle})
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#191A18]/10 pb-3">
                      <span className="text-[#77746D]">Studio</span>
                      <span className="font-medium text-right">{activeStudio.city}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#191A18]/10 pb-3">
                      <span className="text-[#77746D]">Date &amp; Slot</span>
                      <span className="font-medium tabular-nums text-right">
                        {date} · {activeSlot?.label ?? slotId}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#191A18]/10 pb-3">
                      <span className="text-[#77746D]">Visitor</span>
                      <span className="font-medium text-right">
                        {customerName} ({customerRole})
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[#191A18]/10 pb-3">
                      <span className="text-[#77746D]">Session Fee</span>
                      <span className="font-medium tabular-nums text-right">
                        {formatINR(activePackage.priceInr)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#77746D]">Advance Settlement Due at Confirmation</span>
                      <span className="font-semibold text-[#B97856] tabular-nums text-right">
                        {formatINR(activePackage.advanceInr)} (Remaining{' '}
                        {formatINR(activePackage.priceInr - activePackage.advanceInr)} at studio)
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-sm text-[#9e3f22] bg-[#9e3f22]/10 p-3">{submitError}</p>
                  )}
                </div>
              )}

              {/* Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-[#191A18]/10 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="inline-flex items-center gap-2 border border-[#191A18]/25 px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#191A18] hover:border-[#191A18] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <span />
                )}

                {step < 5 ? (
                  <MagneticButton
                    key="booking-next"
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 bg-[#191A18] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-[#F5F2EB] hover:bg-[#B97856] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    key="booking-confirm"
                    type="button"
                    disabled={submitting}
                    onClick={handleConfirmBooking}
                    className="inline-flex items-center gap-2 bg-[#B97856] px-7 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white hover:bg-[#a66847] disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>{submitting ? 'Confirming Reservation...' : 'Confirm Booking'}</span>
                    <Check className="w-4 h-4" />
                  </MagneticButton>
                )}
              </div>
            </div>
            </Reveal>

            {/* Live Booking Summary Sidebar */}
            <Reveal delay={0.16} yOffset={30} className="lg:col-span-4">
            <aside className="bg-[#191A18] text-[#F5F2EB] p-6 md:p-8 space-y-6">
              <div className="border-b border-white/12 pb-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#B97856]">
                  Selected Experience
                </p>
                <h3 className="mt-1 font-serif text-2xl text-white">{activePackage.name}</h3>
                <p className="text-xs text-[#E8E3D9]/75 mt-1">{activePackage.shortTitle}</p>
              </div>

              <div className="space-y-3 text-xs text-[#E8E3D9]/85">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#B97856] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">{activeStudio.city} Studio</p>
                    <p className="text-[#E8E3D9]/65 mt-0.5 leading-relaxed">
                      {activeStudio.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#B97856] shrink-0" />
                  <span className="tabular-nums">{date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#B97856] shrink-0" />
                  <span className="tabular-nums">
                    {activeSlot?.label
                      ? `${activeSlot.label} (Editable in Step 3)`
                      : 'Select slot in Step 3'}{' '}
                    · {activePackage.durationLabel}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/12 pt-5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#E8E3D9]/70">Total Package Fee</span>
                  <span className="font-medium text-white tabular-nums">
                    {formatINR(activePackage.priceInr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E8E3D9]/70">Advance Reservation</span>
                  <span className="font-medium text-[#B97856] tabular-nums">
                    {formatINR(activePackage.advanceInr)}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/12 pt-5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#E8E3D9]/60 mb-2.5">
                  Included Deliverables
                </p>
                <ul className="space-y-2 text-xs text-[#E8E3D9]/80">
                  {activePackage.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#B97856] shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
