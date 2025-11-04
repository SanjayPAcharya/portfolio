import React, { useState } from "react";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import EC2ControlInline from "./EC2ControlInline";
import LiveSSEDashboardGIF from "../assets/Live-SSE-Dashboard.gif";
import CompressDecompress from "../assets/compress-decompress.png";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  image: string;
  github?: string;
  demo?: string;
  isDemoLive?: boolean;
  needServer?: boolean;
}

const projects: Project[] = [
  {
    title: "Live Dashboard using SSE",
    description: "Demo Application that uses SSE architecture to simulate realtime dashboard.",
    image: LiveSSEDashboardGIF,
    github: "https://github.com/SanjayPAcharya/sse-realtime-app",
    demo: "https://sse.sanjaykumarp.info",
    isDemoLive: true,
    needServer: true
  },
  {
    title: "Compression Decompression",
    description: "Demo Application to compress and decompress json object.",
    image: CompressDecompress,
    github: "https://github.com/SanjayPAcharya/compress-decompress-json",
    demo: "http://compress-decompress.s3-website-us-east-1.amazonaws.com",
    isDemoLive: true,
    needServer: false
  }
];

export default function Projects(): JSX.Element {
  // central state for server status; false = stopped, true = running
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false);

  // callback passed to EC2ControlInline so it can notify this parent about server status
  const handleServerStatusChange = (running: boolean) => {
    setIsServerRunning(running);
  };

  return (
    <Section id="projects" title="Featured Projects" className="bg-white relative py-20">
      <div className="text-center mb-12">
        <p className="text-gray-500 text-sm md:text-base">A selection of my recent projects & experiments</p>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full" />
      </div>

      {/* EC2 Control Inline: give it the current state and an updater callback */}
      <div className="flex justify-center mb-10">
        <div className="rounded-2xl backdrop-blur-md bg-white/70 shadow-sm px-5 py-3">
          <EC2ControlInline isRunningProp={isServerRunning} onStatusChange={handleServerStatusChange} />
        </div>
      </div>

      {/* Grid container centered with constrained width so cards sit nicely in the middle */}
      <div className="mx-auto w-full max-w-6xl px-6 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {projects.map((project, index) => {
            // final isDemoLive: project supports demo and server is running
            const effectiveIsDemoLive = Boolean(project.isDemoLive && isServerRunning);

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-[380px]">
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    image={project.image}
                    github={project.github}
                    demo={project.demo}
                    delay={index * 100}
                    isDemoLive={effectiveIsDemoLive}
                    needServer={project.needServer}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Soft background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 via-white to-gray-100 opacity-70" />
    </Section>
  );
}
