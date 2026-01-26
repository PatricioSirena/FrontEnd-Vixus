import { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import clienteAxios, { configHeaders } from "../helpers/axios"
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap"
import { FaHeart } from "react-icons/fa"
import GaleryC from "../components/GaleryC"

const ProductPage = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [product, setProduct] = useState({})
    const [userFavoritesProducts, setUserFavoritesProducts] = useState([])
    const [selectedVariant, setSelectedVariant] = useState(null)
    const [selectedSize, setSelectedSize] = useState()
    const [availableSizes, setAvailableSizes] = useState([])
    const storageRole = JSON.parse(sessionStorage.getItem('role'))
    const token = JSON.parse(sessionStorage.getItem('token'))

    const getProduct = useCallback(async () => {
        try {
            const result = await clienteAxios.get(`/products/${params.productId}`)
            const productWithUpperCaseVariants = {
                ...result.data,
                variants: result.data.variants.map(variant => ({
                    ...variant,
                    color: variant.color.charAt(0).toUpperCase() + variant.color.slice(1)
                }))
            };         
            setProduct(productWithUpperCaseVariants);
            if (params.variantId === undefined) {
                setSelectedVariant(productWithUpperCaseVariants.variants[0])
                const upperCaseSizes = productWithUpperCaseVariants.variants[0].sizes.map(s => ({ ...s, size: s.size.toUpperCase()}))
                setAvailableSizes(upperCaseSizes)
            } else {
                const favoriteVariant = productWithUpperCaseVariants.variants.find((v) => v._id === params.variantId)
                setSelectedVariant(favoriteVariant)                
                const upperCaseSizes = favoriteVariant.sizes.map(s => ({ ...s, size: s.size.toUpperCase() }))
                setAvailableSizes(upperCaseSizes)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        }
    }, [params.productId, params.variantId])

    const getFavorites = useCallback(async () => {
        if (storageRole === 'user') {
            try {
                const result = await clienteAxios.get(`/products/getFavorites`, configHeaders)
                setUserFavoritesProducts(result.data.products)
            } catch (error) {
                console.log(error);
            }
        }
    }, [storageRole])

    const checkIsFavorite = useCallback(() => {
        if (storageRole === 'user' && product._id && selectedVariant) {
            const isFav = userFavoritesProducts.some(fav =>
                fav.idProduct === product._id && fav.variantId === selectedVariant._id
            );
            setIsFavorite(isFav);
        }
    }, [product._id, selectedVariant, storageRole, userFavoritesProducts])

    const handleClickAddToCart = async () => {
        try {
            const result = await clienteAxios.post('/products/addToCart', { productId: product._id, variantId: selectedVariant._id, sizeId: selectedSize._id }, configHeaders)
            alert(result.data.msg);
            setIsLoading(true)
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const handleClickAddToFav = async () => {
        if (token === null) {
            alert('Debe iniciar sesion, redirigiendo a login')
        }
        try {
            const result = await clienteAxios.post(`/products/addToFavorite`, { productId: product._id, variantId: selectedVariant._id }, configHeaders)
            alert(result.data.msg);
            await getFavorites();
        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    const handleClickAvailableSize = (ev, variant) => {
        ev.preventDefault()
        setSelectedVariant(variant)
        const upperCaseSizes = variant.sizes.map(s => ({ ...s, size: s.size.toUpperCase() }))
        setAvailableSizes(upperCaseSizes)
    }

    const handleClickDelFromFav = async () => {
        try {
            const result = await clienteAxios.post(`/products/delFromFavorite`, { productId: product._id, variantId: selectedVariant._id }, configHeaders)
            alert(result.data.msg);
            await getFavorites();
        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    useEffect(() => {
        if (isLoading) {
            getProduct();
        }
    }, [isLoading, getProduct]);

    useEffect(() => {
        if (isLoading) {
            getFavorites();
        }
    }, [isLoading, getFavorites]);

    useEffect(() => {
        checkIsFavorite();
    }, [checkIsFavorite]);

    return (
        <>
            <Container style={{ margin: '2em' }}>
                <Row>
                    <Col sm={12} md={7}>
                        <GaleryC idPage={'productPage'} galery={selectedVariant?.galery} />
                    </Col>
                    <Col sm={12} md={5} style={{ textAlign: 'center' }}>
                        <Row className="justify-content-center align-items-center mb-3">
                            <Col xs="auto">
                                <div className="description" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{product.description}</div>
                            </Col>
                            <Col xs="auto" style={{ padding: '0' }}>
                                <FaHeart
                                    size={isFavorite ? 24 : 23}
                                    style={{
                                        fill: isFavorite ? '#007bff' : 'transparent',
                                        stroke: '#007bff',
                                        strokeWidth: isFavorite ? 0 : 50,
                                        cursor: storageRole === 'user' ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease'
                                    }}
                                    title={storageRole === null ? 'Debe iniciar sesión' : storageRole !== 'user' ? 'Sin Permiso' : isFavorite ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                                    onClick={storageRole === 'user' ? (isFavorite ? handleClickDelFromFav : handleClickAddToFav) : undefined}
                                />
                            </Col>
                        </Row>
                        <div className="variantSection" style={{ display: 'flex', gap: '1em', justifyContent: 'center', marginTop: '1em' }}>
                            <div className="variantDropDown">
                                <p>Colores:</p>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light">
                                        {selectedVariant === undefined ? 'Seleccionar Color' : selectedVariant?.color}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            product.variants && product.variants.map((variant) => (
                                                <Dropdown.Item as={'button'} onClick={(ev) => handleClickAvailableSize(ev, variant)} key={variant._id}>{variant.color}</Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="sizesDropDown">
                                <p>Talles:</p>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" disabled={availableSizes.length <= 0 ? true : false}>
                                        {availableSizes.length <= 0 ? 'Sin Stock' : selectedSize === undefined ? 'Seleccionar Talle' : selectedSize.size}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            availableSizes.map((s) => (
                                                <Dropdown.Item as={'button'} disabled={s.stock <= 0 ? true : false} onClick={() => setSelectedSize(s)} key={s._id}>{s.size}</Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="price" >
                            <strong>Precio: </strong>${product.price}
                        </div>
                        <div className="options" >
                            <Button
                                className="mx-3 mt-3"
                                disabled={product.outOfStock === true ? true : storageRole !== 'user' ? true : availableSizes.length <= 0 ? true : selectedSize?.stock <= 0 ? true : selectedSize === undefined ? true : false}
                                onClick={() => handleClickAddToCart()}>
                                {product?.outOfStock === true || selectedSize?.stock <= 0 ? 'Sin Stock' : storageRole === null ? 'Iniciar Sesión' : storageRole !== 'user' ? 'Sin Permiso' : selectedSize === undefined ? 'Selecciona un talle' : 'Agregar al carrito'}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ProductPage