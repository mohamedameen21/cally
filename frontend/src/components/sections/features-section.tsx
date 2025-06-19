import React from "react";
import { CalendarDays, Clock, Users } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-muted/50 py-20">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to schedule efficiently
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<CalendarDays className="h-10 w-10 text-primary" />}
            title="Easy scheduling"
            description="Share your Cally link and let others pick available time slots that work for them."
          />
          <FeatureCard
            icon={<Clock className="h-10 w-10 text-primary" />}
            title="Time zone detection"
            description="Times automatically show in your invitee's time zone to avoid confusion."
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Team scheduling"
            description="Create shared team pages to coordinate meetings across multiple team members."
          />
        </div>
      </div>
    </section>
  );
};
