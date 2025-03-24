import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="parallax">
      <div className="parallax-layer parallax-back">
        <div className="h-screen bg-gradient-to-br from-blue-400 to-indigo-600 opacity-50" />
      </div>
      <div className="parallax-layer parallax-base">
        <Hero />
        <About />
        {/* <Skills />
        <Projects />
        <Contact />
        <Footer /> */}
      </div>
    </div>
  );
}

export default App;