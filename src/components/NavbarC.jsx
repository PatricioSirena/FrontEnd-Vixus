import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {  NavLink, useNavigate } from 'react-router-dom'
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';


const NavbarC = () => {
    const [toSearch, setToSearch] = useState('')
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

    const handleChangeSearchKeyWord = (ev) =>{
        setToSearch(ev.target.value)        
    }

    const handleClickSearch = () =>{
        if(toSearch){
            navigate(`/products/${toSearch}`)
            setToSearch('')
        }
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
                        <Form>
                            <Form.Group style={{display: 'flex', margin: '0 1em'}}>
                                <Form.Control type='text' placeholder='Buscar' value={toSearch} name='keyWord' onChange={handleChangeSearchKeyWord}/>
                                <Button onClick={handleClickSearch}>Buscar</Button>
                            </Form.Group>
                        </Form>
                        {
                            !token ?
                                <>
                                    <Nav className="ms-auto">
                                        <NavLink to="/login" className={'nav-link'}>Iniciar Sesion</NavLink>
                                        <NavLink to="/register" className={'nav-link'}>Registro</NavLink>
                                    </Nav>
                                </>
                                :
                                <>
                                    <DropdownButton drop='start' title={role === 'mainAdmin' ? 'Super' : role === 'admin' ? 'Admin' : 'User'}>
                                        <NavLink
                                            style={{ display: 'block' }}
                                            to={role === 'mainAdmin' ? '/adminProducts' : role === 'admin' ? '/adminProducts' : '/userCart'}
                                            className={`btn btn-light`}>
                                            {role === 'mainAdmin' ? 'Panel de Productos' : role === 'admin' ? 'Panel de Productos' :'Carrito'}
                                        </NavLink>
                                        <NavLink
                                            style={{ display: 'block' }}
                                            to={role === 'mainAdmin' ? '/adminUsers' : role === 'admin' ? '/adminUsers' : 'userFavorites'}
                                            className={`btn btn-light`}>
                                            {role === 'mainAdmin' ? 'Panel de Usuarios' : role === 'admin' ? 'Panel de Usuarios' : 'Favoritos'}
                                        </NavLink>
                                        <a
                                            style={{ display: 'block' }}
                                            to='#'
                                            onClick={handleClickLogout}
                                            className={'btn btn-light'}>
                                            Salir
                                        </a>
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