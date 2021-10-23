import axios from 'axios';

// const baseURL = "http://localhost:5000"
const baseURL = 'https://enigmatic-shelf-42481.herokuapp.com';

const getToken = () => {
  return `Bearer ${localStorage.getItem('token')}`;
  
};

export const obtenerProductos = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
<<<<<<< HEAD
    url: `${baseURL}/vehiculos/`,
=======
    url: 'http://localhost:5000/productos/',
>>>>>>> front
    headers: {
      Authorization: getToken(),
    },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const crearProducto = async (data, successCallback, errorCallback) => {
  const options = {
    method: 'POST',
<<<<<<< HEAD
    url: `${baseURL}/vehiculos/`,
=======
    url: 'http://localhost:5000/productos/',
>>>>>>> front
    headers: { 'Content-Type': 'application/json', Authorization: getToken() },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const editarProducto = async (id, data, successCallback, errorCallback) => {
  const options = {
    method: 'PATCH',
<<<<<<< HEAD
    url: `${baseURL}/vehiculos/${id}/`,
=======
    url: `http://localhost:5000/productos/${id}/`,
>>>>>>> front
    headers: { 'Content-Type': 'application/json', Authorization: getToken() },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const eliminarProducto = async (id, successCallback, errorCallback) => {
  const options = {
    method: 'DELETE',
<<<<<<< HEAD
    url: `${baseURL}/vehiculos/${id}/`,
=======
    url: `http://localhost:5000/productos/${id}/`,
>>>>>>> front
    headers: { 'Content-Type': 'application/json', Authorization: getToken() },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

// CRUD PARA USUARIOS

export const obtenerUsuarios = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
    url: `${baseURL}/usuarios/`,
    headers: {
      Authorization: getToken(),
    },
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const obtenerDatosUsuario = async (successCallback, errorCallback) => {
  const options = {
    method: 'GET',
    url: `${baseURL}/usuarios/self/`,
    headers: {
      Authorization: getToken(), // 3. enviarle el token a backend
    },
  };
  console.log('obtiene datos del user');
  await axios.request(options).then(successCallback).catch(errorCallback);
};

export const editarUsuario = async (id, data, successCallback, errorCallback) => {
  const options = {
    method: 'PATCH',
    url: `${baseURL}/usuarios/${id}/`,
    headers: { 'Content-Type': 'application/json', Authorization: getToken() },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};

// CRUD DE VENTAS

export const crearVenta = async (data, successCallback, errorCallback) => {
  const options = {
    method: 'POST',
    url: `${baseURL}/ventas/`,
    headers: { 'Content-Type': 'application/json', Authorization: getToken() },
    data,
  };
  await axios.request(options).then(successCallback).catch(errorCallback);
};
