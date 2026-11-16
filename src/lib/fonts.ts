import { Zen_Kaku_Gothic_New } from "next/font/google";

// One family for the whole site; weight carries the hierarchy.
export const zen = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-display",
  display: "swap",
});
