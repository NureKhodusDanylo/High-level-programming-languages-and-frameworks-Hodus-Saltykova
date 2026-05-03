import React from 'react';
import { useLevel1 } from '../hooks/useLevel1';

const Level1 = () => {
  const {
    containerRef,
    isCustomData,
    handleFileUpload
  } = useLevel1();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-container">Рівень 1: Дані про себе</h2>
        <label className="sketch-border-thin bg-tertiary-fixed text-tertiary px-3 py-1 text-xs font-bold cursor-pointer hover:bg-tertiary-fixed-dim transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">upload_file</span>
          Завантажити свій JSON
          <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
      
      <div className="sketch-border p-6 bg-surface relative overflow-hidden">
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold sketch-border-thin rotate-3 translate-x-2 -translate-y-1 ${isCustomData ? 'bg-secondary-container text-on-secondary-container' : 'bg-tertiary-fixed-dim text-tertiary-container'}`}>
          {isCustomData ? 'Custom Data' : 'Default Data'}
        </div>
        <div ref={containerRef} className="space-y-2">
          Завантаження...
        </div>
      </div>
    </section>
  );
};

export default Level1;
