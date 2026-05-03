import { useEffect, useRef, useState } from 'react';

export const useLevel1 = () => {
  const containerRef = useRef(null);
  const [isCustomData, setIsCustomData] = useState(false);

  const renderData = (data) => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      
      const nameEl = document.createElement('p');
      nameEl.className = 'font-bold text-lg';
      nameEl.innerHTML = `<strong>Ім'я:</strong> ${data.name}`;
      
      const ageEl = document.createElement('p');
      ageEl.className = 'text-on-surface-variant';
      ageEl.textContent = `Вік: ${data.age}`;
      
      const hobbyTitle = document.createElement('p');
      hobbyTitle.className = 'mt-2 font-bold';
      hobbyTitle.textContent = 'Хобі:';
      
      const hobbyList = document.createElement('ul');
      hobbyList.className = 'list-disc list-inside ml-2';
      
      if (Array.isArray(data.hobbies)) {
        data.hobbies.forEach(hobby => {
          const li = document.createElement('li');
          li.textContent = hobby;
          hobbyList.appendChild(li);
        });
      }
      
      containerRef.current.appendChild(nameEl);
      containerRef.current.appendChild(ageEl);
      containerRef.current.appendChild(hobbyTitle);
      containerRef.current.appendChild(hobbyList);
    }
  };

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => renderData(data))
      .catch(error => console.error('Error loading default data:', error));
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          renderData(data);
          setIsCustomData(true);
        } catch (error) {
          alert('Помилка: файл не є дійсним JSON');
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    containerRef,
    isCustomData,
    handleFileUpload
  };
};
