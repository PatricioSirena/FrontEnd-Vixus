import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types'


const FormC = ({ idPage }) => {
    return (
        <>
        <div className="d-flex justify-content-center align-items-center">
            <Form className='mt-5 px-5 w-50'>
                {
                    idPage === 'register' &&
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" placeholder="Nombre" />
                    </Form.Group>
                }
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="Contraseña" />
                </Form.Group>
                {
                    idPage === 'register' &&
                    <>
                        <Form.Group className="mb-3" controlId="formBasicRepPassword">
                            <Form.Label>Repetir Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Repetir Contraseña" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control type="number" placeholder="Telefono" />
                        </Form.Group>
                        <Form.Text className="text-muted">
                            Nunca compartiremos tu información personal
                        </Form.Text>
                        <br />
                    </>
                }
                    
                <Button className='mt-3' variant={idPage === 'login' ? "primary" : "success"} type="submit">
                { idPage === 'login'?
                    'Ingresar' 
                    :
                    'Registrarme'
                }
                </Button>
            </Form>
        </div>
        </>
    )
}

FormC.propTypes ={
    idPage: PropTypes.string
}

export default FormC