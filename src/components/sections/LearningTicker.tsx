import { Package } from "lucide-react";
import { LEARNING_ITEMS } from "@/data/portfolio";

export function LearningTicker() {
  return (
    <div className="py-8 overflow-hidden border-y border-border bg-secondary/30">
      <div className="flex items-center gap-4 w-max animate-ticker">
        {[...LEARNING_ITEMS, ...LEARNING_ITEMS].map((item, i) => (
          <span key={i} className="font-mono text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
            <Package size={10} className="text-primary" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
