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
                const productresult = await clienteAxios.get(`/products/${item.idProduct}`, configHeaders)
                const product = productresult.data
                const firstVariantImage = product.variants.find((v) => v._id === item.variantId).galery[0].imageUrl
                product.mainPicture = firstVariantImage
                product.favoriteVariantId = item.variantId
                arrayFav.push(product)
            }
            setFavProducts(arrayFav)
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isLoading) {
            getFavorites()
        }
    }, [isLoading])

    return (
        <>
            <Container>
                <Row>
                    {favProducts.map(product =>
                        <Col key={product.favoriteVariantId}>
                            <CardC cardId={'favoriteCard'} productId={product._id} faVariantId={product.favoriteVariantId} productName={product.name} productPrice={product.price}
                                mainImage={product.mainPicture} setIsLoadingHook={setIsLoading} />
                        </Col>
                    )
                    }
                </Row>
            </Container>
        </>
    )
}

export default UserFavoritePage