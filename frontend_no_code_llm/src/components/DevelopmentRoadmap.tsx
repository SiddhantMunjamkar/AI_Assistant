"use client";

import { motion } from "motion/react";

export function DevelopmentRoadmap() {
  return (
    <div className="relative w-full max-w-5xl mx-auto px-4">
      <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-black/0 to-black/80 z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 mb-4">
          Build amazing websites
          <br />
          at warp speed
        </h1>

        <div className="mt-12 space-y-8 text-left w-full max-w-2xl">
          <RoadmapItem number="01" title="Development Order">
            Vite + Tailwind + React.
          </RoadmapItem>

          <RoadmapItem number="02" title="Build PromptInput">
            Mock API call → returns dummy React/CSS/HTML.
          </RoadmapItem>

          <RoadmapItem number="03" title="Integrate Monaco Editor">
            Use @monaco-editor/react → load mock code.
          </RoadmapItem>

          <RoadmapItem number="04" title="Create LivePreviewPane">
            <div className="space-y-4">
              <p>Option A: Use iframe and inject code as string.</p>
              <p>Option B: Use a sandboxed dangerouslySetInnerHTML for HTML/CSS, and evaluate React in iframe.</p>
            </div>
          </RoadmapItem>

          <RoadmapItem number="05" title="Sync State">
            Sync state between input → backend → editor → preview.
          </RoadmapItem>
        </div>
      </motion.div>
    </div>
  );
}

function RoadmapItem({ 
  number, 
  title, 
  children 
}: { 
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative pl-12 group"
    >
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm text-zinc-400">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-zinc-200 transition-colors">
          {title}
        </h3>
        <div className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {children}
        </div>
      </div>
    </motion.div>
  );
} 