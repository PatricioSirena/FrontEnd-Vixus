import { useCallback, useEffect, useState } from "react"
import CardC from "../components/CardC"
import clienteAxios from "../helpers/axios"
import Spinner from 'react-bootstrap/Spinner';
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import ProductFilterC from "../components/ProductFilterC";


const AllProductsPage = () => {
    const [allProducts, setAllProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState(allProducts)
    const [isLoading, setIsLoading] = useState(true)
    const [orderBy, setOrderBy] = useState('')
    const orderOptions = ['ascendingName', 'descendingName', 'ascendingPrice', 'descendingPrice', 'date']

    const handleClickOrderProdcutsBy = (ev, keyWord) => {
        ev.preventDefault()
        setIsLoading(true)
        setOrderBy(keyWord)
        if (keyWord === 'ascendingName') {
            setAllProducts(allProducts.sort((a, b) => a.name.localeCompare(b.name)))
        }
        if (keyWord === 'descendingName') {
            setAllProducts(allProducts.sort((a, b) => b.name.localeCompare(a.name)))
        }
        if (keyWord === 'ascendingPrice') {
            setAllProducts(allProducts.sort((a, b) => a.price - b.price))
        }
        if (keyWord === 'descendingPrice') {
            setAllProducts(allProducts.sort((a, b) => b.price - a.price))
        }
        if (keyWord === 'date') {
            setAllProducts(allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 600);
    }

    const handleFilteredProducts = useCallback((productsFiltered) => {
        setFilteredProducts(productsFiltered)
    }, [])

    useEffect(() => {
        const getProducts = async () => {
            try {
                const activeProducts = []
                const response = await clienteAxios.get('/products')
                for (let product of response.data) {
                    if (product.active) activeProducts.push(product)
                }
                setAllProducts(activeProducts)
            } catch (error) {
                alert(error.response.data.msg)
            } finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 600);
            }
        }
        getProducts()
    }, [])

    return (
        <Container fluid style={{ margin: '1.5em 0' }}>
            <Row>
                <Col lg={2}>
                    <ProductFilterC products={allProducts} onFilteredProducts={handleFilteredProducts} />
                </Col>
                <Col lg={10}>
                    {
                        isLoading ?
                            <div style={{ display: 'flex', justifyContent: 'center', height: '70vh', alignItems: 'center' }}>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                            :
                            <>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        className="text-decoration-none"
                                        style={{
                                            cursor: 'pointer',
                                            background: 'none',
                                            border: 'none',
                                            color: 'inherit',
                                            padding: '0',
                                            outline: 'none',
                                        }}
                                    >
                                        {`Ordenar por: ${orderBy === '' ? 'Relevancia' : orderBy === 'ascendingName' ? 'Nombre A-Z' : orderBy === 'descendingName' ? 'Nombre Z-A' : orderBy === 'ascendingPrice' ? 'Menor precio' : orderBy === 'descendingPrice' ? 'Mayor precio' : orderBy === 'date' && 'Fecha'}`}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            orderOptions.map((option, index) => (
                                                <Dropdown.Item as={"button"} key={index} onClick={(ev) => handleClickOrderProdcutsBy(ev, option)}>
                                                    {option === 'ascendingName' && 'Nombre A-Z'}
                                                    {option === 'descendingName' && 'Nombre Z-A'}
                                                    {option === 'ascendingPrice' && 'Menor precio'}
                                                    {option === 'descendingPrice' && 'Mayor precio'}
                                                    {option === 'date' && 'Fecha'}
                                                </Dropdown.Item>
                                            ))
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Container>
                                    <Row>
                                        {
                                            allProducts.length === 0 ?
                                                <Col sm={12} style={{ marginTop: '1.7em' }}>
                                                    <h4>No hay productos disponibles en este momento.</h4>
                                                </Col>
                                                :
                                                filteredProducts?.length > 0 ? (
                                                    filteredProducts.map((product) => (
                                                        <Col key={product._id} sm={12} md={6} xl={3} style={{ marginTop: '1.7em' }}>
                                                            <CardC key={product._id} cardId={'allProductCard'} productId={product._id}
                                                                productName={product.name} productPrice={product.price} mainImage={product.mainPicture} 
                                                                soldOut={product.outOfStock} />
                                                        </Col>
                                                    ))
                                                ) : (
                                                    <Col sm={12} style={{ marginTop: '1.7em' }}>
                                                        <h4>No se encontraron productos que coincidan con los filtros aplicados.</h4>
                                                    </Col>
                                                )
                                        }
                                    </Row>
                                </Container>
                            </>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default AllProductsPage