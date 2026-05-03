import React from 'react';
import { useLevel2 } from '../hooks/useLevel2';

const Level2 = () => {
  const {
    jsonInput,
    setJsonInput,
    isValid,
    validateJSON,
    handleFileUpload
  } = useLevel2();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-container">Рівень 2: Перевірка JSON</h2>
        <label className="sketch-border-thin bg-surface-container-high text-on-surface-variant px-3 py-1 text-xs font-bold cursor-pointer hover:bg-surface-variant transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">file_open</span>
          Відкрити файл
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <div className="sketch-border p-6 bg-surface-container-low shadow-sm">
        <textarea
          className="w-full h-32 p-4 bg-surface-container sketch-border-thin focus:outline-none focus:ring-0 mb-4 font-mono text-sm resize-none"
          placeholder="Введіть текст сюди або завантажте файл..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <button
            onClick={validateJSON}
            className="sketch-border bg-primary-container text-white px-6 py-2 flex items-center gap-2 hover:bg-opacity-90 active:translate-y-0.5 transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              {isValid === true ? 'check_circle' : isValid === false ? 'error' : 'done_all'}
            </span>
            Перевірити
          </button>

          {isValid !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 sketch-border-thin ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="material-symbols-outlined">
                {isValid ? 'verified' : 'warning'}
              </span>
              <span className="font-bold">
                {isValid ? 'Дійсний JSON' : 'Некоректний JSON'}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Level2;
