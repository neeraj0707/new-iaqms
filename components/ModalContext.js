import React, { createContext, useState, useContext } from 'react';
import AirEstimationModal from './AirEstimationModal'; 

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [airEstimationVisible, setAirEstimationVisible] = useState(false);

  return (
    <ModalContext.Provider value={{ airEstimationVisible, setAirEstimationVisible }}>
      {children}
      <AirEstimationModal
        visible={airEstimationVisible}
        onClose={() => setAirEstimationVisible(false)}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);