import { useEffect, useState } from "react"
import CardC from "../components/CardC"
import clienteAxios from "../helpers/axios"
import Spinner from 'react-bootstrap/Spinner';
import { Col, Container, Dropdown, Row } from "react-bootstrap";


const AllProductsPage = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [orderBy, setOrderBy] = useState('')
    const orderOptions = ['ascendingName', 'descendingName', 'ascendingPrice', 'descendingPrice', 'date' ]

    const handleClickOrderProdcutsBy = (ev, keyWord) => {
        ev.preventDefault()
        setIsLoading(true)
        setOrderBy(keyWord)
        if(keyWord === 'ascendingName') {
            setProducts(products.sort((a, b) => a.name.localeCompare(b.name)))
        }
        if(keyWord === 'descendingName') {
            setProducts(products.sort((a, b) => b.name.localeCompare(a.name)))
        }
        if(keyWord === 'ascendingPrice') {
            setProducts(products.sort((a, b) => a.price - b.price))
        }
        if(keyWord === 'descendingPrice') {
            setProducts(products.sort((a, b) => b.price - a.price))
        }
        if(keyWord === 'date') {
            setProducts(products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 600);
    }

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await clienteAxios.get('/products')
                setProducts(response.data)
            } catch (error) {
                alert(error.response.data.msg)
            } finally {
                setIsLoading(false)
            }
        }
        getProducts()
    }, [])

    return (
        <>
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
                                    products.map((product) => (
                                        <Col key={product._id} sm={12} md={6} xl={3} style={{ marginTop: '1.7em' }}>
                                            <CardC key={product._id} cardId={'cardCategory'} productId={product._id}
                                                productName={product.name} productPrice={product.price}
                                                mainImage={product.mainPicture} productStock={product.quantity} />
                                        </Col>
                                    ))}
                            </Row>
                        </Container>
                    </>
            }
        </>
    )
}

export default AllProductsPage