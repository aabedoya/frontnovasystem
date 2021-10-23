import React from 'react';
import TriggerDarkMode from './TriggerDarkMode';
import { useAuth0 } from '@auth0/auth0-react';
import ImagenLogo from './ImagenLogo';

const Navbar = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <nav className='bg-blue-100'>
      <ul className='flex w-full justify-between my-3'>
        <li><ImagenLogo /></li>
        <li>Navegacion1</li>
        <li>Navegacion2</li>
        <li>
          <TriggerDarkMode />
        </li>
        <li className='px-3'>
          <button
            onClick={() => loginWithRedirect()}
            className='bg-blue-200 p-2 text-black rounded-lg shadow-md hover:bg-blue-700'
          >
            Iniciar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
