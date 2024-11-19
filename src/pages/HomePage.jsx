import { Col, Container, Row } from "react-bootstrap"
import CardC from "../components/CardC"
import Carrousel from "../components/Carrousel"

const HomePage = () => {

    const infoCards = [
        { id: 1, link: 'https://res.cloudinary.com/dkp3sew2y/image/upload/fl_preserve_transparency/v1731333269/Descuento_gmyhiq.jpg?_s=public-apps', text: '30% de descuento pagando de contado' },
        { id: 2, link: 'https://res.cloudinary.com/dkp3sew2y/image/upload/fl_preserve_transparency/v1731333269/Cuotas_lohwxj.jpg?_s=public-apps', text: '3 cuotas sin interes con todas las tarjetas' }
    ]

    return (
        <>
            <Carrousel />
            <Container className="information my-5" >
                <Row >
                    {infoCards.map((infoCard) => 
                        <Col sm={12} md={6} className="d-flex justify-content-center" key={infoCard.id}>
                            <CardC imgLink={infoCard.link} id={'cardInfo'} infoCardtext={infoCard.text} />
                        </Col>
                    )}
                </Row>
            </Container>
            <CardC id={'cardLinks'} />
            <CardC />
        </>
    )
}

export default HomePage