import React from "react";
import { Button } from "@/components/ui/button";

export const CtaSection: React.FC = () => {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container text-center mx-auto">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to simplify your scheduling?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Join thousands of professionals who use Cally to save time and focus
          on what matters.
        </p>
        <Button
          size="lg"
          className="mt-10 bg-white text-primary hover:bg-white/90"
        >
          Sign up for free
        </Button>
      </div>
    </section>
  );
};
