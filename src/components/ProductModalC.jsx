import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button, Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductModalC = ({ idModal, show, showNew, handleClickCancelProductUpdate, productInfo, handleChageProductInfo, errorMessage, sizeOptions, handleChangeNewImage, productImages, handleClickDelImgFromProduct, handleClickUpdateProduct, handleClickSaveProduct, saveProduct}) => {
    return (
        <>
            <Modal show={idModal === 'editProduct' ? show : showNew} onHide={()=>handleClickCancelProductUpdate(idModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name='name'
                                value={productInfo?.name || ''}
                                onChange={(ev) => handleChageProductInfo(ev)}
                                isInvalid={!!errorMessage?.name} />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.name}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPrice">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="text"
                                name='price'
                                value={productInfo?.price || ''}
                                onChange={(ev) => handleChageProductInfo(ev)}
                                isInvalid={!!errorMessage?.price} />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.price}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicDescription">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name='description'
                                value={productInfo?.description || ''}
                                onChange={(ev) => handleChageProductInfo(ev)}
                                isInvalid={!!errorMessage?.description} />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicColor">
                            <Form.Label>Color</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='color' 
                            value={productInfo?.color || ''} 
                            onChange={(ev) => handleChageProductInfo(ev)} 
                            isInvalid={!!errorMessage?.color}/>
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.color}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSize">
                            <Form.Label>Talle</Form.Label>
                            <Form.Select type="text" name='size' value={productInfo?.size} onChange={(ev) => handleChageProductInfo(ev)}>
                                {sizeOptions.map(size =>
                                    <option key={size.value} value={size.value}>{size.label}</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicStock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='quantity' 
                            value={productInfo?.quantity || ''} 
                            onChange={(ev) => handleChageProductInfo(ev)} 
                            isInvalid={!!errorMessage?.quantity}/>
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.quantity}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control type="file" onChange={(ev) => handleChangeNewImage(ev.target.files[0])} />
                        </Form.Group>

                        <Container>
                            <Row>
                                {
                                    productImages.map(image =>
                                        <Col key={image.imageId}>
                                            <Button onClick={() => handleClickDelImgFromProduct(image.imageId)}>X</Button>
                                            <img src={image.url} alt="" />
                                        </Col>
                                    )
                                }
                            </Row>
                        </Container>
                                
                        <Button 
                        variant="primary" 
                        type="submit" 
                        onClick={idModal === 'editProduct' ? handleClickUpdateProduct : handleClickSaveProduct}
                        disabled={saveProduct ? false: true}>
                            {idModal === 'editProduct' ? 'Actualizar Producto' : 'Guardar'}
                        </Button>
                        <p style={{margin: '1em 0 .5em 0', color: '#dc3545'}}>{errorMessage.save}</p>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

ProductModalC.propTypes = {
    idModal: PropTypes.string,
    show: PropTypes.bool,
    showNew: PropTypes.bool,
    handleClickCancelProductUpdate: PropTypes.func,
    productInfo: PropTypes.object,
    handleChageProductInfo: PropTypes.func,
    errorMessage: PropTypes.object,
    sizeOptions: PropTypes.array,
    handleChangeNewImage: PropTypes.func,
    productImages: PropTypes.array,
    handleClickDelImgFromProduct: PropTypes.func,
    handleClickUpdateProduct: PropTypes.func,
    handleClickSaveProduct: PropTypes.func,
    saveProduct: PropTypes.bool
}

export default ProductModalC