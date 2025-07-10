import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import PropTypes from 'prop-types'

const GaleryC = ({ galery, deleteImageFunction }) => {
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
        if(!galery.some(image => image.imageUrl === imgToShow)) {
            setImgToShow(galery[0]?.imageUrl || '')
        }
    }, [galery, imgToShow])

    return (
        <Container>
            {
                galery.length > 0 ?
                    <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Col sm={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', height: '25em' }}>
                            {
                                galery?.map(image => (
                                    <Button key={image._id} onClick={() => handleClickSelectImage(image._id)} style={{ width: '3em', height: '3em', marginBottom: '1em', padding: '0', backgroundColor: 'transparent', border: 'none' }}>
                                        <img src={image.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </Button>
                                ))
                            }
                        </Col>
                        <Col sm={10} style={{ width: '25em', height: '25em', position: 'relative' }}>
                            <Button
                                style={{
                                    position: 'absolute',
                                    top: '.2em',
                                    right: '1em',
                                    zIndex: 1,
                                    backgroundColor: 'transparent',
                                    color: 'grey',
                                    border: 'none',
                                    width: '30px',
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.8em'
                                }}
                                onClick={() => deleteImageFunction(imgToShow)}>x</Button>
                            <img src={imgToShow} alt="Imagen de producto no disponible" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
    galery: PropTypes.array,
    deleteImageFunction: PropTypes.func
}

export default GaleryC
