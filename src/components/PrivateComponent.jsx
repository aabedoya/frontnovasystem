import { useUser } from 'context/userContext';
import React from 'react';

const PrivateComponent = ({ roleList, children }) => {
  const { userData } = useUser();
  console.log('Rol cargado',userData.rol);
  console.log('datos del user data en el private component',userData);
  if (roleList.includes(userData.rol)) {
    return children;
  }


  return <></>;
};

export default PrivateComponent;
