import React from 'react';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3_4 from './components/Level3_4';

function App() {
  return (
    <div className="w-full max-w-[container-max] mx-auto flex flex-col gap-8 pb-12">
      <header className="bg-surface-container p-6 md:p-8 sketch-border sketch-shadow relative transform -rotate-1 mt-6">
        <div className="absolute top-2 right-4 text-outline-variant opacity-30">
          <span className="material-symbols-outlined text-4xl transform rotate-12">school</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg mb-2">Практичне заняття 2</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Веб-розробка з JavaScript та React</p>
      </header>

      <Level1 />
      <Level2 />
      <Level3_4 />
    </div>
  );
}

export default App;
