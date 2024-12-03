import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import clienteAxios, { configHeaders } from '../helpers/axios';
import { useState } from 'react';


const TableC = ({ idPage, array, getCartFunction, setIsLoadingHook, getStockFunction, getUsersFunction }) => {
    const storageRole = JSON.parse(sessionStorage.getItem('role'))
    const [show, setShow] = useState(false);
    const [productInfo, setProductInfo] = useState(null)
    // const [image, setImage] = useState(null)

    const sizeOptions = [{ value: '', label: '--Selecciona--' }, { value: 'S', label: 'S' }, { value: 'M', label: 'M' },
    { value: 'L', label: 'L' }, { value: 'XL', label: 'XL' }, { value: '2XL', label: '2XL' },
    { value: '3XL', label: '3XL' }, { value: '4XL', label: '4XL' }, { value: '5XL', label: '5XL' },
    { value: '6XL', label: '6XL' }, { value: '7XL', label: '7XL' }, { value: '10', label: '10' },
    { value: '12', label: '12' }, { value: '14', label: '14' }, { value: '16', label: '16' },
    { value: '38', label: '38' }, { value: '40', label: '40' }, { value: '42', label: '42' },
    { value: '44', label: '44' }, { value: '46', label: '46' }, { value: '48', label: '48' },
    { value: '50', label: '50' }, { value: '52', label: '52' }, { value: '54', label: '54' },
    { value: '56', label: '56' }, { value: '58', label: '58' }, { value: '60', label: '60' },
    { value: '85', label: '85' }, { value: '90', label: '90' }, { value: '95', label: '95' },
    { value: '100', label: '100' }, { value: '105', label: '105' }, { value: '110', label: '110' },
    { value: '115', label: '115' }, { value: '120', label: '120' }
    ]

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelFromCart = async (productId, productQuantity) => {
        if (productQuantity === 1) {
            const result = confirm('Desea eliminar el producto del carrito?')
            if (result) {
                await clienteAxios.post(`/products/delFromCart/${productId}`, {}, configHeaders)
                setIsLoadingHook(true)
                getCartFunction()
            }
        } else {
            await clienteAxios.post(`/products/delFromCart/${productId}`, {}, configHeaders)
            setIsLoadingHook(true)
            getCartFunction()
        }
    }

    const handleIncreaseFromCart = async (productId) => {
        await clienteAxios.post(`/products/addToCart/${productId}`, {}, configHeaders)
        setIsLoadingHook(true)
        getCartFunction()
    }

    const handleClickEditProduct = (product) => {
        setProductInfo(product)
        handleShow()
    }

    const handleChageProductInfo = (ev) => {
        const { name, value } = ev.target
        const newValue = (name === 'price' || name === 'quantity') ? (value === '' ? '' : Number(value)) : value
        setProductInfo({ ...productInfo, [name]: newValue })
    }

    const handleClickUpdateProduct = async (ev) => {
        ev.preventDefault()
        productInfo.price === '' ? productInfo.price = 0 : productInfo.price
        productInfo.quantity === '' ? productInfo.quantity = 0 : productInfo.quantity
        const updateResult = await clienteAxios.put(`/products/${productInfo._id}`, productInfo, configHeaders)
        if (updateResult.status === 200) {
            setTimeout(() => {
                alert(updateResult.data.msg)
            }, 500);
            setIsLoadingHook(true)
            getStockFunction()
            handleClose()
        } else {
            setTimeout(() => {
                alert('Tuvimos un problema para actualizar el producto, intenta nuevamente')
            }, 500);
            handleClose()
        }

    }

    const handleClickChangeProductState = async (productId, productState) => {
        let message;
        if (productState) {
            message = 'Dehabilitar producto?'
        } else {
            message = 'Habilitar producto?'
        }
        const response = confirm(message)
        if (response) {
            const result = await clienteAxios.post(`/products/productState/${productId}`, {}, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
            getStockFunction()
        }
    }

    const handleClickDeleteProduct = async (productId) => {
        const response = confirm('Eliminar producto?')
        if (response) {
            const result = await clienteAxios.delete(`products/${productId}`, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
            getStockFunction()
        }
    }

    const handleClickChangeUserStatus = async (userId, userStatus) =>{
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
            getUsersFunction()
        }
    }

    const handleClickChangeUserRole = async (userId, userRole) =>{
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
            getUsersFunction()
        }
    }

    const handleClickDeleteUser = async (userId) =>{
        const response = confirm('Eliminar usuario?')
        if(response){
            const result = await clienteAxios.delete(`/users/${userId}`, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
            getUsersFunction()
        }
    }

    return (
        <>
            <Container>
                <Table responsive>
                    <thead>
                        <tr>
                            {
                                idPage === 'productAdmin' || idPage === 'userCart' ?
                                    <>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Descripción</th>
                                        <th>Color</th>
                                        <th>Talle</th>
                                        {idPage === 'productAdmin' &&
                                            <th>Stock</th>
                                        }
                                        <th>Acciónes</th>
                                    </>
                                    :
                                    <>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Telefono</th>
                                        <th>Estado</th>
                                        <th>Tipo de Usuario</th>
                                        <th>Eliminar Usuario</th>
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
                                        <td>{product.color}</td>
                                        <td>{product.size}</td>
                                        {idPage === 'productAdmin' &&
                                            <td> {product.quantity}</td>
                                        }
                                        <td>{
                                            idPage === 'productAdmin' ?
                                                <>
                                                    <Button className='mx-1' variant='info' onClick={() => handleClickEditProduct(product)}>Editar</Button>

                                                    <Modal show={show} onHide={handleClose}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Producto</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Form>
                                                                <Form.Group className="mb-3" controlId="formBasicName">
                                                                    <Form.Label>Nombre</Form.Label>
                                                                    <Form.Control type="text" name='name' value={productInfo?.name} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicPrice">
                                                                    <Form.Label>Precio</Form.Label>
                                                                    <Form.Control type="number" name='price' value={productInfo?.price} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicDescription">
                                                                    <Form.Label>Descripción</Form.Label>
                                                                    <Form.Control type="text" name='description' value={productInfo?.description} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicColor">
                                                                    <Form.Label>Color</Form.Label>
                                                                    <Form.Control type="text" name='color' value={productInfo?.color} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicSize">
                                                                    <Form.Label>Talle</Form.Label>
                                                                    <Form.Select type="text" name='size' value={productInfo?.size} onChange={(ev) => handleChageProductInfo(ev)}>
                                                                        {sizeOptions.map(size =>
                                                                            <option key={size.value} value={size.value}>{size.label}</option>
                                                                        )}
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicStock">
                                                                    <Form.Label>Stock</Form.Label>
                                                                    <Form.Control type="number" name='quantity' value={productInfo?.quantity} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>

                                                                {/* <Form.Group className="mb-3" controlId="formBasicPassword">
                                                                    <Form.Label>Imagen</Form.Label>
                                                                    <Form.Control type="file" onChange={(ev) => setImage(ev.target.files[0])} />
                                                                </Form.Group> */}

                                                                <Button variant="primary" type="submit" onClick={(ev) => handleClickUpdateProduct(ev)}>
                                                                    Guardar Cambios
                                                                </Button>
                                                            </Form>
                                                        </Modal.Body>
                                                    </Modal>

                                                    <Button
                                                        className='mx-1'
                                                        variant={product.active ? 'warning' : 'primary'}
                                                        onClick={() => handleClickChangeProductState(product._id, product.active)}>
                                                        {product.active ? 'Deshabilitar' : 'Habilitar'}
                                                    </Button>
                                                    <Button
                                                        className='mx-1'
                                                        variant='danger'
                                                        onClick={() => handleClickDeleteProduct(product._id)}>
                                                        Eliminar
                                                    </Button>
                                                </>
                                                :
                                                <div style={{ display: 'flex' }}>
                                                    <Button onClick={() => handleDelFromCart(product._id, product.quantity)}>-</Button>
                                                    <p className='mx-2'>{product.quantity}</p>
                                                    <Button onClick={() => handleIncreaseFromCart(product._id)}>+</Button>
                                                </div>
                                        }</td>
                                    </tr>
                                )
                                :
                                array.map((user) =>
                                    <tr key={user._id}>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <Button
                                                title={user.active ? 'Bloquear usuario' : 'Desbloquear usuario'}
                                                variant={user.active ? 'warning' : 'success'}
                                                disabled={storageRole === 'mainAdmin' ? false : user.role === 'admin' ? true : false}
                                                onClick={() => handleClickChangeUserStatus(user._id, user.active)}>
                                                {user.active ? 'Bloquear' : 'Desbloquear'}
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                title={user.role === 'admin' ? 'Cambiar a usuario' : 'Cambiar a administrador'}
                                                variant={user.role === 'admin' ? 'primary' : 'info'}
                                                disabled={storageRole === 'mainAdmin' ? false : true }
                                                onClick={()=> handleClickChangeUserRole(user._id, user.role)}
                                                >
                                                {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                            </Button>
                                        </td>
                                        <td>
                                            <Button
                                                title='Eliminar usuario'
                                                variant='danger'
                                                disabled={storageRole === 'mainAdmin' ? false : user.role === 'admin' ? true : false}
                                                onClick={()=> handleClickDeleteUser(user._id)}>
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
    getCartFunction: PropTypes.func,
    setIsLoadingHook: PropTypes.func,
    getStockFunction: PropTypes.func,
    getUsersFunction: PropTypes.func
}

export default TableC