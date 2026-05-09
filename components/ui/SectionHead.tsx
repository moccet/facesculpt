import type { ReactNode } from "react";
import "@/app/globals.css";

type Props = {
  step?: string;
  title: ReactNode;
  sub?: ReactNode;
  centered?: boolean;
  trailing?: ReactNode;
};

export function SectionHead({ step, title, sub, centered = false, trailing }: Props) {
  return (
    <div className={`sectionHead ${centered ? "sectionHeadCenter" : ""}`}>
      {trailing ? (
        <div className="sectionHeadRow">
          <div>
            {step && <div className="sectionStep">{step}</div>}
            <h2 className="sectionH2">{title}</h2>
          </div>
          {trailing}
        </div>
      ) : (
        <>
          {step && <div className="sectionStep">{step}</div>}
          <h2 className="sectionH2">{title}</h2>
        </>
      )}
      {sub && <p className="sectionSub">{sub}</p>}
    </div>
  );
}
