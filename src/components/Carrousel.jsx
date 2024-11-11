import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../components/ExampleCarouselImage'

const Carrousel = () => {

    const images = [
        {id: 1, src: 'https://elonce-media.elonce.com/fotos-nuevo/2022/10/05/o_1664998193.jpg'},
        {id:2, src: 'https://www.somosmamas.com.ar/wp-content/uploads/2020/07/Ropa-de-moda-para-hombre.jpg'},
        {id:3, src: 'https://sinapsismx.com/wp-content/uploads/2020/02/Moda1.png'}
    ]
    return (
        <>
            <Carousel fade>
            {images.map((image, index) => (
                <Carousel.Item key={index}>
                    <ExampleCarouselImage src={image.src} />
                </Carousel.Item>
            ))}
        </Carousel>
        </>
    )
}

export default Carrousel