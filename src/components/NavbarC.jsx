import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown, InputGroup } from 'react-bootstrap';
import { Button, Form, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import clienteAxios, { configHeaders } from '../helpers/axios';

const NavbarC = () => {
    const [showCategory, setShowCategory] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [toSearch, setToSearch] = useState('');
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState('true')
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [categoryName, setCategoryName] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();
    const token = JSON.parse(sessionStorage.getItem('token'));
    const role = JSON.parse(sessionStorage.getItem('role'));

    const handleCloseCategoryModal = () => setShowNewCategory(false);
    const handleShowCategoryModal = () => setShowNewCategory(true);


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
        if (category === undefined) {
            navigate('/allProductsPage')
        } else {
            navigate(`/categoryPage/${category}`);
        }
    }

    const handleChangeCategoryName = (ev) => {
        const name = ev.target.value
        if (name.length < 4 || name.length > 30) return setErrorMessage('El nombre de la categoria debe tener entre 4 y 30 caracteres')
            setErrorMessage('')
            setCategoryName(name)
    }

    const handleClickCancelNewCategory = () => {
        setCategoryName('')
        setErrorMessage('')
        handleCloseCategoryModal()
    }

    const handleClickCreateCategory = async () => {
        try {
            const result = await clienteAxios.post('/products/createCategory', { name: categoryName }, configHeaders)
            if (result.status === 201) {
                alert(result.data.msg)
                setIsLoading(true)
                handleClickCancelNewCategory()
            }
        }
        catch (error) {
            alert(error.response.data.msg)
        }
    }

    const handleClickDeleteCategory = async (ev, categoryId, categoryName) => {
        ev.preventDefault()
        const confirmDelete = window.confirm(`Está seguro de que desea eliminar la categoría ${categoryName}?`)
        const currentPath = decodeURIComponent(window.location.pathname)
        const categoryPath = `/categoryPage/${categoryName}`
        if (confirmDelete) {
            try {
                const result = await clienteAxios.delete(`/products/deleteCategory/${categoryId}`, configHeaders)
                if (result.status === 200 && currentPath === categoryPath) {
                    alert(result.data.msg)
                    setTimeout(() => {
                        navigate('/')
                    }, 500);
                    setIsLoading(true)
                } else if (result.status === 200) {
                    alert(result.data.msg)
                    setIsLoading(true)
                }
            } catch (error) {
                alert(error.response.data.msg)
            }
        }
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
            <Navbar expand="lg" className="bg-body-secondary">
                <Container fluid>
                    <NavLink to="/" className={'nav-link fs-4'}>Logo</NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Dropdown style={{ padding: '0 1em' }} onMouseEnter={() => setShowCategory(true)} onMouseLeave={() => setShowCategory(false)} show={showCategory}>
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
                                            <div className="categoryItem" key={category.id} style={(role === 'mainAdmin' || role === 'admin') ? { display: 'flex', alignItems: 'center', minWidth: '10em', maxWidth: '12em' } : { maxWidth: '10em' }}>
                                                <Dropdown.Item onClick={(ev) => handleClickCategoryPage(ev, category.name)} style={role === 'mainAdmin' || role === 'admin' ? { width: '80%', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : { width: '100%', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={category.name}>
                                                    {category.name}
                                                </Dropdown.Item>
                                                <div className='btn' style={role === 'user' || role === null ? { display: 'none' } : { width: '20%', paddingLeft: '.7em' }} onClick={(ev) => handleClickDeleteCategory(ev, category.id, category.name)}>X</div>
                                            </div>
                                        )
                                        )}
                                    <Dropdown.Item onClick={(ev) => handleClickCategoryPage(ev)} style={role === 'mainAdmin' || role === 'admin' ? { width: '80%', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' } : { width: '100%', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        Ver Todos
                                    </Dropdown.Item>
                                    {
                                        (role === 'mainAdmin' || role === 'admin') &&
                                        <Dropdown.Item as={Button} style={{ textDecoration: 'none', textAlign: 'center', color: 'black' }} onClick={handleShowCategoryModal}>
                                            Crear Categoria
                                        </Dropdown.Item>
                                    }
                                    <Modal show={showNewCategory} onHide={handleClickCancelNewCategory}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Nueva Categoria</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Group className="mb-3" style={{ height: '5em' }}>
                                                    <Form.Label>Nombre</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name='name'
                                                        onChange={(ev) => handleChangeCategoryName(ev)}
                                                        isInvalid={!!errorMessage} />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errorMessage}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={handleClickCancelNewCategory}>
                                                Cancelar
                                            </Button>
                                            <Button variant="primary"
                                                onClick={handleClickCreateCategory}
                                                disabled={errorMessage !== '' || categoryName === ''}>
                                                Guardar
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                        <Form className="ms-auto mx-5">
                            <InputGroup style={{ margin: '0 .7em' }}>
                                <Form.Control
                                    type='text'
                                    placeholder='Buscar Producto'
                                    value={toSearch}
                                    name='keyWord'
                                    onChange={handleChangeSearchKeyWord}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleClickSearch();
                                        }
                                    }} />
                                <Button variant='light' style={{ width: '3em' }} onClick={handleClickSearch}>
                                    <i style={{ color: 'black' }} className='fa fa-search'></i>
                                </Button>
                            </InputGroup>
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
                                                role === 'user' && <Dropdown.Item as={NavLink} to='/userOrders'>Mis Compras</Dropdown.Item>
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