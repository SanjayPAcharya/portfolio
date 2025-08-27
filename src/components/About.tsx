import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { FaReact, FaNodeJs, FaPython, FaDatabase, FaAws, FaAngular, FaDocker } from 'react-icons/fa';
import { SiFlutter } from 'react-icons/si';

const skills = [
  { name: 'Angular', icon: <FaAngular className="text-blue-600 w-8 h-8" />, id: 'angular' },
  { name: 'React', icon: <FaReact className="text-blue-600 w-8 h-8" />, id: 'react' },
  { name: 'Android-Flutter', icon: <SiFlutter className="text-blue-600 w-8 h-8" />, id: 'react' },
  { name: 'Node.js-Express', icon: <FaNodeJs className="text-green-600 w-8 h-8" />, id: 'node' },
  { name: 'Python-Django', icon: <FaPython className="text-yellow-600 w-8 h-8" />, id: 'python' },
  { name: 'SQL/NOSQL', icon: <FaDatabase className="text-purple-600 w-8 h-8" />, id: 'db' },
  { name: 'Cloud/AWS', icon: <FaAws className="text-red-600 w-8 h-8" />, id: 'aws' },
  { name: 'CI/CD', icon: <FaDocker className="text-red-600 w-8 h-8" />, id: 'aws' },
];

const whatIDo = [
  {
    iconBg: 'bg-blue-600',
    title: 'Frontend Development',
    desc: 'Crafting responsive and interactive user interfaces with modern frameworks and clean UI/UX principles.',
  },
  {
    iconBg: 'bg-green-600',
    title: 'Backend Development',
    desc: 'Building robust APIs and server-side applications using Node.js, Python, and scalable database solutions.',
  },
  {
    iconBg: 'bg-purple-600',
    title: 'DevOps & Deployment',
    desc: 'Automating deployments, managing cloud infrastructure, and ensuring system reliability with CI/CD pipelines.',
  },
  {
    iconBg: 'bg-orange-600',
    title: 'Agile & Project Delivery',
    desc: 'Managing the full software development lifecycle—planning, execution, and delivery—through agile methodologies, with continuous support until client satisfaction.',
  }
];

export default function About() {
  const particlesInit = async (main: any) => {
    await loadSlim(main);
  };

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
          <p className="text-md text-gray-600 max-w-3xl mx-auto">
           I’m a Full-Stack Engineer with 8 years of experience building software solutions that balance performance, simplicity, and usability. I enjoy transforming ideas into scalable systems through clean, maintainable code and thoughtful design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Technical Skills with ParticleJS */}
          <div>
            {/* <h3 className="text-2xl font-semibold mb-6 text-gray-800">Technical Skills</h3> */}
            <div className="relative overflow-hidden pt-4 pb-4">
              <Particles
                id="skills-particles"
                init={particlesInit}
                options={{
                  fullScreen: false,
                  background: { color: { value: '#ffffff' } },
                  fpsLimit: 60,
                  interactivity: {
                    events: {
                      onHover: { enable: true, mode: 'grab' },
                      resize: true,
                    },
                    modes: {
                      grab: {
                        distance: 140,
                        links: { opacity: 0.5 },
                      },
                    },
                  },
                  particles: {
                    number: { value: skills.length, density: { enable: false } },
                    shape: { type: 'circle' },
                    size: { value: 0 },
                    links: {
                      enable: true,
                      distance: 120,
                      color: '#999',
                      opacity: 0.4,
                      width: 1,
                    },
                    move: {
                      enable: true,
                      speed: 1,
                      direction: 'none',
                      outModes: { default: 'bounce' },
                    },
                  },
                }}
                className="absolute inset-0 pointer-events-none"
              />
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 place-items-center gap-6 p-4">
                {skills.map(skill => (
                  <div key={skill.id} className="flex flex-col items-center justify-center text-center">
                    {skill.icon}
                    <span className="text-sm mt-2 text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What I Do Section */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">What I Do</h3>
            <div className="space-y-4">
              {whatIDo.map(item => (
                <div className="flex items-start space-x-3" key={item.title}>
                  <div className={`w-6 h-6 ${item.iconBg} rounded-full flex items-center justify-center mt-1`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
