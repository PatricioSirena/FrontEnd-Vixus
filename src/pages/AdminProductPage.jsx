import React, { useEffect, useState, useRef } from "react"
import clienteAxios, { configHeaders, configHeadersImage } from "../helpers/axios"
import Form from "react-bootstrap/Form"
import { Accordion, Button, Col, Container, FormControl, FormGroup, FormSelect, Modal, Row } from "react-bootstrap"
import GaleryC from "../components/GaleryC"
import Carrousel from "../components/Carrousel"
import ProductModalC from '../components/ProductModalC';


const AdminProductPage = () => {
    const [products, setProducts] = useState([])
    const [newProductImages, setNewProductImages] = useState([])
    const [imgErrors, setImgErrors] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showNewImageModal, setShowNewImageModal] = useState(false);
    const [searchWord, setSearchWord] = useState('')
    const fileInputRefs = useRef({})
    const [showEdit, setShowEdit] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [productInfo, setProductInfo] = useState({
        name: '',
        price: '',
        description: ''
    })
    const [errorMessage, setErrorMessage] = useState({
        name: '',
        price: '',
        description: ''
    })
    const [variantInfo, setVariantInfo] = useState('')
    const [variantError, setVariantError] = useState('')
    const [saveProduct, setSaveProduct] = useState(true)
    const [productIdState, setProductIdState] = useState(null);
    const [variantIdState, setVariantIdState] = useState(null);
    const [showNewVariantInput, setShowNewVariantInput] = useState(false);
    const [selectedSize, setSelectedSize] = useState({
        size: '',
        stock: 0
    });
    const [showNewSizeModal, setShowNewSizeModal] = useState(false);
    const [oldStockItems, setOldStockItems] = useState([])
    const sizeOptions = [{ value: '', label: '--' }, { value: 'S', label: 'S' }, { value: 'M', label: 'M' },
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

    const getStockProducts = async () => {
        try {
            const resultProducts = await clienteAxios.get('/products', configHeaders)
            setProducts(resultProducts.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error);
            // Configurar Log4js en front para guardar todos los errores en vez de console.log
        }
    }

    const handleChangeSearch = (ev) => {
        setSearchWord(ev.target.value)
    }

    const handleChangeNewImages = async (ev, productId, variantId) => {
        try {
            const images = Array.from(ev.target.files);
            for (const image of images) {
                const formData = new FormData();
                formData.append('image', image);
                const result = await clienteAxios.post(`/products/uploadToCloud`, formData, configHeadersImage)
                if (result.status !== 200) {
                    throw new Error('Error al subir la imagen');
                }
                const newImage = result.data
                setProductIdState(productId)
                setVariantIdState(variantId)
                setNewProductImages(prevState => [...prevState, newImage])
            }
        } catch (error) {
            alert(error.message);
        } finally {
            if (fileInputRefs.current[variantId]) {
                fileInputRefs.current[variantId].value = null;
            }
        }
    }

    const handleClickCancelUploadImages = async () => {
        try {
            for (const image of newProductImages) {
                await clienteAxios.post('/products/deleteFromCloud', { url: image }, configHeaders)
            }
            setNewProductImages([])
            setShowNewImageModal(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickUploadImages = async () => {
        try {
            for (const image of newProductImages) {
                const result = await clienteAxios.post('/products/addProductImage', { productId: productIdState, variantId: variantIdState, imageUrl: image }, configHeaders)
                if (result.status === 404) {
                    setImgErrors(image)
                }
            }
            setNewProductImages([])
            if (imgErrors.length > 0) {
                for (const error of imgErrors) {
                    await clienteAxios.post('/products/deleteFromCloud', { imageUrl: error }, configHeaders)
                }
                return alert('Error al subir alguna de las imágenes, intente nuevamente.')
            } else {
                return alert('Imágenes subidas correctamente.')
            }
        } catch (error) {
            console.log(error);
        } finally {
            setProductIdState(null)
            setVariantIdState(null)
            setImgErrors([])
            setShowNewImageModal(false)
            setIsLoading(true)
        }
    }

    const handleClickDelProductImage = async (imageUrl) => {
        try {
            const imgInDb = products.find(product => product.variants.some(variant => variant.galery.some(img => img.imageUrl === imageUrl)))
            if (!imgInDb) {
                const result = await clienteAxios.post('/products/deleteFromCloud', { url: imageUrl }, configHeaders)
                if (result.status === 400) alert('Error al eliminar la imagen, intente nuevamente.')
                if (result.status === 200) alert('Imagen eliminada correctamente.')
                setNewProductImages(prevState => prevState.filter(img => img !== imageUrl))
                return
            }
            const productVariant = imgInDb.variants.find(variant => variant.galery.some(img => img.imageUrl === imageUrl))
            const imgId = productVariant.galery.find(img => img.imageUrl === imageUrl)._id
            if (!productVariant || !imgId) return alert('Tuvimos un error inesperado, intenta nuevamente.')
            const result = await clienteAxios.delete(`/products/delProductImage/${imgInDb._id}/${productVariant._id}/${imgId}`, configHeaders)
            if (result.status === 400) alert('Error al eliminar la imagen, intente nuevamente.')
            if (result.status === 404) alert('No encontramos el producto en la base de datos.')
            alert('Imagen eliminada correctamente.')
            setIsLoading(true)
            await getStockProducts()
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickSetEditProduct = (item) => {
        setProductInfo({name: item.name, price: item.price, description: item.description})
        handleShowEdit()
    }

    const handleChangeProductInfo = (ev) => {
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
        setErrorMessage(newErrorMessage);
        const newValue = name === 'price' ? (value === '' ? '' : Number(value)) : value
        setProductInfo(prevState => ({ ...prevState, [name]: newValue }))
        const hasErrors = Object.values(newErrorMessage).some(error => error !== '');
        setSaveProduct(!hasErrors);
        ev.stopPropagation()
    }

    const handleClickSaveOrUpdateProduct = async (ev, modalId) => {
        ev.preventDefault()
        const editedProduct = {
            ...productInfo,
            price: productInfo.price === '' ? 0 : productInfo.price,
        }
        try {
            if (modalId === 'newProduct') {
                const newProduct = await clienteAxios.post('/products', editedProduct, configHeaders)
                alert(newProduct.data.msg)
                handleCloseNew()
            }
            if (modalId === 'editProduct') {
                const updateResult = await clienteAxios.put(`/products/${productInfo._id}`, editedProduct, configHeaders)
                alert(updateResult.data.msg)
                handleCloseEdit()
            }
            setErrorMessage({
                name: '',
                price: '',
                description: ''
            })
            setProductInfo({
                name: '',
                price: '',
                description: ''
            })
            setIsLoading(true)
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickCancelProductUpdate = async (ev, idModal) => {
        ev.stopPropagation()
        try {
            setErrorMessage({
                name: '',
                price: '',
                description: ''
            })
            setProductInfo({
                name: '',
                price: '',
                description: ''
            })
            if (idModal === 'editProduct') {
                handleCloseEdit()
            } else {
                handleCloseNew()
            }
        } catch (error) {
            alert(error.response.data.msg);
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
            setIsLoading(true)
        }
    }

    const handleClickDeleteProduct = async (productId) => {
        const response = confirm('Eliminar producto?')
        if (response) {
            const result = await clienteAxios.delete(`products/${productId}`, configHeaders)
            alert(result.data.msg)
            setIsLoading(true)
        }
    }

    const handleChangeVariantInfo = (ev) => {
        let newErrorMessage = '';
        if (!/^[A-Za-z0-9\s]{4,30}$/.test(ev.target.value)) {
            newErrorMessage = 'La variante debe tener entre 4 y 30 caracteres';
        } else {
            newErrorMessage = '';
        }
        setVariantError(newErrorMessage);
        setVariantInfo(ev.target.value);
        const hasErrors = newErrorMessage !== '';
        setSaveProduct(!hasErrors);
        ev.stopPropagation()
    }

    const handleClickCreateVariant = async (productId) => {
        if (variantInfo === '') return setVariantError('Debe ingresar un nombre o color para la variante');
        try {
            const result = await clienteAxios.post(`/products/createVariant/${productId}`, { color: variantInfo }, configHeaders)
            alert(result.data.msg)
            setVariantInfo('')
            setShowNewVariantInput(false)
            setIsLoading(true)
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickCancelNewVariant = () => {
        setVariantInfo('')
        setShowNewVariantInput(false)
    }

    const handleClickDelVariant = async (productId, variantId) => {
        const response = confirm('Eliminar variante?')
        if (response) {
            try {
                const result = await clienteAxios.delete(`/products/delproductVariant/${productId}/${variantId}`, configHeaders)
                if (result.status === 404) return alert(result.data.msg)
                alert(result.data.msg)
                setIsLoading(true)
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleClickShowNewSizeModal = (productId, variantId) => {
        setProductIdState(productId)
        setVariantIdState(variantId)
        setShowNewSizeModal(true)
    }

    const handleChangeFormSize = (ev) => {
        let { name, value } = ev.target
        if (name === 'stock' && value !== '') value = parseInt(value)
        if (name === 'stock' && value == 0) value = 0
        setSelectedSize(preventDefault => ({ ...preventDefault, [name]: value }))
    }

    const handleClickCreateSize = async () => {
        try {
            const result = await clienteAxios.post(`/products/stockPerSize`, { productId: productIdState, variantId: variantIdState, size: selectedSize.size, stock: selectedSize.stock }, configHeaders)
            alert(result.data.msg)
            setShowNewSizeModal(false)
            setIsLoading(true)
        } catch (error) {
            console.log(error);
        } finally {
            setProductIdState(null)
            setVariantIdState(null)
            setSelectedSize({
                size: '',
                stock: 0
            })
        }
    }

    const handleChangeStockPerSize = (newStock, oldStock, productId, variantId, itemSize) => {
        const newStockNum = newStock === '' ? 0 : parseInt(newStock);
        const oldStockInState = oldStockItems.find(item => item.size === itemSize && item.variantId === variantId && item.productId === productId);
        if (oldStockInState === null || oldStockInState === undefined) setOldStockItems(prevState => [...prevState, { size: itemSize, variantId, productId, stock: oldStock }]);
        setProducts(prevState =>
            prevState.map(product => {
                if (product._id !== productId) return product;
                const updatedVariants = product.variants.map(variant => {
                    if (variant._id !== variantId) return variant;
                    const updatedSizes = variant.sizes.map(sizeObj => {
                        if (sizeObj.size !== itemSize) return sizeObj;
                        return { ...sizeObj, stock: newStockNum };
                    });
                    return { ...variant, sizes: updatedSizes };
                });
                return { ...product, variants: updatedVariants };
            })
        );
    }

    const handleClickModifyStockPerSize = async (productId, variantId) => {
        const filtrarProductosPorId = (idProduct, idVariant) => {
            let coincidencias = [];
            for (const item of oldStockItems) {
                const newStock = products
                    .find(product => product._id === item.productId)
                    ?.variants.find(variant => variant._id === item.variantId)
                    ?.sizes.find(sizeObj => sizeObj.size === item.size);
                if (item.productId === idProduct && item.variantId === idVariant && item.stock !== newStock.stock) {
                    item.stock = newStock.stock;
                    item.sizeId = newStock._id;
                    coincidencias.push(item);
            }
        }
            if (coincidencias.length > 0) setOldStockItems(prevState => prevState.filter(item => item.productId !== idProduct || item.variantId !== idVariant));
            return coincidencias;
        }
        let errors = []
        const productsToModify = filtrarProductosPorId(productId, variantId)
        if (productsToModify.length <= 0) return alert('No hay cambios para guardar.');
        try {
            for (const item of productsToModify) {
                const result = await clienteAxios.post('/products/stockPerSize', { productId, variantId, size: item.size, stock: item.stock }, configHeaders)
                if (result.status !== 200) errors.push(item.sizeId)
            }
            if (errors.length > 0) return alert('Error al modificar el stock de alguno de los talles, intente nuevamente.')
            alert('Stock modificado correctamente.')
        }
        catch (error) {
            console.log(error);
        }
    }


    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchWord.toLowerCase())
        || product.description.toLowerCase().includes(searchWord.toLowerCase())
        || product.price.toString().includes(searchWord)
    );

    useEffect(() => {
        if (isLoading) getStockProducts()
        if (newProductImages.length > 0) setShowNewImageModal(true)
        if (newProductImages.length === 0) setShowNewImageModal(false)
    }, [isLoading, newProductImages])

    return (
        <Container>
            <div className="containerFormNewProduct" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form>
                    <Form.Group controlId="formBasicSearch">
                        <Form.Control onChange={handleChangeSearch} style={{ width: '12em', margin: '1em 6em 0px' }} value={searchWord} placeholder="Buscar producto" />
                    </Form.Group>
                </Form>
                <Button
                    variant="primary"
                    style={{ margin: '1em 6em 0' }}
                    onClick={handleShowNew}
                >+</Button>
                <ProductModalC
                    idModal={'newProduct'}
                    showNew={showNew}
                    handleClickCancelProductUpdate={handleClickCancelProductUpdate}
                    handleChangeProductInfo={handleChangeProductInfo}
                    productInfo={productInfo}
                    errorMessage={errorMessage}
                    handleClickSaveOrUpdateProduct={handleClickSaveOrUpdateProduct}
                    saveProduct={saveProduct} />
            </div>
            <Accordion flush style={{ padding: '3em' }}>
                {
                    filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Accordion.Item eventKey={product._id} key={product._id}>
                                <Accordion.Header>
                                    <Container>
                                        <Row style={{ display: 'flex', alignItems: 'center' }}>
                                            <Col xs={12} md={8}>
                                                {product.name}
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <div className="productOptions" style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div
                                                        role="button"
                                                        className={product.active ? 'btn btn-warning' : 'btn btn-primary'}
                                                        style={{ marginRight: '1em', fontSize: 'small' }}
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            handleClickChangeProductState(product._id, product.active)
                                                        }}>
                                                        {product.active ? 'Deshabilitar' : 'Habilitar'}
                                                    </div>
                                                    <div
                                                        role="button"
                                                        className='btn btn-info'
                                                        style={{ marginRight: '1em', fontSize: 'small' }}
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            handleClickSetEditProduct(product)
                                                        }}>
                                                        Editar
                                                    </div>
                                                    <ProductModalC
                                                        idModal={'editProduct'}
                                                        showEdit={showEdit}
                                                        handleClickCancelProductUpdate={handleClickCancelProductUpdate}
                                                        productInfo={productInfo}
                                                        handleChangeProductInfo={handleChangeProductInfo}
                                                        errorMessage={errorMessage}
                                                        handleClickSaveOrUpdateProduct={handleClickSaveOrUpdateProduct}
                                                        saveProduct={saveProduct} />
                                                    <div
                                                        role="button"
                                                        className="btn btn-danger"
                                                        style={{ fontSize: 'small' }}
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            handleClickDeleteProduct(product._id)
                                                        }}>
                                                        Eliminar
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Container className="productDescription">
                                        <h5 style={{ textAlign: 'center', padding: '.5em 0' }}>Información del prodcuto</h5>
                                        <Row>
                                            <Col xs={12} md={3}>
                                                {product.name}
                                            </Col>
                                            <Col xs={12} md={6} style={{ textAlign: 'center' }}>
                                                {product.description}
                                            </Col>
                                            <Col xs={12} md={3}>
                                                {product.price}
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Container className="newProductVariantsSection">
                                        <div style={{ margin: '2.5em 0 1.5em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <h5 style={{ margin: '0 0 0 3.8em' }}>Variantes del producto</h5>
                                            <Button
                                                style={showNewVariantInput ? { display: 'none' } : { marginLeft: '3em', width: '2.5em', height: '2.5em' }}
                                                variant="primary"
                                                title="Agregar variante"
                                                onClick={(ev) => { ev.stopPropagation(), setShowNewVariantInput(true) }}>+</Button>
                                        </div>
                                        <div style={!showNewVariantInput ? { display: 'none' } : { display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1em 0' }}>
                                            <FormGroup style={{ width: '18em' }}>
                                                <FormControl
                                                    type="text"
                                                    name="color"
                                                    value={variantInfo || ''}
                                                    placeholder="Nombre o color de la variante"
                                                    onChange={(ev) => handleChangeVariantInfo(ev)}
                                                    isInvalid={!!variantError}
                                                />
                                                <FormControl.Feedback type="invalid">
                                                    {variantError}
                                                </FormControl.Feedback>
                                            </FormGroup>
                                            <Button
                                                disabled={saveProduct ? false : true}
                                                style={{ margin: '0 0 0 1em' }}
                                                variant="primary"
                                                onClick={() => handleClickCreateVariant(product._id)}>
                                                Agregar
                                            </Button>
                                            <Button
                                                style={{ margin: '0 0 0 .5em' }}
                                                variant='secondary'
                                                onClick={() => handleClickCancelNewVariant()}>
                                                Cancelar
                                            </Button>
                                        </div>
                                        {
                                            product.variants.length > 0 ? (
                                                product.variants.map((variant) => (
                                                    <React.Fragment key={variant._id}>
                                                        <hr style={{ width: '80%', margin: '1em auto' }} />
                                                        <div className="nameAndDeleteVariantSection" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                            <p style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', flex: '1', textTransform: 'capitalize' }}>{variant.color}</p>
                                                            <Button
                                                                variant="danger"
                                                                style={{ width: '2.5em', height: '2.5em' }}
                                                                onClick={(ev) => {
                                                                    ev.preventDefault(),
                                                                        handleClickDelVariant(product._id, variant._id)
                                                                }}>
                                                                x</Button>
                                                        </div>
                                                        <Row style={{ padding: '.5em 0' }}>
                                                            <Col xs={12} md={7}>
                                                                <GaleryC galery={variant.galery} deleteImageFunction={handleClickDelProductImage} />
                                                                <FormGroup style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '16%' }}>
                                                                    <FormControl
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(ev) => handleChangeNewImages(ev, product._id, variant._id)}
                                                                        ref={el => fileInputRefs.current[variant._id] = el}
                                                                        style={{ width: '70%', marginTop: '1em' }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xs={12} md={5}
                                                                style={{ textAlign: 'center' }}>
                                                                <div>
                                                                    <p>Talles Disponibles</p>
                                                                </div>
                                                                <div style={{ height: '23em' }}>
                                                                    {
                                                                        variant.sizes.length > 0 ? (
                                                                            <>
                                                                                <div style={{ height: '19.5em', overflowY: 'auto', marginBottom: '1em' }}>
                                                                                    {variant.sizes.map((sizeObj) => (
                                                                                        <div key={sizeObj._id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '.5em', gap: '1em' }}>
                                                                                            <p style={{ width: '4em', margin: '0', textTransform: 'uppercase', marginRight: '1.5em' }}>{sizeObj.size}</p>
                                                                                            <FormGroup>
                                                                                                <FormControl
                                                                                                    type="number"
                                                                                                    style={{ width: '4em', marginLeft: '1.5em' }}
                                                                                                    value={sizeObj.stock === 0 ? '' : sizeObj.stock}
                                                                                                    onChange={(ev) => handleChangeStockPerSize(ev.target.value, sizeObj.stock, product._id, variant._id, sizeObj.size)}
                                                                                                />
                                                                                            </FormGroup>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <Button
                                                                                    onClick={() => handleClickModifyStockPerSize(product._id, variant._id)}
                                                                                    variant='secondary'>Guardar Cambios</Button>
                                                                            </>
                                                                        )
                                                                            :
                                                                            (
                                                                                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                    <p>No hay talles disponibles para esta variante.</p>
                                                                                </div>
                                                                            )
                                                                    }
                                                                </div>
                                                                <Modal show={showNewSizeModal} onHide={() => setShowNewSizeModal(false)} >
                                                                    <Modal.Header closeButton style={{ position: 'relative' }}>
                                                                        <Modal.Title style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                                                                            Nuevo Talle
                                                                        </Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <FormGroup style={{ marginRight: '1em' }}>
                                                                            <FormSelect
                                                                                type="text"
                                                                                style={{ width: '5em' }}
                                                                                name="size"
                                                                                onChange={handleChangeFormSize}
                                                                            >
                                                                                {sizeOptions.map((option) => (
                                                                                    <option key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                    </option>
                                                                                ))}
                                                                            </FormSelect>
                                                                        </FormGroup>
                                                                        <FormGroup style={{ marginLeft: '1em' }}>
                                                                            <FormControl
                                                                                type="number"
                                                                                name="stock"
                                                                                placeholder="0"
                                                                                onChange={handleChangeFormSize}
                                                                                style={{ width: '5em' }}
                                                                            />
                                                                        </FormGroup>
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <Button
                                                                            variant="secondary"
                                                                            onClick={() => handleClickCreateSize()}
                                                                            disabled={selectedSize.size === '' ? true : false}
                                                                        >
                                                                            Guardar Talle
                                                                        </Button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                                <div className="sizeSelect" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '.5em 0' }}>
                                                                    <Button
                                                                        variant="primary"
                                                                        onClick={() => handleClickShowNewSizeModal(product._id, variant._id)}>
                                                                        Agregar Talle
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Modal show={showNewImageModal} onHide={handleClickCancelUploadImages} >
                                                            <Modal.Header closeButton style={{ position: 'relative' }}>
                                                                <Modal.Title style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Nuevas Imagenes</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <Carrousel idPage={'adminProductPage'} productImages={newProductImages} deleteImageFunction={handleClickDelProductImage} />
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="primary"
                                                                    onClick={(ev) => {
                                                                        ev.stopPropagation(),
                                                                            handleClickUploadImages()
                                                                    }}
                                                                >
                                                                    Guardar Imagenes
                                                                </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </React.Fragment>
                                                ))
                                            )
                                                :
                                                (
                                                    <>
                                                        <hr style={{ width: '80%', margin: '1em auto' }} />
                                                        <p style={{ textAlign: 'center' }}>No hay variantes disponibles.</p>
                                                    </>
                                                )
                                        }
                                    </Container>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))
                    ) : (
                        <p>No hay productos disponibles.</p>
                    )
                }
            </Accordion>
        </Container>
    )
}

export default AdminProductPage