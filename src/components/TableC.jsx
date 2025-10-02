import Table from 'react-bootstrap/Table';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import clienteAxios, { configHeaders } from '../helpers/axios';

const TableC = ({ idPage, array, setIsLoadingHook }) => {
    const storageRole = JSON.parse(sessionStorage.getItem('role'))

    const handleDelFromCart = async (productId, productQuantity) => {
        if (productQuantity === 1) {
            const result = confirm('Desea eliminar el producto del carrito?')
            if (result) {
                await clienteAxios.post(`/products/delFromCart/${productId}`, {}, configHeaders)
                setIsLoadingHook(true)
            }
        } else {
            await clienteAxios.post(`/products/delFromCart/${productId}`, {}, configHeaders)
            setIsLoadingHook(true)
        }
    }

    const handleIncreaseFromCart = async (productId) => {
        await clienteAxios.post(`/products/addToCart/${productId}`, {}, configHeaders)
        setIsLoadingHook(true)
    }

    const handleClickChangeUserStatus = async (userId, userStatus) => {
        let message;
        if (userStatus) {
            message = 'Bloquear usuario?'
        } else {
            message = 'Desbloquear usuario?'
        }
        const response = confirm(message)
        if (response) {
            const result = await clienteAxios.post(`/users/userState/${userId}`, {}, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
        }
    }

    const handleClickChangeUserRole = async (userId, userRole) => {
        let message;
        if (userRole === 'admin') {
            message = 'Cambiar a usuario?'
        } else {
            message = 'Cambiar a administrador?'
        }
        const response = confirm(message)
        if (response) {
            const result = await clienteAxios.post(`/users/changeUserRole/${userId}`, {}, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
        }
    }

    const handleClickDeleteUser = async (userId) => {
        const response = confirm('Eliminar usuario?')
        if (response) {
            const result = await clienteAxios.delete(`/users/${userId}`, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
        }
    }

    return (
        <>
            <Container className='mt-3'>
                <Table responsive>
                    <thead>
                        <tr>
                            {
                                idPage === 'userCart' ?
                                    <>
                                        <th style={{ textAlign: 'center' }}>Nombre</th>
                                        <th style={{ textAlign: 'center' }}>Precio</th>
                                        <th style={{ textAlign: 'center' }}>Descripción</th>
                                        <th style={{ textAlign: 'center' }}>Color</th>
                                        <th style={{ textAlign: 'center' }}>Talle</th>
                                        <th style={{ textAlign: 'center' }}>Acciónes</th>
                                    </>
                                    :
                                    <>
                                        <th style={{ textAlign: 'center' }}>Nombre</th>
                                        <th style={{ textAlign: 'center' }}>Correo</th>
                                        <th style={{ textAlign: 'center' }}>Telefono</th>
                                        <th style={{ textAlign: 'center' }}>Estado</th>
                                        <th style={{ textAlign: 'center' }}>Tipo de Usuario</th>
                                        <th style={{ textAlign: 'center' }}>Eliminar Usuario</th>
                                    </>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            idPage === 'userCart' ?
                                array.map((product) =>
                                    <tr key={product._id}>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={product.name}>{product.name}</td>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={product.price}>{product.price}</td>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={product.description}>{product.description}</td>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={product.color}>{product.color}</td>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={product.size}>{product.size}</td>
                                        <td style={{ display: 'flex' }}>
                                            <Button onClick={() => handleDelFromCart(product._id, product.quantity)}>-</Button>
                                            <p className='mx-2'>{product.quantity}</p>
                                            <Button onClick={() => handleIncreaseFromCart(product._id)}>+</Button>
                                        </td>
                                    </tr>
                                )
                                :
                                array.map((user) =>
                                    <tr key={user._id}
                                    style={{ textAlign: 'center' }}>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={user.fullName}>{user.fullName}</td>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={user.email}>{user.email}</td>
                                        <td style={{maxWidth: '10em' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} title={user.phone}>{user.phone}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Button
                                                title={user.active ? 'Bloquear usuario' : 'Desbloquear usuario'}
                                                variant={user.active ? 'warning' : 'success'}
                                                disabled={storageRole === 'mainAdmin' ? false : user.role === 'admin' ? true : false}
                                                onClick={() => handleClickChangeUserStatus(user._id, user.active)}>
                                                {user.active ? 'Bloquear' : 'Desbloquear'}
                                            </Button>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Button
                                                title={user.role === 'admin' ? 'Cambiar a usuario' : 'Cambiar a administrador'}
                                                variant={user.role === 'admin' ? 'primary' : 'info'}
                                                disabled={storageRole === 'mainAdmin' ? false : true}
                                                onClick={() => handleClickChangeUserRole(user._id, user.role)}
                                            >
                                                {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                            </Button>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Button
                                                title='Eliminar usuario'
                                                variant='danger'
                                                disabled={storageRole === 'mainAdmin' ? false : user.role === 'admin' ? true : false}
                                                onClick={() => handleClickDeleteUser(user._id)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

TableC.propTypes = {
    idPage: PropTypes.string,
    array: PropTypes.array,
    setIsLoadingHook: PropTypes.func
}

export default TableC