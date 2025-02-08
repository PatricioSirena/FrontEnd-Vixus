import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../helpers/axios';


const FormC = ({ idPage }) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({})
    const [errorMessage, setErrorMessage] = useState({
        fullName: '',
        email: '',
        password: '',
        passwordControl: '',
        phone: ''
    })
    const [saveUser, setSaveUser] = useState(true)

    const handleChangeForm = (ev) => {
        const { name, value } = ev.target
        let newErrorMessage = { ...errorMessage };
        if (name === 'fullName') {
            if (value.length < 4 || value.length > 50) {
                newErrorMessage.fullName = 'El nombre debe tener entre 4 y 50 caracteres'
            } else{
                newErrorMessage.fullName = ''
            }
        }
        if (name === 'email') {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
                newErrorMessage.email = 'Email invalido'
            } else{
                newErrorMessage.email = ''
            }
        }
        if (name === 'password') {
            if (value.length < 8 || value.length > 20) {
                newErrorMessage.password = 'La contraseña debe tener entre 8 y 20 caracteres'
            } else{
                newErrorMessage.password = ''
            }
        }
        if (name === 'passwordControl') {
            if (value !== formData.password) {
                newErrorMessage.passwordControl = 'Las contraseñas no coinciden'
            }  else{
                newErrorMessage.passwordControl = ''
            }
        }
        if (name === 'phone') {
            if (value === '') {
                newErrorMessage.phone = 'Debe ingresar un telefono'
            }  else{
                newErrorMessage.phone = ''
            }
        }
        setErrorMessage(newErrorMessage)
        setFormData(prevState => ({ ...prevState, [name]: value }))
        const hasErrors = Object.values(newErrorMessage).some(error => error !== '');
        setSaveUser(!hasErrors);
    }

    const handleClickRegister = async (ev) => {
        ev.preventDefault()
        const { fullName, email, password, phone } = formData
        // if (!fullName || !email || !password || !passwordControl || !phone) {
        //     return alert('Debe completar todos los campos')
        // }
        // if (password !== passwordControl) {
        //     return alert('Las contraseñas no son iguales')
        // }
        try {
            const result = await clienteAxios.post('/users', { fullName, email, password, phone })
            alert(result.data.msg)
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const handleClickLogin = async (ev) => {
        ev.preventDefault()
        const { email, password } = formData
        // if (!email || !password) {
        //     return alert('Debe completar los campos')
        // }
        try {
            const result = await clienteAxios.post('/users/login', { email, password })
            sessionStorage.setItem('userId', JSON.stringify(result.data.id))
            sessionStorage.setItem('role', JSON.stringify(result.data.role))
            sessionStorage.setItem('token', JSON.stringify(result.data.token))
            alert('Usuario logueado, redirigeindo al inicio')
            setTimeout(() => {
                navigate('/')
            }, 1000);
        } catch (error) {
            alert(error.response.data.msg)
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center">
                <Form className='mt-5 px-5 w-50'>
                    {
                        idPage === 'register' &&
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nombre Completo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre"
                                name='fullName'
                                onChange={handleChangeForm}
                                isInvalid={!!errorMessage?.fullName} />
                            <Form.Control.Feedback type="invalid">
                                {errorMessage?.fullName}
                            </Form.Control.Feedback>
                        </Form.Group>
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name='email'
                            onChange={handleChangeForm}
                            isInvalid={!!errorMessage?.email} />
                        <Form.Control.Feedback type="invalid">
                            {errorMessage?.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Contraseña"
                            name='password'
                            onChange={handleChangeForm}
                            isInvalid={!!errorMessage?.password} />
                        <Form.Control.Feedback type="invalid">
                            {errorMessage?.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {
                        idPage === 'register' &&
                        <>
                            <Form.Group className="mb-3" controlId="formBasicRepPassword">
                                <Form.Label>Repetir Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repetir Contraseña"
                                    name='passwordControl'
                                    onChange={handleChangeForm}
                                    isInvalid={!!errorMessage?.passwordControl} />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessage?.passwordControl}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPhone">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Telefono (Para poder comunicarnos con vos)"
                                    name='phone'
                                    onChange={handleChangeForm}
                                    isInvalid={!!errorMessage?.phone} />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessage?.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Text className="text-muted">
                                Nunca compartiremos tu información personal
                            </Form.Text>
                            <br />
                        </>
                    }

                    <Button
                        className='mt-3'
                        variant={idPage === 'login' ? "primary" : "success"}
                        type="submit"
                        onClick={idPage === 'login' ? handleClickLogin : handleClickRegister}
                        disabled={saveUser ? false : true}>
                        {idPage === 'login' ?
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

FormC.propTypes = {
    idPage: PropTypes.string
}

export default FormC