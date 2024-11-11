import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'


const CardC = ({ id }) => {
    return (
        <>
            {
                id === 'cardLinks' ?
                    <Card style={{ width: '20rem', height: '30rem' }}>
                        <Link to={'/login'} style={{ textDecoration: 'none' }}>
                            <Card.Img
                                src="https://acdn.mitiendanube.com/stores/002/026/642/products/dsc080551-2b9248b262b394707516852011784935-640-0.jpg"
                                className="card-img"
                                style={{ height: 'auto', objectFit: 'cover' }}
                            />
                            <Card.ImgOverlay style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Card.Title style={{ color: 'white' }}>Chinos</Card.Title>
                                <Button style={{ display: 'none' }} variant="light">Go somewhere</Button>
                            </Card.ImgOverlay>
                        </Link>
                    </Card>
                    : id === 'cardInfo' ?
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src="https://www.macowens.com.ar/media/wysiwyg/banner_3_cuotas_landing_promociones_1.jpg" />
                            <Card.Body style={{textAlign: 'center'}}>
                                <Card.Title>Cuotas sin interes</Card.Title>
                                <Card.Text>
                                    3 Cuotas sin interes con todas las tarjetas
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        :
                        <Card style={{ width: '13rem' }}>
                            <Card.Img
                                variant="top"
                                src="https://acdn.mitiendanube.com/stores/002/026/642/products/dsc080551-2b9248b262b394707516852011784935-640-0.jpg"
                                className="card-img"
                                style={{ padding: '.8rem' }} />
                            <Card.Body>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text>
                                    Text
                                </Card.Text>
                                <Link variant="primary">Ver Producto</Link>
                            </Card.Body>
                        </Card>
            }
        </>
    )
}

CardC.propTypes = {
    id: PropTypes.string
}

export default CardC