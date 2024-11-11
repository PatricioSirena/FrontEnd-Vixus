import { Col, Container, Row } from "react-bootstrap"

const FooterC = () => {
    return (
        <>
        <Container fluid className="mt-5 py-5 text-center bg-body-tertiary">
            <Row className="d-flex">
                <Col sm={12} md={4}>
                    <p>Logo Vixus</p>
                </Col>
                <Col sm={12} md={8}>
                    <ul>
                        <li>Whatsapp</li>
                        <li>Instagram</li>
                        <li>Mail</li>
                    </ul>
                </Col>
            </Row>
        </Container>
        </>
    )
}

export default FooterC