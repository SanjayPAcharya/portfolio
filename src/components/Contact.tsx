import React, { useState } from 'react';
import Section from './Section';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
  };

  return (
    <Section id="contact" title="Get In Touch" className="bg-gray-50">
      <div className="max-w-xl mx-auto px-4 md:px-0">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2 text-base"
            />
          </div>
          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2 text-base"
            />
          </div>
          <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={formState.message}
              onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 p-2 text-base"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg text-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </Section>
  );
}