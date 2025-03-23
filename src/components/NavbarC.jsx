import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import clienteAxios from '../helpers/axios';

const NavbarC = () => {
    const [showCategory, setShowCategory] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [toSearch, setToSearch] = useState('');
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState('true')
    const navigate = useNavigate();
    const token = JSON.parse(sessionStorage.getItem('token'));
    const role = JSON.parse(sessionStorage.getItem('role'));


    const handleClickLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userId');
        setShowMenu(false);
        navigate('/');
    };

    const handleChangeSearchKeyWord = (ev) => {
        setToSearch(ev.target.value);
    };

    const handleClickSearch = () => {
        if (toSearch) {
            navigate(`/searchPage/${toSearch}`);
            setToSearch('');
        }
    };

    const handleClickCategoryPage = (ev, category) => {
        ev.preventDefault()
        navigate(`/categoryPage/${category}`);
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const result = await clienteAxios.get('/products/getCategories')
                const categoriesToUpperCase = result.data.map(category => {
                    return { id: category._id, name: category.name.charAt(0).toUpperCase() + category.name.slice(1) }
                })
                setCategories(categoriesToUpperCase)
                setIsLoading(false)
            } catch (error) {
                console.log(error);
            }
        }
        if (isLoading) {
            getCategories()
        }
    },)


    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <NavLink to="/" className={'nav-link fs-4'}>Logo</NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/" className={'nav-link'}>Inicio</NavLink>
                            <Dropdown onMouseEnter={() => setShowCategory(true)} onMouseLeave={() => setShowCategory(false)} show={showCategory}>
                                <Dropdown.Toggle
                                    className="text-decoration-none"
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                        color: 'inherit',
                                        padding: '0',
                                        outline: 'none',
                                    }}
                                >
                                    Categorías
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {
                                        categories.map((category) => (
                                            <Dropdown.Item as={Link} key={category.id} onClick={(ev) => handleClickCategoryPage(ev, category.name)} style={{ textDecoration: 'none', color: 'black' }}>
                                                {category.name}
                                            </Dropdown.Item>
                                        )
                                        )}
                                </Dropdown.Menu>
                            </Dropdown>
                            <NavLink to="*" className={'nav-link'}>Contacto</NavLink>
                        </Nav>
                        <Form className="ms-auto">
                            <Form.Group style={{ display: 'flex', justifyContent: 'end', margin: '0 .5em' }} controlId='formBasicSearch'>
                                <Form.Control type='text' placeholder='Buscar' value={toSearch} name='keyWord' onChange={handleChangeSearchKeyWord} />
                                <Button style={{ width: '3em' }} onClick={handleClickSearch}>
                                    <i className='fa fa-search'></i>
                                </Button>
                            </Form.Group>
                        </Form>
                        {
                            !token ?
                                <>
                                    <Nav>
                                        <NavLink to="/login" className={'nav-link'}>Iniciar Sesion</NavLink>
                                        <NavLink to="/register" className={'nav-link'}>Registro</NavLink>
                                    </Nav>
                                </>
                                :
                                <>
                                    <Dropdown className='dropstart' onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)} show={showMenu}>
                                        <Dropdown.Toggle title={role === 'mainAdmin' ? 'Super' : role === 'admin' ? 'Admin' : 'User '}>
                                            {role === 'mainAdmin' ? 'Super' : role === 'admin' ? 'Admin' : 'Usuario'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item as={NavLink} to={role === 'mainAdmin' ? '/adminProducts' : role === 'admin' ? '/adminProducts' : '/userCart'}>{role === 'mainAdmin' ? 'Panel de productos' : role === 'admin' ? 'Panel de productos' : 'Carrito'}</Dropdown.Item>
                                            <Dropdown.Item as={NavLink} to={role === 'mainAdmin' ? '/adminUsers' : role === 'admin' ? '/adminUsers' : '/userFavorites'}>{role === 'mainAdmin' ? 'Panel de usuarios' : role === 'admin' ? 'Panel de usuarios' : 'Favoritos'}</Dropdown.Item>
                                            {
                                                role === 'user' ?
                                                <Dropdown.Item as={NavLink} to='/userOrders'>Mis Compras</Dropdown.Item>
                                            :
                                            <Dropdown.Item as={NavLink} to="/adminCategory">Categorias</Dropdown.Item>   
                                            }
                                            <Dropdown.Item className='btn btn-light' as="a" onClick={handleClickLogout}>Salir</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavbarC;