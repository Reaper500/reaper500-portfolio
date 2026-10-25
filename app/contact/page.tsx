import type { Metadata } from "next";
import { Contact } from "@/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kibang Virtue (Reaper500) about collaborations, technology, or software conversations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-6">
      <Contact />
    </div>
  );
}
