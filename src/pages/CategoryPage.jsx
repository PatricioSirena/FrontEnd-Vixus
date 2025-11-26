import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import clienteAxios, { configHeaders } from "../helpers/axios"
import { Col, Container, Dropdown, Row } from "react-bootstrap"
import CardC from "../components/CardC"
import Spinner from 'react-bootstrap/Spinner';
import ProductFilterC from "../components/ProductFilterC"

const CategoryPage = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(false)
    const [categoryProducts, setCategoryProducts] = useState([])
    const [filteredProducts , setFilteredProducts] = useState(categoryProducts)
    const [nonCategoryProducts, setNonCategoryProducts] = useState([])
    const [showCategory, setShowCategory] = useState(false);
    const role = JSON.parse(sessionStorage.getItem('role'));
    const [orderBy, setOrderBy] = useState('')
    const orderOptions = ['ascendingName', 'descendingName', 'ascendingPrice', 'descendingPrice', 'date']

    const handleClickDelCategoryFormProd = async (ev, productId, productName) => {
        ev.preventDefault()
        const categoryNameToLowerCase = params.categoryName.toLowerCase()
        const response = confirm(`Eliminar ${productName} de esta categoria?`)
        if (response) {
            try {
                const result = await clienteAxios.post(`/products/delCategoryFromProd/${productId}/${categoryNameToLowerCase}`, {}, configHeaders)
                if (result.status === 200) {
                    setReload(true)
                }
            } catch (error) {
                alert(error.response.data.msg)
            }
        }
    }

    const handleClickAddCategoryToProduct = async (ev, productId, productName) => {
        ev.preventDefault()
        const categoryNameToLowerCase = params.categoryName.toLowerCase()
        const response = confirm(`Agregar ${productName} a esta categoria?`)
        if (response) {
            try {
                const result = await clienteAxios.post(`/products/addCategoryToProd/${productId}/${categoryNameToLowerCase}`, {}, configHeaders)
                if (result.status === 200) {
                    alert(result.data.msg)
                    setReload(true)
                }
            } catch (error) {
                alert(error.response.data.msg)
            }
        }
    }

    const handleClickOrderProdcutsBy = (ev, keyWord) => {
        ev.preventDefault()
        setIsLoading(true)
        setOrderBy(keyWord)
        if (keyWord === 'ascendingName') {
            setCategoryProducts(categoryProducts.sort((a, b) => a.name.localeCompare(b.name)))
        }
        if (keyWord === 'descendingName') {
            setCategoryProducts(categoryProducts.sort((a, b) => b.name.localeCompare(a.name)))
        }
        if (keyWord === 'ascendingPrice') {
            setCategoryProducts(categoryProducts.sort((a, b) => a.price - b.price))
        }
        if (keyWord === 'descendingPrice') {
            setCategoryProducts(categoryProducts.sort((a, b) => b.price - a.price))
        }
        if (keyWord === 'date') {
            setCategoryProducts(categoryProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 600);
    }

    const handleFilteredProducts = useCallback((productsFiltered) => {
        setFilteredProducts(productsFiltered)
    }, [])

    useEffect(() => {
        const getCategoryProducts = async () => {
            setIsLoading(true)
            setCategoryProducts([]);
            setNonCategoryProducts([]);
            try {
                const result = await clienteAxios.get(`/products`)
                const productsOfCategory = result.data.filter(product => product.categories.some(category => category === params.categoryName.toLowerCase()))
                const otherProducts = result.data.filter(product => !product.categories.some(category => category === params.categoryName.toLowerCase()))
                setCategoryProducts(productsOfCategory);
                setNonCategoryProducts(otherProducts);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
                setReload(false)
            }
        }
        getCategoryProducts()
    }, [params.categoryName, reload])

    return (
        <Container fluid>
            <Row>
            <Col lg={2}>
            <ProductFilterC products={categoryProducts} onFilteredProducts={handleFilteredProducts}/>
            </Col>
            <Col lg={10}>
            {
                isLoading ?
                    <div style={{ display: 'flex', justifyContent: 'center', height: '70vh', alignItems: 'center' }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        <Dropdown style={{margin: '2em 0'}}>
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
                                {`Ordenar por: ${orderBy === '' ? 'Relevancia' : orderBy === 'ascendingName' ? 'Nombre A-Z' : orderBy === 'descendingName' ? 'Nombre Z-A' : orderBy === 'ascendingPrice' ? 'Menor precio' : orderBy === 'descendingPrice' ? 'Mayor precio' : orderBy === 'date' && 'Fecha'}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    orderOptions.map((option, index) => (
                                        <Dropdown.Item as={"button"} key={index} onClick={(ev) => handleClickOrderProdcutsBy(ev, option)}>
                                            {option === 'ascendingName' && 'Nombre A-Z'}
                                            {option === 'descendingName' && 'Nombre Z-A'}
                                            {option === 'ascendingPrice' && 'Menor precio'}
                                            {option === 'descendingPrice' && 'Mayor precio'}
                                            {option === 'date' && 'Fecha'}
                                        </Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <div style={{ height: '70vh', alignItems: 'center' }}>
                            <h1 style={{ textAlign: 'center' }}>Productos de la categoría: {params.categoryName}</h1>
                            {
                                (role === 'mainAdmin' || role === 'admin') &&
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
                                        }}>
                                        Productos
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            nonCategoryProducts.map((product) => (
                                                <div className="categoryItem" key={product._id} style={{ display: 'flex', alignItems: 'center', width: '10em' }}>
                                                    <Dropdown.Item
                                                        onClick={(ev) => handleClickAddCategoryToProduct(ev, product._id, product.name)}
                                                        style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                                                        title={product.name}>
                                                        {product.name}
                                                    </Dropdown.Item>
                                                </div>
                                            )
                                            )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                            <Container>
                                <Row>
                                    {
                                        categoryProducts.length === 0 ? (
                                            <Col sm={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '4em' }}>
                                                <h4>No se encontraron productos en esta categoría.</h4>
                                            </Col>
                                        ) :
                                        filteredProducts.length > 0 ? (
                                            filteredProducts.map((product) => (
                                                <Col key={product._id} sm={12} md={6} xl={3} style={{ marginTop: '1.7em' }}>
                                                    <CardC key={product._id} cardId={'categoryCard'} productId={product._id}
                                                        productName={product.name} productPrice={product.price}  
                                                        mainImage={product.mainPicture} delProdFromCategory={handleClickDelCategoryFormProd}/>
                                                </Col>
                                            ))
                                        ) : (
                                            <Col sm={12} style={{ marginTop: '1.7em' }}>
                                                <h4>No se encontraron productos que coincidan con los filtros aplicados.</h4>
                                            </Col>
                                        )}
                                </Row>
                            </Container>
                        </div>
                    </>
            }
            </Col>
            </Row>
        </Container>
    )
}

export default CategoryPage