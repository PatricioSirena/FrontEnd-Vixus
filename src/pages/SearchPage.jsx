import { useParams } from "react-router-dom"
import clienteAxios from "../helpers/axios"
import { useCallback, useEffect, useState } from "react"
import { Col, Container, Dropdown, Row } from "react-bootstrap"
import CardC from "../components/CardC"
import ProductFilterC from "../components/ProductFilterC"
import Spinner from 'react-bootstrap/Spinner';

const SearchPage = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [searchProducts, setSearchProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState(searchProducts)
    const [orderBy, setOrderBy] = useState('')
    const [title, setTitle] = useState('')
    const orderOptions = ['ascendingName', 'descendingName', 'ascendingPrice', 'descendingPrice', 'date']

    const capitalize = (str) => {
        if (!str || typeof str !== 'string') return '';
        setTitle(str.toLowerCase().split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '))
    };

    const getSearchedProducts = useCallback(async () => {
        setIsLoading(true)
        const result = await clienteAxios.get(`/products/search/${params.toSearch}`)
        setSearchProducts(result.data)
        setTimeout(() => {
            setIsLoading(false)
        }, 600);
    }, [params.toSearch])

    const handleClickOrderProdcutsBy = (ev, keyWord) => {
        ev.preventDefault()
        setIsLoading(true)
        setOrderBy(keyWord)
        if (keyWord === 'ascendingName') {
            setSearchProducts(searchProducts.sort((a, b) => a.name.localeCompare(b.name)))
        }
        if (keyWord === 'descendingName') {
            setSearchProducts(searchProducts.sort((a, b) => b.name.localeCompare(a.name)))
        }
        if (keyWord === 'ascendingPrice') {
            setSearchProducts(searchProducts.sort((a, b) => a.price - b.price))
        }
        if (keyWord === 'descendingPrice') {
            setSearchProducts(searchProducts.sort((a, b) => b.price - a.price))
        }
        if (keyWord === 'date') {
            setSearchProducts(searchProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 600);
    }

    const handleFilteredProducts = useCallback((productsFiltered) => {
        setFilteredProducts(productsFiltered)
    }, [])

    useEffect(() => {
        getSearchedProducts()
        capitalize(params.toSearch)
    }, [getSearchedProducts, params.toSearch])

    return (
        <Container fluid>
            <Row>
                <Col xl={2}>
                    <ProductFilterC products={searchProducts} onFilteredProducts={handleFilteredProducts} />
                </Col>
                <Col xl={10}>
                    {isLoading ?
                        <div style={{ display: 'flex', justifyContent: 'center', height: '70vh', alignItems: 'center' }}>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        <>
                            <Dropdown style={{ margin: '2em 0' }}>
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
                                    <h2 style={filteredProducts.length > 0 ? { textAlign: 'center' } : { display: 'none' }}>Productos relacionados la busqueda: {title}</h2>
                                    {
                                        searchProducts.length === 0 ? (
                                            <Col sm={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '4em' }}>
                                                <h4>No se encontraron productos para la búsqueda {title}</h4>
                                            </Col>
                                        ) :
                                            filteredProducts.length > 0 ? (
                                                filteredProducts.map((product) => (
                                                    <Col key={product._id} sm={12} md={6} xl={3} style={{ marginTop: '1.7em' }}>
                                                        <CardC key={product._id} cardId={'searchCard'} productId={product._id}
                                                            productName={product.name} productPrice={product.price} 
                                                            mainImage={product.mainPicture}/>
                                                    </Col>
                                                ))
                                            ) : (
                                                <Col sm={12} style={{ marginTop: '1.7em' }}>
                                                    <h4>No se encontraron productos que coincidan con los filtros aplicados.</h4>
                                                </Col>
                                            )}
                                </Row>
                            </Container>
                        </>
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default SearchPage