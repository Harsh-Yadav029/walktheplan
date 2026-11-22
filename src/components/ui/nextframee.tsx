import React from 'react';
import { cn } from '@/lib/utils';

export interface NfButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
  children: React.ReactNode;
}

export function NfButton({
  variant = 'primary',
  className,
  children,
  ...props
}: NfButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-sans transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary:
      'h-[54px] px-8 rounded-full bg-white text-black font-semibold text-sm tracking-[0.06em] hover:bg-neutral-200 shadow-[0_0_25px_rgba(255,255,255,0.2)] focus-visible:outline-2 focus-visible:outline-white',
    secondary:
      'h-[54px] px-8 rounded-full bg-[#AF46FF] text-white font-semibold text-sm tracking-[0.06em] hover:bg-[#9732e6] shadow-[0_0_30px_rgba(175,70,255,0.35)] focus-visible:outline-2 focus-visible:outline-[#AF46FF]',
    link: 'bg-transparent text-white underline underline-offset-4 hover:text-neutral-300 font-normal text-sm p-0 h-auto',
  };

  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export interface NfCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function NfCard({ className, children, ...props }: NfCardProps) {
  return (
    <div
      className={cn(
        'bg-[#050505] text-white border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface NfInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function NfInput({ className, ...props }: NfInputProps) {
  return (
    <input
      className={cn(
        'h-[54px] px-6 rounded-full bg-[#050505] border border-white/10 text-white font-mono text-sm tracking-[1px] placeholder:text-white/40 focus:outline-none focus:border-[#9CCBFF] focus:ring-1 focus:ring-[#9CCBFF] transition-all',
        className
      )}
      {...props}
    />
  );
}

export interface NfChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function NfChip({ className, children, ...props }: NfChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#364254]/40 border border-[#364254] text-white font-mono text-xs tracking-[1px]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function NfEyebrow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-mono text-xs uppercase tracking-[0.2em] font-light text-[#9CCBFF] mb-3',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
