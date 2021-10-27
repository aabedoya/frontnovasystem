import React, { useEffect, useState} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { Dialog, Tooltip } from '@material-ui/core';

import { obtenerVentas, editarVenta, eliminarVenta } from 'utils/api';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import PrivateComponent from 'components/PrivateComponent';

const MaestroVentas = () => {
  const [mostrarTabla, setMostrarTabla] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [textoBoton, setTextoBoton] = useState('Crear Nueva Venta');
  const [colorBoton, setColorBoton] = useState('blue');
  const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);
      await obtenerVentas(
        (response) => {
          //console.log('la respuesta que se recibio fue', response.data);
          setVentas(response.data);
          setEjecutarConsulta(false);
          setLoading(false);
        },
        (error) => {
          console.error('Salio un error:', error);
          setLoading(false);
        }
      );
    };
    //console.log('consulta', ejecutarConsulta);
    if (ejecutarConsulta) {
      fetchVentas();
    }
  }, [ejecutarConsulta]);

  useEffect(() => {
    //obtener lista de Ventas desde el backend
    if (mostrarTabla) {
      setEjecutarConsulta(true);
    }
  }, [mostrarTabla]);

  useEffect(() => {
    if (mostrarTabla) {
      setTextoBoton('Andres');
      setColorBoton('white');
    } else {
      setTextoBoton('Mostrar Todas las Ventas');
      setColorBoton('white');
    }
  }, [mostrarTabla]);
  return (
    <div className='flex h-full w-full flex-col items-center justify-start p-8'>
      <div className='flex flex-col w-full'>
        <h2 className='text-3xl font-extrabold text-gray-900'>
          Página de administración de Ventas
        </h2>
        <button
          onClick={() => {
            setMostrarTabla(!mostrarTabla);
          }}
          className={`text-white bg-${colorBoton}-500 p-5 rounded-full m-6 w-28 self-end`}
        >
          {textoBoton}
        </button>
      </div>

      {mostrarTabla ? (
        <TablaVentas
          loading={loading}
          listaVentas={ventas}
          setEjecutarConsulta={setEjecutarConsulta}
        />
      ) : (<div></div>
        // <FormularioCreacionVentas
        //   setMostrarTabla={setMostrarTabla}
        //   listaVentas={ventas}
        //   setVentas={setVentas}
        // />
      )}
      <ToastContainer position='bottom-center' autoClose={5000} />
    </div>
  );
};

const TablaVentas = ({ loading, listaVentas, setEjecutarConsulta }) => {
  const [busqueda, setBusqueda] = useState('');
  const [ventasFiltrados, setVentasFiltrados] = useState(listaVentas);

  useEffect(() => {
    setVentasFiltrados(
      listaVentas.filter((elemento) => {
        //return JSON.stringify(elemento.vendedor.name).toLowerCase().includes(busqueda.toLowerCase());
        //return console.log('hola muestra el nombre', elemento.vendedor.name)
      })
    );
  }, [busqueda, listaVentas]);

  useEffect(() => {
    console.log('aqui', listaVentas)
  }, [listaVentas]);
  

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder='Ingrese aquí la busqueda'
        className='border-2 border-gray-700 px-3 py-1 self-start rounded-md focus:outline-none focus:border-blue-500'
      />
      <h2 className='text-2xl font-extrabold text-gray-800'>Todas las Ventas</h2>
      <div className='hidden md:flex w-full'>
        {loading ? (
          <ReactLoading type='cylon' color='#abc123' height={667} width={375} />
        ) : (
          <table className='tabla'>
            <thead>
              <tr>
                <th>Id</th>
                <th>Vendedor</th>
                <th>Productos de la venta</th>
                <th>Total de la venta</th>
                <PrivateComponent roleList={['admin']}>
                  <th>Acciones</th>
                </PrivateComponent>
              </tr>
            </thead>
            <tbody>
              {listaVentas.map(venta => {
                return (
                  <FilaVenta
                    key={nanoid()}
                    venta={venta}
                    setEjecutarConsulta={setEjecutarConsulta}
                  />
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className='flex flex-col w-full m-2 md:hidden'>
        {ventasFiltrados.map((el) => {
          return (
            <div className='bg-gray-400 m-2 shadow-xl flex flex-col p-2 rounded-xl'>
              <span>{el.vendedor}</span>
              <span>{el.ventas}</span>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FilaVenta = ({ venta, setEjecutarConsulta }) => {
  const [edit, setEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [infoNuevoVenta, setInfoNuevoVenta] = useState({
    _id: venta._id,
    vendedor: venta.vendedor,
    ventas: venta.productos,
    
  });
  const [ventatotal, setventatotal]= useState(0)
  
  useEffect(() => {
    let total=0;
    venta.productos.map(item => {
      total +=parseInt( item.valor) * item.cantidad
    })
    setventatotal(total)
    console.log(total)
    // console.log('estas son las ventas', venta)
  }, [venta]);

  const actualizarVenta = async () => {
    //enviar la info al backend

    await editarVenta(
      venta._id,
      {
        vendedor: infoNuevoVenta.vendedor,
        productos: infoNuevoVenta.productos,
        
      },
      (response) => {
        console.log(response.data);
        toast.success('Venta modificado con éxito');
        setEdit(false);
        setEjecutarConsulta(true);
      },
      (error) => {
        toast.error('Error modificando la Venta');
        console.error(error);
      }
    );
  };

  const borrarVenta = async () => {
    await eliminarVenta(
      venta._id,
      (response) => {
        console.log(response.data);
        toast.success('Venta eliminada con éxito');
        setEjecutarConsulta(true);
      },
      (error) => {
        console.error(error);
        toast.error('Error eliminando la Venta');
      }
    );

    setOpenDialog(false);
  };

  return (
    <tr>
      {edit ? (
        <>
          <td>{infoNuevoVenta._id}</td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoVenta.vendedor}
              onChange={(e) => setInfoNuevoVenta({ ...infoNuevoVenta, vendedor: e.target.value })}
            />
          </td>
          <td>
            <input
              className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
              type='text'
              value={infoNuevoVenta.productos}
              onChange={(e) =>
                setInfoNuevoVenta({ ...infoNuevoVenta, productos: e.target.value })
              }
            />
          </td>
          
        </>
      ) : (
        <>
          <td>{venta._id.slice(20)}</td>
          <td>{venta.vendedor.name}</td>
          <tr>
            { venta.productos.map(item =>  {
            return (
              <>
              <td>{item.descripcion}</td>
              <td>{item.cantidad}</td>
              <td>{item.valor}</td>
              </>
            ) })
          }
        </tr>
        <td>{ventatotal}</td>
          
        </>
       
      )}

      {/* <PrivateComponent roleList={['admin']}> */}
        <td>
          <div className='flex w-full justify-around'>
            {edit ? (
              <>
                {/* <Tooltip title='Confirmar Edición' arrow>
                  <i
                    onClick={() => actualizarProducto()}
                    className='fas fa-check text-blue-700 hover:text-blue-500'
                  />
                </Tooltip>
                <Tooltip title='Cancelar edición' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-ban text-yellow-700 hover:text-yellow-500'
                  />
                </Tooltip> */}
              </>
            ) : (
              <>
                {/* <Tooltip title='Editar Venta' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-pencil-alt text-yellow-700 hover:text-yellow-500'
                  />
                </Tooltip> */}
                <Tooltip title='Eliminar Venta' arrow>
                  <i
                    onClick={() => setOpenDialog(true)}
                    className='fas fa-trash text-red-700 hover:text-red-500'
                  />
                </Tooltip>
              </>
            )}
          </div>

          <Dialog open={openDialog}>
            <div className='p-8 flex flex-col'>
              <h1 className='text-gray-900 text-2xl font-bold'>
                ¿Está seguro de querer eliminar el Venta?
              </h1>
              <div className='flex w-full items-center justify-center my-4'>
                <button
                  onClick={() => borrarVenta()}
                  className='mx-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-md shadow-md'
                >
                  Sí
                </button>
                <button
                  onClick={() => setOpenDialog(false)}
                  className='mx-2 px-4 py-2 bg-red-500 text-white hover:bg-red-700 rounded-md shadow-md'
                >
                  No
                </button>
              </div>
            </div>
          </Dialog>
        </td>
      {/* </PrivateComponent> */}
    </tr>

  );
};

// const FormularioCreacionVentas = ({ setMostrarTabla, listaProductos, setProductos }) => {
//   const form = useRef(null);

//   const submitForm = async (e) => {
//     e.preventDefault();
//     const fd = new FormData(form.current);

//     const nuevoProducto = {};
//     fd.forEach((value, key) => {
//       nuevoProducto[key] = value;
//     });

//     await crearVenta(
//       {
//         descripcion: nuevoProducto.descripcion,
//         valor: nuevoProducto.valor,
//         estado: nuevoProducto.estado,
//       },
//       (response) => {
//         console.log(response.data);
//         toast.success('Venta agregado con éxito');
//       },
//       (error) => {
//         console.error(error);
//         toast.error('Error creando un Venta');
//       }
//     );

//     // const options = {
//     //   method: 'POST',
//     //   url: 'http://localhost:5000/ventas/nuevo/',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   data: { descripcion: nuevoProducto.descripcion, valor: nuevoProducto.valor, estado: nuevoProducto.estado },
//     // };

//     // await axios
//     //   .request(options)
//     //   .then(function (response) {
//     //     console.log(response.data);
//     //     toast.success('Venta agregado con éxito');
//     //   })
//     //   .catch(function (error) {
//     //     console.error(error);
//     //     toast.error('Error creando un Venta');
//     //   });

//     setMostrarTabla(true);
//   };

//   return (
//     <div className='flex flex-col items-center justify-center'>
//       <h2 className='text-2xl font-extrabold text-gray-800'>Crear nueva venta</h2>
//       <form ref={form} onSubmit={submitForm} className='flex flex-col'>
//         <label className='flex flex-col' htmlFor='nombre'>
//           Descripción del Venta
//           <input
//             name='descripcion'
//             className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
//             type='text'
//             placeholder='Ingrese aquí la descripción'
//             required
//           />
//         </label>
//         <label className='flex flex-col' htmlFor='marca'>
//           Estado del Venta
//           <select
//             className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
//             name='estado'
//             required
//             defaultValue={0}
//           >
//             <option disabled value={0}>
//               Seleccione una opción
//             </option>
//             <option>Disponible</option>
//             <option>No disponible</option>
            
//           </select>
//         </label>
//         <label className='flex flex-col' htmlFor='modelo'>
//           Valor del Venta
//           <input
//             name='valor'
//             className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
//             type='integer'
//             placeholder='Ingrese el valor unitario'
//             required
//           />
//         </label>

//         <button
//           type='submit'
//           className='col-span-2 bg-blue-400 p-2 rounded-full shadow-md hover:bg-blue-600 text-white'
//         >
//           Guardar Venta
//         </button>
//       </form>
//     </div>
//   );
// };

export default MaestroVentas;
