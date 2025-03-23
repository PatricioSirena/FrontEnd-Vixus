import { useEffect, useState } from "react"
import clienteAxios from "../helpers/axios"
import Accordion from 'react-bootstrap/Accordion';
import { Container } from "react-bootstrap";

const AdminCategoryPage = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isLoading) {
            const getData = async () => {
                try {
                    const resultProducts = await clienteAxios.get('/products/getProducts')
                    const resultCategories = await clienteAxios.get('/products/getCategories')
                    const categoriesToUpperCase = resultCategories.data.map(category => {
                        return { id: category.id, name: category.name.charAt(0).toUpperCase() + category.name.slice(1) }
                    })
                    setProducts(resultProducts.data)
                    setCategories(categoriesToUpperCase)
                    setIsLoading(false)
                } catch (error) {
                    console.log(error);
                }
            }
            getData()
        }
    },)


    return (
        <>
            <Container fluid>
                <Accordion defaultActiveKey="0">
                    {categories.map(category => (
                        <Accordion.Item key={category.id} eventKey={category.id}>
                            <Accordion.Header>{category.name}</Accordion.Header>
                            <Accordion.Body>
                                {products.filter(product => product.category === category.name).map(product => (
                                    <div key={product._id}>
                                        <p>{product.name}</p>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Container>
        </>
    )
}

export default AdminCategoryPage