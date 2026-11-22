import { useMotionValue, motion, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface InteractiveHoverLinksProps {
  links?: typeof INTERACTIVE_LINKS;
  onItemClick?: (href: string) => void;
  className?: string;
}

export function InteractiveHoverLinks({
  links = INTERACTIVE_LINKS,
  onItemClick,
  className = "",
}: InteractiveHoverLinksProps) {
  return (
    <section className={`bg-transparent p-2 md:p-4 w-full ${className}`}>
      <div className="mx-auto w-full">
        {links.map((link) => (
          <Link key={link.heading} {...link} onLinkClick={onItemClick} />
        ))}
      </div>
    </section>
  );
}

interface LinkProps {
  heading: string;
  imgSrc: string;
  subheading: string;
  href: string;
  onLinkClick?: (href: string) => void;
}

function Link({ heading, imgSrc, subheading, href, onLinkClick }: LinkProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "40%"]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
    }
  };

  return (
    <motion.a
      href={href}
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      initial="initial"
      whileHover="whileHover"
      className="group relative flex items-center justify-between border-b border-[#C47B52]/20 py-3.5 transition-colors duration-300 hover:border-[#C47B52] md:py-5"
    >
      <div>
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: -8 },
          }}
          transition={{
            type: "spring",
            staggerChildren: 0.05,
            delayChildren: 0.1,
          }}
          className="relative z-10 block font-serif text-2xl font-medium text-[#F2EDE5]/75 transition-colors duration-300 group-hover:text-[#F2EDE5] md:text-4xl"
        >
          {heading.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { x: 0 },
                whileHover: { x: 12 },
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="inline-block"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </motion.span>
        <span className="relative z-10 mt-1 block text-xs md:text-sm text-[#A5A7A4] transition-colors duration-300 group-hover:text-[#C47B52]">
          {subheading}
        </span>
      </div>

      <motion.img
        style={{
          top,
          left,
          translateX: "-10%",
          translateY: "-50%",
        }}
        variants={{
          initial: { scale: 0, rotate: "-12.5deg", opacity: 0 },
          whileHover: { scale: 1, rotate: "10deg", opacity: 1 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        src={imgSrc}
        className="pointer-events-none absolute z-20 h-20 w-28 rounded-lg object-cover shadow-2xl md:h-36 md:w-52 border border-[#C47B52]/40"
        alt={`Image representing ${heading}`}
      />

      <div className="overflow-hidden pl-4">
        <motion.div
          variants={{
            initial: {
              x: "100%",
              opacity: 0,
            },
            whileHover: {
              x: "0%",
              opacity: 1,
            },
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 p-2 text-[#C47B52]"
        >
          <ArrowRight className="size-5 md:size-8 text-[#C47B52]" />
        </motion.div>
      </div>
    </motion.a>
  );
}

export const INTERACTIVE_LINKS = [
  {
    heading: "About",
    subheading: "Step inside your future home before it exists",
    imgSrc:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    href: "#experience",
  },
  {
    heading: "Services",
    subheading: "Architectural validation & 1:1 scale projection",
    imgSrc:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    href: "#services",
  },
  {
    heading: "Franchise",
    subheading: "Studio expansion opportunities across India",
    imgSrc:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    href: "#studios",
  },
  {
    heading: "Gallery",
    subheading: "Explore real-scale walkthrough portfolio",
    imgSrc:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    href: "#gallery",
  },
  {
    heading: "Blog",
    subheading: "Insights on spatial computing & architectural tech",
    imgSrc:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    href: "#process",
  },
  {
    heading: "WhatsApp",
    subheading: "Direct consultation with our architectural team",
    imgSrc:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
    href: "https://wa.me/919711022075?text=Hello%20Walk%20The%20Plan%2C%20I%20would%20like%20to%20inquire%20about%20a%20walkthrough%20session.",
  },
  {
    heading: "Book Appointment",
    subheading: "Reserve your dedicated 1:1 spatial session",
    imgSrc:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
    href: "#book",
  },
];
