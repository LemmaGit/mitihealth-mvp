import type{ ElementType } from "react";

export interface StatItem {
  label: string;
  value: string;
  icon: ElementType;
  sub?: string;
}

export default function UserStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl bg-card p-5 shadow-botanical">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </span>
            <stat.icon size={16} className="text-primary" />
          </div>
          <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
          {stat.sub && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              {stat.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
