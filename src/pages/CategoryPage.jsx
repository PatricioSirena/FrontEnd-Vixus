import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import clienteAxios from "../helpers/axios"
import { Col, Container, Row } from "react-bootstrap"
import CardC from "../components/CardC"
import Spinner from 'react-bootstrap/Spinner';

const CategoryPage = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [categoryProducts, setCategoryProducts] = useState([])

    useEffect(() => {
        const getCategoryProducts = async () => {
            setIsLoading(true)
            try {
                const result = await clienteAxios.get(`/products/search/${params.categoryName}`)
                setCategoryProducts(result.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            } catch (error) {
                console.log(error);
            }
        }
        getCategoryProducts()
    }, [params.categoryName])

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
                    <div style={{ height: '70vh', alignItems: 'center' }}>
                        <h1 style={{ textAlign: 'center' }}>Productos de la categoría: {params.categoryName}</h1>
                        <Container>
                            <Row>
                                {
                                    categoryProducts.map((product) => (
                                        <Col key={product._id} sm={12} md={6} xl={3}>
                                            <CardC key={product._id} cardId={'productCard'} productId={product._id}
                                                productName={product.name} productPrice={product.price}
                                                mainImage={product.mainPicture} productStock={product.quantity} />
                                        </Col>
                                    ))}
                            </Row>
                        </Container>
                    </div>
            }
        </>
    )
}

export default CategoryPage