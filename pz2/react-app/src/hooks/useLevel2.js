import { useState } from 'react';

export const useLevel2 = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isValid, setIsValid] = useState(null);

  const validateJSON = () => {
    if (!jsonInput.trim()) {
      setIsValid(null);
      return;
    }
    try {
      JSON.parse(jsonInput);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setJsonInput(e.target.result);
        setIsValid(null);
      };
      reader.readAsText(file);
    }
  };

  return {
    jsonInput,
    setJsonInput,
    isValid,
    validateJSON,
    handleFileUpload
  };
};
