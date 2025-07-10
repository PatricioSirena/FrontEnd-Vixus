import React, { useEffect, useState, useRef } from "react"
import clienteAxios, { configHeaders, configHeadersImage } from "../helpers/axios"
import Form from "react-bootstrap/Form"
import { Accordion, Button, Col, Container, FormControl, FormGroup, Modal, Row } from "react-bootstrap"
import GaleryC from "../components/GaleryC"
import Carrousel from "../components/Carrousel"

const AdminProductPage = () => {
    const [products, setProducts] = useState([])
    const [newProductImages, setNewProductImages] = useState([])
    const [imgErrors, setImgErrors] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showNewImageModal, setShowNewImageModal] = useState(false);
    const [searchWord, setSearchWord] = useState('')
    const fileInputRef = useRef(null)

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

    const handleChangeNewImages = async (ev) => {
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
                setNewProductImages(prevState => [...prevState, newImage])
            }
        } catch (error) {
            alert(error.message);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
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

    const handleClickUploadImages = async (productId, variantId) => {
        try {
            for (const image of newProductImages) {
                const result = await clienteAxios.post('/products/addProductImage', { productId, variantId, imageUrl: image }, configHeaders)
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

    // useEffect(() => {
    // }, [newProductImages])

    return (
        <Container>
            <Form>
                <Form.Group controlId="formBasicSearch">
                    <Form.Control onChange={handleChangeSearch} style={{ width: '12em', margin: '1em 8em 0px' }} value={searchWord} placeholder="Buscar producto" />
                </Form.Group>
            </Form>
            <Accordion flush style={{ padding: '3em' }}>
                {
                    filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <Accordion.Item eventKey={product._id} key={product._id}>
                                <Accordion.Header>
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={9}>
                                                {product.name}
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <div className="productOptions" style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div role="button" className="btn btn-primary" style={{ marginRight: '1em', fontSize: 'small' }}>Habilitar</div>
                                                    <div role="button" className="btn btn-info" style={{ fontSize: 'small' }}>Eliminar</div>
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
                                    <Container className="productVariants">
                                        <h5 style={{ textAlign: 'center', padding: '2em 0 1em 0' }}>Variantes del producto</h5>
                                        {
                                            product.variants.length >= 0 ? (
                                                product.variants.map((variant) => (
                                                    <React.Fragment key={variant._id}>
                                                        <hr style={{ width: '80%', margin: '1em auto' }} />
                                                        <p style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>{variant.color}</p>
                                                        <Row style={{ padding: '.5em 0' }}>
                                                            <Col xs={12} md={7}>
                                                                <GaleryC galery={variant.galery} deleteImageFunction={handleClickDelProductImage} />
                                                                <FormGroup>
                                                                    <FormControl
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(ev) => handleChangeNewImages(ev)}
                                                                        ref={fileInputRef}
                                                                        style={{ marginTop: '1em' }}
                                                                    />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col xs={12} md={5}>
                                                            </Col>
                                                        </Row>
                                                        <Modal show={showNewImageModal} onHide={handleClickCancelUploadImages} >
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Nuevas Imagenes</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <Carrousel idPage={'adminProductPage'} productImages={newProductImages} deleteImageFunction={handleClickDelProductImage} />
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="primary"
                                                                    onClick={() => handleClickUploadImages(product._id, variant._id)}
                                                                >
                                                                    Save Changes
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
                                                        <p>No hay variantes disponibles.</p>
                                                    </>
                                                )
                                        }
                                        <Row>
                                        </Row>
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