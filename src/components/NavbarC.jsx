import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom'
import DropdownButton from 'react-bootstrap/DropdownButton';


const NavbarC = () => {
    const navigate = useNavigate()
    const token = JSON.parse(sessionStorage.getItem('token'))
    const role = JSON.parse(sessionStorage.getItem('role'))

    const handleClickLogout = (e) => {
        e.preventDefault()
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('role')
        sessionStorage.removeItem('userId')
        navigate('/')
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <NavLink to="/" className={'nav-link fs-4'}>Logo</NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/" className={'nav-link'}>Inicio</NavLink>
                            <NavLink to="*" className={'nav-link'}>Sobre Nosotros</NavLink>
                            <NavLink to="*" className={'nav-link'}>Contacto</NavLink>
                        </Nav>
                        {
                            !token &&
                            <>
                                <Nav className="ms-auto">
                                    <NavLink to="/login" className={'nav-link'}>Iniciar Sesion</NavLink>
                                    <NavLink to="/register" className={'nav-link'}>Registro</NavLink>
                                </Nav>
                            </>
                        }
                        {role === 'admin' &&
                            <>
                                <DropdownButton title="Admin">
                                    <NavLink to="/adminProducts" className={'btn btn-light'}>Panel de Productos</NavLink>
                                    <NavLink to="/adminUsers" className={'btn btn-light'}>Panel de Usuarios</NavLink>
                                    <NavLink to='#' onClick={handleClickLogout} className={'btn btn-light'}>Salir</NavLink>
                                </DropdownButton>

                            </>
                        }
                        {role === 'user' &&
                            <>
                                <DropdownButton title="User">
                                    <NavLink to="/userCart" className={'btn btn-light'}>Carrito</NavLink>
                                    <NavLink to="/userFav" className={'btn btn-light'}>Favoritos</NavLink>
                                    <NavLink to='#' onClick={handleClickLogout} className={'btn btn-light'}>Salir</NavLink>
                                </DropdownButton>
                            </>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarC