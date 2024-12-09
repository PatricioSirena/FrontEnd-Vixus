import { Col, Container, Row } from "react-bootstrap"
import CardC from "../components/CardC"
import Carrousel from "../components/Carrousel"
import { useEffect, useState } from "react"
import clienteAxios from "../helpers/axios"

const HomePage = () => {
    const [latestProducts, setLatestProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getLatestProducts = async () => {
        const result = await clienteAxios.get('/products/getUltimateProducts')
        setLatestProducts(result.data);
        setIsLoading(false)
    }


    const infoCards = [
        {
            id: 1, link: 'https://res.cloudinary.com/dkp3sew2y/image/upload/fl_preserve_transparency/v1731333269/Descuento_gmyhiq.jpg?_s=public-apps',
            text: '30% de descuento pagando de contado'
        },
        {
            id: 2, link: 'https://res.cloudinary.com/dkp3sew2y/image/upload/fl_preserve_transparency/v1731333269/Cuotas_lohwxj.jpg?_s=public-apps',
            text: '3 cuotas sin interes con todas las tarjetas'
        }
    ]

    useEffect(() => {
        if (isLoading) {
            getLatestProducts()
        }
    }, [isLoading])


    return (
        <>
            <Carrousel idPage={'homePage'} />
            <Container className="information my-5" >
                <Row >
                    {infoCards.map((infoCard) =>
                        <Col sm={12} md={6} className="d-flex justify-content-center" key={infoCard.id}>
                            <CardC imgLink={infoCard.link} cardId={'cardInfo'} infoCardtext={infoCard.text} />
                        </Col>
                    )}
                </Row>
            </Container>
            <CardC cardId={'cardLinks'} />
            <Container>
                <Row>
                    {
                        latestProducts.map(product =>
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

export default HomePage