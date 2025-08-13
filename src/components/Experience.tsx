import React from 'react';

const experiences = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'TechCorp Inc.',
    period: '2021 - Present',
    description:
      'Leading development of microservices architecture serving 1M+ users. Built scalable React applications and Node.js APIs, reducing load times by 40% and improving user engagement.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    tagColors: ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-yellow-100 text-yellow-800'],
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    period: '2019 - 2021',
    description:
      'Developed and maintained multiple client projects using React, Vue.js, and Django. Implemented real-time features and payment integrations, increasing client satisfaction by 35%.',
    tags: ['Vue.js', 'Django', 'MongoDB', 'Redis'],
    tagColors: ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-red-100 text-red-800'],
  },
  {
    title: 'Software Engineer',
    company: 'WebSolutions Ltd.',
    period: '2016 - 2019',
    description:
      'Started as a junior developer and grew into full-stack responsibilities. Built responsive web applications and RESTful APIs, contributing to 50+ successful projects.',
    tags: ['JavaScript', 'PHP', 'MySQL', 'jQuery'],
    tagColors: ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-yellow-100 text-yellow-800'],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Experience</h2>
          <p className="text-xl text-gray-600">8 years of building amazing products</p>
        </div>
        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div key={exp.title} className="bg-white p-8 rounded-2xl shadow-sm card-hover">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800">{exp.title}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <span className="text-gray-500 mt-2 md:mt-0">{exp.period}</span>
              </div>
              <p className="text-gray-600 mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((tag, i) => (
                  <span key={tag} className={`${exp.tagColors[i]} px-3 py-1 rounded-full text-sm`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
