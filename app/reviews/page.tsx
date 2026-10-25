import type { Metadata } from "next";
import { TechReviews } from "@/sections/TechReviews";

export const metadata: Metadata = {
  title: "Tech Reviews",
  description:
    "Technology reviews, developer tool notes, language comparisons, and AI experiments — written plainly and without hype.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <div className="pt-6">
      <TechReviews />
    </div>
  );
}
