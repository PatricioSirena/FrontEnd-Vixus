import Table from 'react-bootstrap/Table';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import clienteAxios, { configHeaders, configHeadersImage } from '../helpers/axios';


const TableC = ({ idPage, array }) => {

    const handleDelFromCart = async (productId, productQuantity) => {
        if (productQuantity === 1) {
            const result = confirm('Desea eliminar el producto del carrito?')
            if (result){
                await clienteAxios.post(`/delFromCart/${productId}`, configHeaders)
                // Crear función get en carrito y hook para habilitar useEffect
            }
        } else{
            await clienteAxios.post(`/delFromCart/${productId}`, configHeaders)
        }
    }


    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        {
                            idPage === 'productAdmin' || idPage === 'userCart' ?
                                <>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Descripción</th>
                                    <th>Acciónes</th>
                                </>
                                :
                                <>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Telefono</th>
                                    <th>Estado</th>
                                    <th>Tipo de Usuario</th>
                                </>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        idPage === 'productAdmin' || idPage === 'userCart' ?
                            array.map((product) =>
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.description}</td>
                                    <td>{
                                        idPage === 'productAdmin' ?
                                            <>
                                                <Button variant='info'>Editar</Button>
                                                <Button variant={product.active ? 'warning' : 'primary'}>{product.active ? 'Deshabilitar' : 'Habilitar'}</Button>
                                                <Button variant='danger'>Eliminar</Button>
                                            </>
                                            :
                                            <>
                                                <Button onClick={() => handleDelFromCart(product._id, product.quantity)}>-</Button>
                                                <p>{product.quantity}</p>
                                                <Button>+</Button>
                                            </>
                                    }</td>
                                </tr>
                            )
                            :
                            array.map((user) =>
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.emial}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <Button variant={user.active ? 'danger' : 'success'}>{user.active ? 'Inhabilitar' : 'Habilitar'}</Button>
                                    </td>
                                    <td>
                                        <Button variant={user.role === 'admin' ? 'primary' : 'info'}>{user.role === 'admin' ? 'Usuario' : 'Administrador'}</Button>
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </Table>
        </>
    )
}

TableC.propTypes = {
    idPage: PropTypes.string.isRequired,
    array: PropTypes.array
}

export default TableC