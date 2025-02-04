import Table from 'react-bootstrap/Table';
import { Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import clienteAxios, { configHeaders, configHeadersImage } from '../helpers/axios';
import { useState } from 'react';
import ProductModalC from './ProductModalC';


const TableC = ({ idPage, array, setIsLoadingHook }) => {
    const storageRole = JSON.parse(sessionStorage.getItem('role'))
    const [showEdit, setShowEdit] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [productInfo, setProductInfo] = useState({
        name: '',
        price: '',
        description: '',
        color: '',
        size: '',
        quantity: ''
    })
    const [productImages, setProductImages] = useState([])
    const [imageToDelete, setImageToDelete] = useState([])
    const [errorMessage, setErrorMessage] = useState({
        name: '',
        price: '',
        description: '',
        color: '',
        quantity: '',
        save: ''
    })
    const [saveProduct, setSaveProduct] = useState(true)

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

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    const handleCloseNew = () => setShowNew(false);
    const handleShowNew = () => setShowNew(true);

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

    const handleClickEditProduct = (product) => {
        setProductImages(product.galery)
        setProductInfo(product)
        handleShowEdit()
    }

    const handleChageProductInfo = (ev) => {
        const { name, value } = ev.target
        let newErrorMessage = { ...errorMessage };

        if (name === 'name') {
            if (!/^[A-Za-z0-9\s]{4,40}$/.test(value)) {
                newErrorMessage.name = 'El nombre debe tener entre 4 y 40 caracteres, letras o numeros';
            } else {
                newErrorMessage.name = '';
            }
        }
        if (name === 'price') {
            if (value === '' || Number(value) <= 0 || !/^\d+$/.test(value)) {
                newErrorMessage.price = 'Debe ingresar un valor numerico mayor a 0';
            } else {
                newErrorMessage.price = '';
            }
        }
        if (name === 'description') {
            if (!/^[A-Za-z0-9\s]{10,200}$/.test(value)) {
                newErrorMessage.description = 'El descripción debe tener entre 10 y 200 caracteres, letras o numeros';
            } else {
                newErrorMessage.description = '';
            }
        }
        if (name === 'color') {
            if (value && !/^[A-Za-z]+$/.test(value)) {
                newErrorMessage.color = 'Solo se permiten letras para el color';
            } else {
                newErrorMessage.color = '';
            }
        }
        if (name === 'quantity') {
            if (value && isNaN(value)) {
                newErrorMessage.quantity = 'Debe ingresar un valor numerico';
            } else {
                newErrorMessage.quantity = '';
            }
        }
        setErrorMessage(newErrorMessage);
        const newValue = (name === 'price' || name === 'quantity') ? (value === '' ? '' : Number(value)) : value
        setProductInfo(prevState => ({ ...prevState, [name]: newValue }))
        const hasErrors = Object.values(newErrorMessage).some(error => error !== '');
        setSaveProduct(!hasErrors);
    }

    const handleChangeNewImage = async (image) => {
        try {
            const formData = new FormData()
            formData.append('image', image)
            const result = await clienteAxios.post(`/products/uploadToCloud`, formData, configHeadersImage)
            if (result.status === 200) {
                const imageId = Date.now().toString(35) + Math.random().toString(36).slice(2)
                const url = result.data
                const newImage = { imageId, url }
                setProductImages([...productImages, newImage])
            }
        } catch (error) {
            console.log(error);

        }
    }

    const handleClickDelImgFromProduct = (imageId) => {
        const newImageToDel = productImages.find(image => image.imageId === imageId)
        setImageToDelete([...imageToDelete, newImageToDel])
        const newImgArray = productImages.filter(image => image.imageId !== imageId)
        setProductImages(newImgArray)
    }

    const handleClickUpdateProduct = async (ev) => {
        ev.preventDefault()
        try {
            for (const item of productImages) {
                const result = productInfo.galery.find(image => image.imageId === item.imageId)
                if (result === undefined) {
                    await clienteAxios.post(`/products/addProductImage/${productInfo._id}`, { imageUrl: item.url, imageId: item.imageId }, configHeaders)
                }
            }
            if (imageToDelete.length >= 1) {
                for (const item of imageToDelete) {
                    const result = productInfo.galery.find(image => image.imageId === item.imageId)
                    if (result === undefined) {
                        await clienteAxios.post('/products/deleteFromCloud', { url: item.url }, configHeaders)
                    } else {
                        await clienteAxios.delete(`/products/delProductImage/${productInfo._id}/galery/${result.imageId}`, configHeaders)
                    }
                }
            }
            delete productInfo.galery
            const updatedProuctInfo = {
                ...productInfo,
                price: productInfo.price === '' ? 0 : productInfo.price,
                quantity: productInfo.quantity === '' ? 0 : productInfo.quantity
            }
            const updateResult = await clienteAxios.put(`/products/${productInfo._id}`, updatedProuctInfo, configHeaders)
            if (updateResult.status === 200) {
                setTimeout(() => {
                    alert(updateResult.data.msg)
                }, 500);
                setIsLoadingHook(true)

            } else {
                setTimeout(() => {
                    alert('Tuvimos un problema para actualizar el producto, intenta nuevamente')
                }, 500);
            }
            setErrorMessage({ name: '', price: '', description: '' })
            setProductImages([])
            setImageToDelete([])
            setProductInfo({
                name: '',
                price: '',
                description: '',
                color: '',
                size: '',
                quantity: ''
            })
            handleCloseEdit()
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickCancelProductUpdate = async (idModal) => {
        try {
            for (const item of productImages) {
                const result = productInfo.galery.find(image => image.imageId === item.imageId)
                if (result === undefined) {
                    await clienteAxios.post('/products/deleteFromCloud', { url: item.url }, configHeaders)
                }
            }
            setErrorMessage({ name: '', price: '', description: '' })
            setProductImages([])
            setImageToDelete([])
            setProductInfo({
                name: '',
                price: '',
                description: '',
                color: '',
                size: '',
                quantity: ''
            })
            if (idModal === 'editProduct') {
                handleCloseEdit()
            } else {
                handleCloseNew()
            }
        } catch (error) {
            console.log(error);
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
        }
    }

    const handleClickDeleteProduct = async (productId) => {
        const response = confirm('Eliminar producto?')
        if (response) {
            const result = await clienteAxios.delete(`products/${productId}`, configHeaders)
            alert(result.data.msg)
            setIsLoadingHook(true)
        }
    }

    const handleClickSaveProduct = async (ev) => {
        ev.preventDefault()
        try {
            const product = {
                ...productInfo,
                price: productInfo.price === '' ? 0 : productInfo.price,
                quantity: productInfo.quantity === '' ? 0 : productInfo.quantity
            }
            const newProduct = await clienteAxios.post('/products', product, configHeaders)
            if (newProduct.status === 201) {
                for (const item of productImages) {
                    const result = await clienteAxios.post(`/products/addProductImage/${newProduct.data.productId}`, { imageUrl: item.url, imageId: item.imageId }, configHeaders)
                    if (result.status !== 200) {
                        alert('Tuvimos un problema para agregar las imagenes del producto')
                        return
                    } else {
                        alert(newProduct.data.msg)
                        setIsLoadingHook(true)
                        setErrorMessage({ name: '', price: '', description: '' })
                        setProductImages([])
                        setProductInfo({
                            name: '',
                            price: '',
                            description: '',
                            color: '',
                            size: '',
                            quantity: ''
                        })
                        handleCloseNew()
                    }
                }
            } else {
                setTimeout(() => {
                    alert('Tuvimos un problema para agregar el producto, intenta nuevamente')
                }, 500);
            }
        } catch (error) {
            console.log(error);
        }

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
            <Button onClick={handleShowNew}>Agregar Producto</Button>
            <ProductModalC
                idModal={'newProduct'}
                showNew={showNew}
                handleClickCancelProductUpdate={handleClickCancelProductUpdate}
                handleChageProductInfo={handleChageProductInfo}
                errorMessage={errorMessage}
                sizeOptions={sizeOptions}
                handleChangeNewImage={handleChangeNewImage}
                productImages={productImages}
                handleClickDelImgFromProduct={handleClickDelImgFromProduct}
                handleClickSaveProduct={handleClickSaveProduct}
                saveProduct={saveProduct} />
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
                                                    <ProductModalC
                                                        idModal={'editProduct'}
                                                        show={showEdit}
                                                        handleClickCancelProductUpdate={handleClickCancelProductUpdate}
                                                        productInfo={productInfo}
                                                        handleChageProductInfo={handleChageProductInfo}
                                                        errorMessage={errorMessage}
                                                        sizeOptions={sizeOptions}
                                                        handleChangeNewImage={handleChangeNewImage}
                                                        productImages={productImages}
                                                        handleClickDelImgFromProduct={handleClickDelImgFromProduct}
                                                        handleClickUpdateProduct={handleClickUpdateProduct}
                                                        saveProduct={saveProduct} />
                                                    {/* <Modal show={show} onHide={handleClickCancelProductUpdate}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Producto</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Form>
                                                                <Form.Group className="mb-3" controlId="formBasicName">
                                                                    <Form.Label>Nombre</Form.Label>
                                                                    <Form.Control 
                                                                    type="text" 
                                                                    name='name' 
                                                                    value={productInfo?.name || ''} 
                                                                    onChange={(ev) => handleChageProductInfo(ev)} 
                                                                    isInvalid={!!errorMessage.name}/>
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errorMessage.name}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicPrice">
                                                                    <Form.Label>Precio</Form.Label>
                                                                    <Form.Control 
                                                                    type="text" 
                                                                    name='price' 
                                                                    value={productInfo?.price || ''} 
                                                                    onChange={(ev) => handleChageProductInfo(ev)} 
                                                                    isInvalid={!!errorMessage.price}/>
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errorMessage.price}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicDescription">
                                                                    <Form.Label>Descripción</Form.Label>
                                                                    <Form.Control 
                                                                    type="text" 
                                                                    name='description' 
                                                                    value={productInfo?.description || ''} 
                                                                    onChange={(ev) => handleChageProductInfo(ev)} 
                                                                    isInvalid={!!errorMessage.description}/>
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errorMessage.description}
                                                                    </Form.Control.Feedback>
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicColor">
                                                                    <Form.Label>Color</Form.Label>
                                                                    <Form.Control type="text" name='color' value={productInfo?.color || ''} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicSize">
                                                                    <Form.Label>Talle</Form.Label>
                                                                    <Form.Select type="text" name='size' value={productInfo?.size || ''} onChange={(ev) => handleChageProductInfo(ev)}>
                                                                        {sizeOptions.map(size =>
                                                                            <option key={size.value} value={size.value}>{size.label}</option>
                                                                        )}
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className="mb-3" controlId="formBasicStock">
                                                                    <Form.Label>Stock</Form.Label>
                                                                    <Form.Control type="text" name='quantity' value={productInfo?.quantity || ''} onChange={(ev) => handleChageProductInfo(ev)} />
                                                                </Form.Group>
                                                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                                                    <Form.Label>Imagen</Form.Label>
                                                                    <Form.Control type="file" onChange={(ev) => handleChangeNewImage(ev.target.files[0])} />
                                                                </Form.Group>

                                                                <Container>
                                                                    <Row>
                                                                        {
                                                                            productImages.map(image =>
                                                                                <Col key={image.imageId}>
                                                                                    <Button onClick={() => handleClickDelImgFromProduct(image.imageId)}>X</Button>
                                                                                    <img src={image.url} alt="" />
                                                                                </Col>
                                                                            )
                                                                        }
                                                                    </Row>
                                                                </Container>

                                                                <Button variant="primary" type="submit" onClick={(ev) => handleClickUpdateProduct(ev)}>
                                                                    Guardar Cambios
                                                                </Button>
                                                            </Form>
                                                        </Modal.Body>
                                                    </Modal> */}

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
                                                disabled={storageRole === 'mainAdmin' ? false : true}
                                                onClick={() => handleClickChangeUserRole(user._id, user.role)}
                                            >
                                                {user.role === 'admin' ? 'Admin' : 'Usuario'}
                                            </Button>
                                        </td>
                                        <td>
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