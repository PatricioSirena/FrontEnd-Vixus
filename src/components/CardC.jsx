import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import clienteAxios, { configHeaders } from '../helpers/axios';


const CardC = ({ cardId, imgLink, infoCardtext, productId, productName, productPrice, mainImage, setIsLoadingHook, getFavoritesFunction, productStock }) => {
    
    const handleClickDelFromFav = async () =>{
            try {
                const result = await clienteAxios.post(`/products/delFromFavorite/${productId}`, {}, configHeaders)
                alert(result.data.msg);
                setIsLoadingHook(true)
                getFavoritesFunction()
            } catch (error) {
                alert(error.response.data.msg)
            }
    }
    
    return (
        <>
            {
                cardId === 'cardLinks' ?
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
                    : cardId === 'cardInfo' ?
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={imgLink} />
                            <Card.Body style={{textAlign: 'center'}}>
                                <Card.Text>{infoCardtext}</Card.Text>
                            </Card.Body>
                        </Card>
                        :
                        <Card style={{ width: '11rem', margin: '2rem'}}>
                            <Card.Img
                                title={productName}
                                variant="top"
                                src={mainImage}
                                className="card-img"
                                style={{border: 'none', height:'200px'}}
                                />
                            <Card.Body style={{padding: '.5rem'}}>
                                <Card.Title title={productName} style={{fontSize: 'medium', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{productName}</Card.Title>
                                <Card.Text style={{margin: '.5rem'}}>
                                    {productPrice}
                                {
                                    productStock <= 0  &&
                                    <span style={{fontSize: 'x-small', marginLeft: '3em'}}>Sin stock</span>
                                }
                                </Card.Text>
                                <div className="cardButtons mb-2 mx-1" style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Link to={`/product/${productId}`} className='btn btn-dark' style={{fontSize: 'x-small', padding: '6px'}} variant="primary">Ver Producto</Link>
                                {
                                    cardId === 'favPage' &&
                                    <Button style={{fontSize: 'x-small', padding: '6px'}} onClick={()=> handleClickDelFromFav(productId)}>Borrar Fav</Button>
                                }
                                </div>
                            </Card.Body>
                        </Card>
            }
        </>
    )
}

CardC.propTypes = {
    cardId: PropTypes.string,
    imgLink: PropTypes.string,
    infoCardtext: PropTypes.string,
    productId: PropTypes.string,
    productName: PropTypes.string,
    productPrice: PropTypes.number,
    mainImage: PropTypes.string,
    setIsLoadingHook: PropTypes.func,
    getFavoritesFunction: PropTypes.func,
    productStock: PropTypes.number
}

export default CardC