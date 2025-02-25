import { useEffect, useState } from "react"
import clienteAxios, { configHeaders } from "../helpers/axios"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const token = JSON.parse(sessionStorage.getItem('token'))

    const getOrders = async () => {
        try {
            const result = await clienteAxios.get('/products/getOrders', configHeaders)
            const ordersArray = result.data;
            const updatedOrders = []
            for (const item of ordersArray) {
                const { products, date, ...order } = item
                const newDate = convertDate(date)
                order.date = newDate
                order.items = []
                for (const element of products) {
                    const result = await clienteAxios.get(`/products/${element.idProduct}`)
                    if (result.status === 200) {
                        const product = result.data
                        product.quantity = element.quantity
                        order.items.push(product)
                    } else {
                        const product = { _id: element.idProduct, quantity: element.quantity }
                        order.items.push(product)
                    }
                }
                updatedOrders.push(order)
                setOrders(updatedOrders)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const convertDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const convertedDate = new Intl.DateTimeFormat('es-AR', options).format(new Date(date))
        return convertedDate
    }

    const handleClickAddToCart = async (productId) => {
        if (token === null) {
            alert('Debe iniciar sesion, redirigiendo a login')
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        }
        try {
            const result = await clienteAxios.post(`/products/addToCart/${productId}`, {}, configHeaders)
            alert(result.data.msg);
            setIsLoading(true)
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    useEffect(() => {
        if (isLoading) {
            getOrders()
        }
    },)

    return (
        <Container>
            {orders.map((order) =>
                <>
                    <Row key={order._id} className="cardOrder" style={{ width: '100%', minHeight: '8em', border: '1px solid grey', margin: '1em 0', borderRadius: '5px' }}>
                        <Col sm={12} md={12} lg={12} style={{ height: '1.5em', margin: '.5em 0' }}>{order.date}</Col>
                        <hr style={{ margin: '0', padding: '0', color: 'black' }} />
                        {
                            order.items.map((item) => (
                                <Row key={item._id} style={order.items.length > 1 ? { margin: '.5em 0 0 0', borderBottom: '1px solid grey' } : { margin: '.5em 0 0 0' }}>
                                    <Col sm={5} md={2} lg={2} style={{ height: '7em', display: 'flex', justifyContent: 'center', padding: '1em' }}>
                                        <img src={item.mainPicture} style={{ width: '6em', height: '6em', borderRadius: '100px', objectFit: 'cover' }} />
                                    </Col>
                                    <Col sm={7} md={8} lg={8} style={{ height: '7em', overflowY: 'hidden', marginBottom: '1.5em' }}>
                                        <h4>{order.paymentStatus === 'pending' ? 'Pendiente' : order.paymentStatus === 'approver' ? 'Pagado' : 'Cancelado'}</h4>
                                        <p style={{ margin: '.2em' }}>{item.name} x {item.quantity}</p>
                                    </Col>
                                    <Col sm={12} md={2} lg={2}>
                                        <Link to={`/product/${item._id}`} className='btn btn-primary'>Ver Producto</Link>
                                        <Button variant="danger" onClick={() => handleClickAddToCart(item._id)}>Agregar al carrito</Button>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Row>
                    {
                        order.paymentStatus === 'pending' &&
                        <Button variant="primary">Pagar</Button>
                    }
                </>
            )}
        </Container>
    )
}

export default UserOrdersPage