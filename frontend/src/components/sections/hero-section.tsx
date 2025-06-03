import React from "react";
import { Button } from "@/components/ui/button";

export const HeroSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Streamline Your Client Communications
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            All-in-one platform for scheduling, messaging, and managing client
            relationships with ease and efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="aspect-square lg:aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden border border-border/50">
            {/* Calendar Scheduling Illustration */}
            <svg
              className="w-full h-full p-8"
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background gradient */}
              <rect
                width="400"
                height="300"
                fill="url(#heroGradient)"
                rx="16"
              />

              {/* Calendar Grid */}
              <rect
                x="80"
                y="60"
                width="240"
                height="180"
                rx="12"
                fill="white"
                fillOpacity="0.95"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />

              {/* Calendar Header */}
              <rect
                x="80"
                y="60"
                width="240"
                height="40"
                rx="12"
                fill="#FF5A5F"
              />
              <text
                x="200"
                y="85"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="600"
              >
                December 2024
              </text>

              {/* Calendar Days Header */}
              <g fill="#666666" fontSize="10" fontWeight="500">
                <text x="100" y="125" textAnchor="middle">
                  S
                </text>
                <text x="130" y="125" textAnchor="middle">
                  M
                </text>
                <text x="160" y="125" textAnchor="middle">
                  T
                </text>
                <text x="190" y="125" textAnchor="middle">
                  W
                </text>
                <text x="220" y="125" textAnchor="middle">
                  T
                </text>
                <text x="250" y="125" textAnchor="middle">
                  F
                </text>
                <text x="280" y="125" textAnchor="middle">
                  S
                </text>
              </g>

              {/* Calendar Date Grid */}
              <g fill="#333333" fontSize="12">
                {/* Week 1 */}
                <text x="100" y="150" textAnchor="middle" opacity="0.4">
                  1
                </text>
                <text x="130" y="150" textAnchor="middle">
                  2
                </text>
                <text x="160" y="150" textAnchor="middle">
                  3
                </text>
                <text x="190" y="150" textAnchor="middle">
                  4
                </text>
                <text x="220" y="150" textAnchor="middle">
                  5
                </text>
                <text x="250" y="150" textAnchor="middle">
                  6
                </text>
                <text x="280" y="150" textAnchor="middle">
                  7
                </text>

                {/* Week 2 */}
                <text x="100" y="170" textAnchor="middle">
                  8
                </text>
                <text x="130" y="170" textAnchor="middle">
                  9
                </text>
                <text x="160" y="170" textAnchor="middle">
                  10
                </text>
                <text x="190" y="170" textAnchor="middle">
                  11
                </text>
                <text x="220" y="170" textAnchor="middle">
                  12
                </text>
                <text x="250" y="170" textAnchor="middle">
                  13
                </text>
                <text x="280" y="170" textAnchor="middle">
                  14
                </text>

                {/* Week 3 with highlighted date */}
                <text x="100" y="190" textAnchor="middle">
                  15
                </text>
                <text x="130" y="190" textAnchor="middle">
                  16
                </text>
                <text x="160" y="190" textAnchor="middle">
                  17
                </text>
                <text x="190" y="190" textAnchor="middle">
                  18
                </text>
                <text x="220" y="190" textAnchor="middle">
                  19
                </text>
                <text x="250" y="190" textAnchor="middle">
                  20
                </text>
                <text x="280" y="190" textAnchor="middle">
                  21
                </text>
              </g>

              {/* Highlighted Available Slots */}
              <circle
                cx="160"
                cy="185"
                r="12"
                fill="#FF5A5F"
                fillOpacity="0.2"
                stroke="#FF5A5F"
                strokeWidth="2"
              />
              <circle
                cx="220"
                cy="185"
                r="12"
                fill="#FF5A5F"
                fillOpacity="0.2"
                stroke="#FF5A5F"
                strokeWidth="2"
              />
              <circle
                cx="250"
                cy="185"
                r="12"
                fill="#FF5A5F"
                fillOpacity="0.2"
                stroke="#FF5A5F"
                strokeWidth="2"
              />

              {/* Time Slots Panel */}
              <rect
                x="340"
                y="80"
                width="120"
                height="140"
                rx="8"
                fill="white"
                fillOpacity="0.95"
                stroke="#E5E5E5"
                strokeWidth="1"
              />
              <text
                x="400"
                y="100"
                textAnchor="middle"
                fill="#333333"
                fontSize="12"
                fontWeight="600"
              >
                Available Times
              </text>

              {/* Time Slot Items */}
              <g fill="#666666" fontSize="10">
                <rect
                  x="350"
                  y="110"
                  width="100"
                  height="20"
                  rx="4"
                  fill="#FF5A5F"
                  fillOpacity="0.1"
                />
                <text x="400" y="123" textAnchor="middle" fill="#FF5A5F">
                  9:00 AM
                </text>

                <rect
                  x="350"
                  y="135"
                  width="100"
                  height="20"
                  rx="4"
                  fill="#F5F5F5"
                />
                <text x="400" y="148" textAnchor="middle">
                  10:30 AM
                </text>

                <rect
                  x="350"
                  y="160"
                  width="100"
                  height="20"
                  rx="4"
                  fill="#F5F5F5"
                />
                <text x="400" y="173" textAnchor="middle">
                  2:00 PM
                </text>

                <rect
                  x="350"
                  y="185"
                  width="100"
                  height="20"
                  rx="4"
                  fill="#F5F5F5"
                />
                <text x="400" y="198" textAnchor="middle">
                  4:30 PM
                </text>
              </g>

              {/* Floating User Avatar */}
              <circle
                cx="60"
                cy="80"
                r="24"
                fill="#FF5A5F"
                fillOpacity="0.1"
                stroke="#FF5A5F"
                strokeWidth="2"
              />
              <circle cx="60" cy="80" r="16" fill="#FF5A5F" fillOpacity="0.2" />
              <text
                x="60"
                y="85"
                textAnchor="middle"
                fill="#FF5A5F"
                fontSize="14"
                fontWeight="600"
              >
                JD
              </text>

              {/* Connection Lines */}
              <path
                d="M84 80 L80 80"
                stroke="#FF5A5F"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <path
                d="M320 150 L340 150"
                stroke="#FF5A5F"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Notification Badge */}
              <circle cx="340" cy="60" r="8" fill="#FF5A5F" />
              <text
                x="340"
                y="65"
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="600"
              >
                3
              </text>

              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating elements for visual appeal */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute top-1/4 -right-2 w-16 h-16 bg-primary/15 rounded-full blur-lg" />
        </div>
      </div>
    </section>
  );
};
