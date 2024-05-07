import React, { createContext, useState } from 'react';

const IDContext = createContext();

const IDProvider = ({ children }) => {
  const [id, setID] = useState(() => {
    const storedID = localStorage.getItem('id');
    return storedID ? storedID : null;
  });

  const updateID = (newID) => {
    setID(newID);
    localStorage.setItem('id', newID);
  };

  const resetID = () => {
    setID(null);
    localStorage.removeItem('id');
  };

  const [gender, setGender] = useState(() => {
    const storedID = localStorage.getItem('gender');
    return storedID ? storedID : null;
  });

  const updateGender = (newID) => {
    setGender(newID);
    localStorage.setItem('id', newID);
  };

  const resetGender = () => {
    setGender(null);
    localStorage.removeItem('id');
  };


  return (
    <IDContext.Provider value={{ id, updateID, resetID, gender, updateGender, resetGender }}>
      {children}
    </IDContext.Provider>
  );
};

export { IDContext, IDProvider };
