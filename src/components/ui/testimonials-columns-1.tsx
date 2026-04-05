"use client";
import React from "react";
import { motion } from "motion/react";

export const testimonials = [
  {
    text: "AUSH Relay completely eliminated manual data entry for our intake process. We upload a document and the form fills itself. It's genuinely magical.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Setup took under 10 minutes. Our team was submitting forms the same day. The OCR accuracy on printed documents is impressive.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The fact that documents never leave the browser was the deciding factor for us. HIPAA-sensitive workflows need that level of privacy.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Compliance Lead",
  },
  {
    text: "We process over 200 intake forms per week. AUSH Relay cut our processing time by 70%. The PDF export alone is worth it.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Client onboarding used to take 20 minutes of manual entry. Now it's under 3 minutes. Our clients notice the difference immediately.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The multi-step form flow is clean and professional. Our clients feel confident submitting sensitive documents through it.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "We switched from a manual PDF process. AUSH Relay auto-fills from IDs and invoices with near-perfect accuracy every time.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Operations Director",
  },
  {
    text: "The progress indicator and review step before submission reduced our error rate to almost zero. Huge win for our legal team.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Legal Coordinator",
  },
  {
    text: "Finally a form tool that understands enterprise needs. The Supabase integration means our data is secure and always available.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Head of Digital",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-6 rounded-2xl border border-[#E4E4E7] dark:border-[#2A2A2A] bg-white dark:bg-[#111] shadow-sm max-w-xs w-full"
                key={i}
              >
                <p className="text-[14px] text-[#3F3F46] dark:text-[#A1A1AA] leading-relaxed">{text}</p>
                <div className="flex items-center gap-3 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="text-[13px] font-semibold text-[#0A0A0A] dark:text-white leading-5">{name}</div>
                    <div className="text-[12px] text-[#71717A] dark:text-[#666] leading-5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  );
};
