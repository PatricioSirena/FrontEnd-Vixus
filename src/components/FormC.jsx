import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../helpers/axios';


const FormC = ({ idPage }) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({})

    const handleChangeForm = (ev) => {
        setFormData({ ...formData, [ev.target.name]: ev.target.value })
    }

    const handleClickRegister = async (ev) => {
        ev.preventDefault()
        const { fullName, email, password, passwordControl, phone } = formData
        if (!fullName || !email || !password || !passwordControl || !phone) {
            return alert('Debe completar todos los campos')
        }
        if (password !== passwordControl) {
            return alert('Las contraseñas no son iguales')
        }
        try {
            await clienteAxios.post('/users', { fullName, email, password, phone})
            alert('Usuario registrado, redirigeindo a login')
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
        if(!email || !password){
            return alert('Debe completar los campos')
        }
        try {
            const result = await  clienteAxios.post('/users/login', { email, password })
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
                            <Form.Control type="text" placeholder="Nombre" name='fullName' onChange={handleChangeForm} />
                        </Form.Group>
                    }
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" name='email' onChange={handleChangeForm} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Contraseña" name='password' onChange={handleChangeForm} />
                    </Form.Group>
                    {
                        idPage === 'register' &&
                        <>
                            <Form.Group className="mb-3" controlId="formBasicRepPassword">
                                <Form.Label>Repetir Contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Repetir Contraseña" name='passwordControl' onChange={handleChangeForm} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPhone">
                                <Form.Label>Telefono</Form.Label>
                                <Form.Control type="number" placeholder="Telefono" name='phone' onChange={handleChangeForm} />
                            </Form.Group>
                            <Form.Text className="text-muted">
                                Nunca compartiremos tu información personal
                            </Form.Text>
                            <br />
                        </>
                    }

                    <Button className='mt-3' variant={idPage === 'login' ? "primary" : "success"} type="submit" onClick={idPage === 'login' ? handleClickLogin : handleClickRegister}>
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