import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../components/ExampleCarouselImage'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap';


const Carrousel = ({ idPage, productImages, deleteImageFunction }) => {

    const images = [
        { id: 1, src: 'https://elonce-media.elonce.com/fotos-nuevo/2022/10/05/o_1664998193.jpg' },
        { id: 2, src: 'https://www.somosmamas.com.ar/wp-content/uploads/2020/07/Ropa-de-moda-para-hombre.jpg' },
        { id: 3, src: 'https://sinapsismx.com/wp-content/uploads/2020/02/Moda1.png' }
    ]
    return (
        <>
            {
                idPage === 'homePage' ?
                    <Carousel fade>
                        {images.map(image => (
                            <Carousel.Item key={image.id}>
                                <ExampleCarouselImage src={image.src} />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                    :
                    <Carousel data-bs-theme="dark" interval={null} pause={false} keyboard={false} touch={false}>
                        {productImages?.map((image, index) => (
                            <Carousel.Item key={index} style={idPage === 'adminProductPage' ? { width: '30em', height: '30em', position: 'relative' } : {}}>
                                <Button style={{
                                    position: 'absolute',
                                    top: '.2em',
                                    right: '2.5em',
                                    zIndex: 1,
                                    backgroundColor: 'transparent',
                                    color: 'grey',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.8em'
                                }} 
                                onClick={()=> deleteImageFunction(image)}>x</Button>
                                <ExampleCarouselImage src={image} />
                            </Carousel.Item>
                        ))}
                    </Carousel>
            }
        </>
    )
}

Carrousel.propTypes = {
    idPage: PropTypes.string,
    productImages: PropTypes.array,
    deleteImageFunction: PropTypes.func
}

export default Carrousel