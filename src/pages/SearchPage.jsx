import { useParams } from "react-router-dom"
import clienteAxios from "../helpers/axios"
import { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import CardC from "../components/CardC"

const SearchPage = () => {
    const params = useParams()
    const [products, setProducts] = useState([])
    const getSearchedProducts = async () =>{
        const result = await clienteAxios.get(`/products/search/${params.toSearch}`)
        setProducts(result.data)
    }

    useEffect(() => {
        getSearchedProducts()
    },)
    
    return (
        <>
        <Container>
            <Row>
                {products.map(product =>
                    <Col key={product._id}>
                        <CardC cardId={'productCard'} productId={product._id} 
                                productName={product.name} productPrice={product.price}
                                mainImage={product.mainPicture} productStock={product.quantity}/>
                    </Col>
                )
                }
            </Row>
        </Container>
        </>
    )
}

export default SearchPage