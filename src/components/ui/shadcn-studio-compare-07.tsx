import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type CompareIcon = string | { light: string; dark: string };

export interface CompareColumnHeader {
  /** Image URL, or a light/dark pair of URLs. */
  icon?: CompareIcon;
  title: string;
}

export interface CompareFeature {
  name: string;
  column1: ReactNode;
  column2: ReactNode;
  column3: ReactNode;
}

export interface ComparisonData {
  features: CompareFeature[];
  column1Header: CompareColumnHeader;
  column2Header: CompareColumnHeader;
  column3Header: string;
}

export interface Compare07Props {
  /** Comparison table content. */
  data?: ComparisonData;
  /** Section heading. */
  title?: string;
  /** Text under the heading. */
  description?: string;
  /** Label of the first (feature name) column. */
  featuresLabel?: string;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 UI primitives                              */
/* -------------------------------------------------------------------------- */

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "group/card bg-[#181A1B] text-[#F2EDE5] border border-[#C47B52]/20 flex flex-col gap-4 overflow-hidden rounded-2xl py-4 text-sm shadow-2xl",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const emptyData: ComparisonData = {
  features: [],
  column1Header: { title: "" },
  column2Header: { title: "" },
  column3Header: "",
};

const headerCellClassName = "h-20 p-5 text-left text-sm sm:text-base font-serif font-bold tracking-wider uppercase";

function HeaderIcon({ icon, className }: { icon: CompareIcon; className: string }) {
  if (typeof icon === "string") {
    return <img src={icon} alt="" className={className} />;
  }

  return (
    <>
      <img src={icon.light} alt="" className={cn(className, "dark:hidden")} />
      <img src={icon.dark} alt="" className={cn(className, "hidden dark:block")} />
    </>
  );
}

function ColumnHeaderCell({
  header,
  iconClassName,
  className,
}: {
  header: CompareColumnHeader;
  iconClassName: string;
  className?: string;
}) {
  return (
    <th scope="col" className={cn(headerCellClassName, "w-64 md:w-72", className)}>
      <div className="flex items-center gap-3">
        {header.icon && <HeaderIcon icon={header.icon} className={iconClassName} />}
        <span>{header.title}</span>
      </div>
    </th>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Block                                   */
/* -------------------------------------------------------------------------- */

export const CompareUILib = ({
  data = emptyData,
  title,
  description,
  featuresLabel = "FEATURE / CAPABILITY",
  className,
}: Compare07Props) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Optional Header */}
        {(title || description) && (
          <div className="space-y-4 text-center">
            {title && (
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[#A5A7A4] mx-auto max-w-3xl text-sm sm:text-base md:text-lg font-light leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Comparison Table */}
        <Card
          role="region"
          aria-label={title || "Comparison Table"}
          tabIndex={0}
          className="focus-visible:ring-[#C47B52]/50 overflow-hidden overflow-x-auto py-0 outline-none focus-visible:ring-2 border border-white/10"
        >
          <table className="w-full border-collapse min-w-[760px]">
            <caption className="sr-only">{title || "Comparison Table"}</caption>
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10">
                <th
                  scope="col"
                  className={cn(
                    headerCellClassName,
                    "w-60 md:w-72 text-[#C47B52] font-mono text-xs uppercase tracking-widest"
                  )}
                >
                  {featuresLabel}
                </th>
                <ColumnHeaderCell
                  header={data.column1Header}
                  iconClassName="size-6 rounded-lg"
                  className="min-w-44 text-[#E5E0D8]"
                />
                <ColumnHeaderCell
                  header={data.column2Header}
                  iconClassName="size-6 rounded-lg"
                  className="min-w-44 text-[#E5E0D8]"
                />
                <th
                  scope="col"
                  className={cn(
                    headerCellClassName,
                    "bg-[#C47B52]/15 text-[#EED77A] font-serif font-bold border-l border-[#C47B52]/30 min-w-56"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{data.column3Header}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sm">
              {data.features.map((feature) => (
                <tr key={feature.name} className="transition-colors hover:bg-white/[0.02]">
                  <th scope="row" className="p-5 text-left font-normal align-middle">
                    <div className="text-sm sm:text-base font-semibold text-white">
                      {feature.name}
                    </div>
                  </th>
                  <td className="p-5 align-middle text-xs sm:text-sm text-[#A5A7A4] leading-relaxed">
                    {feature.column1}
                  </td>
                  <td className="p-5 align-middle text-xs sm:text-sm text-[#A5A7A4] leading-relaxed">
                    {feature.column2}
                  </td>
                  <td className="p-5 align-middle text-xs sm:text-sm text-[#F2EDE5] leading-relaxed bg-[#C47B52]/[0.08] border-l border-[#C47B52]/30 font-medium">
                    {feature.column3}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default CompareUILib;
