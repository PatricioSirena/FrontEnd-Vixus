import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'


const CardC = ({ id, imgLink, infoCardtext, productId }) => {
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
                            <Card.Img variant="top" src={imgLink} />
                            <Card.Body style={{textAlign: 'center'}}>
                                <Card.Text>{infoCardtext}</Card.Text>
                            </Card.Body>
                        </Card>
                        :
                        <Card style={{ width: '11rem', border: 'none', margin: '2rem'}}>
                            <Card.Img
                                variant="top"
                                src="https://acdn.mitiendanube.com/stores/002/026/642/products/dsc080551-2b9248b262b394707516852011784935-640-0.jpg"
                                className="card-img"
                                style={{borderRadius: '0'}}
                                />
                            <Card.Body style={{padding: '.5rem'}}>
                                <Card.Title>Card Title</Card.Title>
                                <Card.Text style={{margin: '.5rem'}}>
                                    Text
                                </Card.Text>
                                <Link to={`/product/${productId}`} className='btn btn-dark' style={{marginBottom: '.5rem', fontSize: 'x-small'}} variant="primary">Ver Producto</Link>
                            </Card.Body>
                        </Card>
            }
        </>
    )
}

CardC.propTypes = {
    id: PropTypes.string,
    imgLink: PropTypes.string,
    infoCardtext: PropTypes.string,
    productId: PropTypes.string
}

export default CardC