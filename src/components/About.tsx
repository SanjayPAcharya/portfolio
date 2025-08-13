import React, { useEffect, useRef } from 'react';

const skills = [
  { name: 'React/Next.js', percent: 95, color: 'bg-blue-600', text: 'text-blue-600' },
  { name: 'Node.js/Express', percent: 90, color: 'bg-green-600', text: 'text-green-600' },
  { name: 'Python/Django', percent: 85, color: 'bg-yellow-600', text: 'text-yellow-600' },
  { name: 'PostgreSQL/MongoDB', percent: 88, color: 'bg-purple-600', text: 'text-purple-600' },
  { name: 'AWS/Docker', percent: 82, color: 'bg-red-600', text: 'text-red-600' },
];

const whatIDo = [
  {
    iconBg: 'bg-blue-600',
    title: 'Frontend Development',
    desc: 'Building responsive, interactive user interfaces with React, Vue, and modern CSS',
  },
  {
    iconBg: 'bg-green-600',
    title: 'Backend Development',
    desc: 'Creating robust APIs and server-side applications with Node.js, Python, and databases',
  },
  {
    iconBg: 'bg-purple-600',
    title: 'DevOps & Deployment',
    desc: 'Setting up CI/CD pipelines, cloud infrastructure, and monitoring systems',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            section.querySelectorAll('.skill-bar').forEach(bar => {
              const el = bar as HTMLElement;
              el.style.width = el.dataset.width || '0%';
            });
          }
        });
      },
      { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 bg-white" ref={sectionRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About Me</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I'm a passionate full-stack engineer with 8 years of experience building robust, scalable applications. 
            I love solving complex problems and turning ideas into reality through clean, efficient code.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Technical Skills</h3>
            <div className="space-y-4">
              {skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className={skill.text}>{skill.percent}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`skill-bar ${skill.color} h-2 rounded-full`}
                      style={{ width: 0 }}
                      data-width={`${skill.percent}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">What I Do</h3>
            <div className="space-y-4">
              {whatIDo.map((item, idx) => (
                <div className="flex items-start space-x-3" key={item.title}>
                  <div className={`w-6 h-6 ${item.iconBg} rounded-full flex items-center justify-center mt-1`}>
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <p className="text-gray-600">{item.desc}</p>
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
