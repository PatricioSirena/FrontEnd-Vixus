import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../components/ExampleCarouselImage'
import PropTypes from 'prop-types'


const Carrousel = ({idPage, productImages}) => {

    const images = [
        {id: 1, src: 'https://elonce-media.elonce.com/fotos-nuevo/2022/10/05/o_1664998193.jpg'},
        {id:2, src: 'https://www.somosmamas.com.ar/wp-content/uploads/2020/07/Ropa-de-moda-para-hombre.jpg'},
        {id:3, src: 'https://sinapsismx.com/wp-content/uploads/2020/02/Moda1.png'}
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
        <Carousel fade>
        {productImages?.map(image => (
            <Carousel.Item key={image.imageId}>
                <ExampleCarouselImage src={image.url} />
            </Carousel.Item>
        ))}
    </Carousel>
        }  
        </>
    )
}

Carrousel.propTypes = {
    idPage: PropTypes.string,
    productImages: PropTypes.array
}

export default Carrousel