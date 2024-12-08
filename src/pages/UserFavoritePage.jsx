import { useEffect, useState } from "react"
import CardC from "../components/CardC"
import clienteAxios, { configHeaders } from "../helpers/axios"
import { Col, Container, Row } from "react-bootstrap"

const UserFavoritePage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [favProducts, setFavProducts] = useState([])

    const getFavorites = async () => {
        const arrayFav = []
        try {
            const idsResult = await clienteAxios.get(`/products/getFavorites`, configHeaders)
            const productsIds = idsResult.data.products
            for (const item of productsIds) {
                const productresult = await clienteAxios.get(`/products/${item}`, configHeaders)
                const product = productresult.data
                arrayFav.push(product)
            }
            setFavProducts(arrayFav)
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(isLoading){
            getFavorites()
        }
    }, [isLoading])

    return (
        <>
            <Container>
                <Row>
                    { favProducts.map(product =>
                        <Col key={product._id}>
                            <CardC cardId={'favPage'} productId={product._id} productName={product.name} productPrice={product.price}
                            mainImage={product.mainPicture} setIsLoadingHook={setIsLoading} getFavoritesFunction={getFavorites}/>
                        </Col>
                    )
                    }
                </Row>
            </Container>
        </>
    )
}

export default UserFavoritePage