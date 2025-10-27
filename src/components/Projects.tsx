import Section from './Section';
import ProjectCard from './ProjectCard';
import EC2ControlInline from './EC2ControlInline';
import LiveSSEDashboardGIF from '../assets/Live-SSE-Dashboard.gif';

const projects = [
  {
    title: 'Live Dashboard using SSE',
    description: 'Demo Application that uses SSE architecture to simulate realtime dashboard.',
    image: LiveSSEDashboardGIF + '?auto=format&fit=crop&w=600&h=600',
    github: '#',
    demo: '#',
    isDemoLive: true
  },
];

export default function Projects() {
  return (
    <Section id="projects" title="Featured Projects" className="bg-white">
      {/* Centered, prominent EC2 control */}
      <div className="px-4 md:px-0">
        <div className="w-full flex justify-center">
          <div className="max-w-fit">
            {/* optional emphasis frame for visibility */}
            <div className="rounded-full backdrop-blur bg-white/90 px-2 py-2 mb-6 md:mb-8">
              <EC2ControlInline />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            {...project}
            delay={index * 100}
          />
        ))}
      </div>
    </Section>
  );
}
