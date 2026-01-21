import { useEffect, useState } from "react"
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap"
import PropTypes from 'prop-types'
import '../styles/GaleryCStyle.css'

const GaleryC = ({ idPage,  galery, productId, deleteImageFunction, selectMainImage, mainPicture }) => {
    const [imgToShow, setImgToShow] = useState('')

    const handleClickSelectImage = (idImage) => {
        try {
            const image = galery.find(image => image._id === idImage).imageUrl
            if (!image) alert('Imagen no encontrada')
            setImgToShow(image)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (galery !== undefined && !galery.some(image => image.imageUrl === imgToShow)) {
            setImgToShow(galery[0]?.imageUrl || '')
        }
    }, [galery, imgToShow, productId])

    return (
        <Container>
            {
                galery?.length > 0 ?
                    <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Col sm={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', height: '25em' }}>
                            {
                                galery?.map(image => (
                                    <Button key={image._id} onClick={() => handleClickSelectImage(image._id)} style={{ width: '4.2em', height: '4.2em', marginBottom: '1em', padding: '0', backgroundColor: 'transparent', border: 'none', position: 'relative' }}>
                                        <img src={image.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        {image.imageUrl === mainPicture && (
                                            <i className="bi bi-star-fill" style={idPage === 'productPage' ? {display: 'none'} : { position: 'absolute', top: '.1em', left: '.5em', color: 'gold', fontSize: '0.7em', zIndex: 1 }}></i>
                                        )}
                                    </Button>
                                ))
                            }
                        </Col>
                        <Col sm={10} style={{ width: '22em', height: '25em', position: 'relative' }}>
                            <Dropdown style={ idPage === 'productPage' ? {display: 'none'} : {}}>
                                <Dropdown.Toggle
                                    as={'button'}
                                    // variant="link"
                                    id="dropdown-basic"
                                    className="deleteImageButton"
                                >
                                    <i className="bi bi-three-dots-vertical" style={{ fontSize: '1.5rem' }}></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={'button'} onClick={() => deleteImageFunction(imgToShow)}>Eliminar</Dropdown.Item>
                                    <Dropdown.Item as={'button'} onClick={() => selectMainImage(productId, imgToShow)}>Foto de portada</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <img src={imgToShow} alt="Imagen de producto no disponible"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', boxShadow: '1px 1px 20px grey', borderRadius: '5px' }} />
                        </Col>
                    </Row>
                    :
                    <div style={{ display: 'flex', justifyContent: 'center', height: '25em', alignItems: 'center' }}>
                        <p>No hay imágenes en la galería.</p>
                    </div>
            }
        </Container>
    )
}

GaleryC.propTypes = {
    idPage: PropTypes.string,
    galery: PropTypes.array,
    productId: PropTypes.string,
    deleteImageFunction: PropTypes.func,
    selectMainImage: PropTypes.func,
    mainPicture: PropTypes.string
}

export default GaleryC
