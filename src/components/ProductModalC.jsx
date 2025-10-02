import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ProductModalC = ({ idModal, showEdit, showNew, handleClickCancelProductUpdate, productInfo, handleChangeProductInfo, errorMessage, handleClickSaveOrUpdateProduct, saveProduct }) => {
    return (
        <>
            <Modal show={idModal === 'editProduct' ? showEdit : showNew} style={{ opacity: '0.2 !important' }}>
                <Modal.Header style={{ position: 'relative' }}>
                    <Modal.Title
                        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        {idModal === 'newProduct' ? 'Nuevo Producto' : `Producto: ${productInfo.name}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name='name'
                                value={productInfo?.name || ''}
                                onChange={(ev) => handleChangeProductInfo(ev)}
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
                                onChange={(ev) => handleChangeProductInfo(ev)}
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
                                onChange={(ev) => handleChangeProductInfo(ev)}
                                isInvalid={!!errorMessage?.description} />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.description}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            onClick={(ev) => handleClickSaveOrUpdateProduct(ev, idModal)}
                            disabled={saveProduct ? false : true}>
                            {idModal === 'editProduct' ? 'Actualizar Producto' : 'Guardar'}
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={(ev) => handleClickCancelProductUpdate(ev, idModal)}
                            style={{ marginLeft: '1em' }}>
                            Cancelar
                        </Button>
                        <p style={{ margin: '1em 0 .5em 0', color: '#dc3545' }}>{errorMessage.save}</p>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

ProductModalC.propTypes = {
    idModal: PropTypes.string,
    showEdit: PropTypes.bool,
    showNew: PropTypes.bool,
    handleClickCancelProductUpdate: PropTypes.func,
    productInfo: PropTypes.object,
    handleChangeProductInfo: PropTypes.func,
    errorMessage: PropTypes.object,
    handleClickSaveOrUpdateProduct: PropTypes.func,
    saveProduct: PropTypes.bool
}

export default ProductModalC