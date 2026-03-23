import { Leaf } from "lucide-react";

//TODO: Add actual image of the plant or other background image
export default function DecorativeLeft() {
  return (
    <div className="relative hidden flex-1 overflow-hidden rounded-2xl botanical-gradient p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
            <div>
              <span className="inline-block rounded bg-primary-foreground/15 px-3 py-1 text-xs uppercase tracking-widest">
                Ethnobotanical Excellence
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold leading-tight">
                Ancient wisdom,
                <br />
                <span className="text-primary-foreground/70">Clinical precision.</span>
              </h2>
            </div>

            {/* Decorative leaf placeholder */}
            <div className="mt-8 flex-1 rounded-xl bg-primary-foreground/10" />

            <div className="mt-6 flex items-start gap-3">
              <div className="rounded-full bg-primary-foreground/20 p-2">
                <Leaf size={18} />
              </div>
              <p className="text-sm leading-relaxed text-primary-foreground/80">
                Access over 500 certified herbal practitioners and traditional Ethiopian botanical remedies from the comfort of your home.
              </p>
            </div>
          </div>
  )
}
