import React from "react";
import { StepCard } from "@/components/step-card";

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How Cally works
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <StepCard
            number={1}
            title="Create your schedule"
            description="Set your availability preferences and connect your calendar."
          />
          <StepCard
            number={2}
            title="Share your booking link"
            description="Send your personalized Cally link to anyone who wants to meet with you."
          />
          <StepCard
            number={3}
            title="Get booked"
            description="Invitees select a time, and the event is added to everyone's calendars."
          />
        </div>
      </div>
    </section>
  );
};
