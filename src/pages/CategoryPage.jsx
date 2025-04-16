import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import clienteAxios, { configHeaders } from "../helpers/axios"
import { Col, Container, Dropdown, Row } from "react-bootstrap"
import CardC from "../components/CardC"
import Spinner from 'react-bootstrap/Spinner';

const CategoryPage = () => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [reload, setReload] = useState(false)
    const [categoryProducts, setCategoryProducts] = useState([])
    const [nonCategoryProducts, setNonCategoryProducts] = useState([])
    const [showCategory, setShowCategory] = useState(false);
    const role = JSON.parse(sessionStorage.getItem('role'));

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
        <>
            {
                isLoading ?
                    <div style={{ display: 'flex', justifyContent: 'center', height: '70vh', alignItems: 'center' }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <div style={{ height: '70vh', alignItems: 'center' }}>
                        <h1 style={{ textAlign: 'center', marginTop: '1em' }}>Productos de la categoría: {params.categoryName}</h1>
                        <Dropdown onMouseEnter={() => setShowCategory(true)} onMouseLeave={() => setShowCategory(false)} show={showCategory}
                        >
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
                                Productos
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    nonCategoryProducts.map((product) => (
                                        <div className="categoryItem" key={product._id} style={(role === 'mainAdmin' || role === 'admin') && { display: 'flex', alignItems: 'center', width: '10em' }}>
                                            <Dropdown.Item
                                                onClick={(ev) => handleClickAddCategoryToProduct(ev, product._id, product.name)}
                                                style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={product.name}
                                            >
                                                {product.name}
                                            </Dropdown.Item>
                                        </div>
                                    )
                                    )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Container>
                            <Row>
                                {
                                    categoryProducts.map((product) => (
                                        <Col key={product._id} sm={12} md={6} xl={3} style={{ marginTop: '1.7em' }}>
                                            <div className="delProdCategory" style={role === 'user' || role === null ? { display: 'none' } : { display: 'flex', justifyContent: 'end', marginRight: '3em' }}>
                                                <span className="btn btn-dark" title={`Eliminar ${product.name} de esta categoria`} onClick={(ev) => handleClickDelCategoryFormProd(ev, product._id, product.name)}>X</span>
                                            </div>
                                            <CardC key={product._id} cardId={'cardCategory'} productId={product._id}
                                                productName={product.name} productPrice={product.price}
                                                mainImage={product.mainPicture} productStock={product.quantity} />
                                        </Col>
                                    ))}
                            </Row>
                        </Container>
                    </div>
            }
        </>
    )
}

export default CategoryPage