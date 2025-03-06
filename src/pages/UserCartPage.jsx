import { useEffect, useState } from "react"
import TableC from "../components/TableC"
import clienteAxios, { configHeaders } from "../helpers/axios"
import { Button } from "react-bootstrap"


const UserCartPage = () => {

    const [cartProducts, setCartProducts] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const getCart = async () => {
        const arrayCart = [];
        const result = await clienteAxios.get('/products/getCart', configHeaders)
        const cartResult = result.data.products
        for (const item of cartResult) {
            const { idProduct, quantity } = item
            try {
                const response = await clienteAxios.get(`/products/${idProduct}`, configHeaders)
                const product = response.data
                product.quantity = quantity
                arrayCart.push(product)
            } catch (error) {
                console.log(error);
            }
        }
        setCartProducts(arrayCart)
        setIsLoading(false)
    }

    const handleClickMpPay = async () => {
        try {
            const response = await clienteAxios.post('/products/mpPayment', {},configHeaders)
            location.href = response.data.mpLink
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (isLoading) {
            getCart()
        }
    }, [isLoading])

    useEffect(() => {
        const getTtotalPrice = () => {
            let cartPrice = 0
            for (const product of cartProducts) {
                cartPrice += product.price * product.quantity
            }
            setTotalPrice(cartPrice)
        }
        getTtotalPrice()
    }, [cartProducts])

    return (
        <>
            <TableC idPage={'userCart'} array={cartProducts} setIsLoadingHook={setIsLoading} />
            <div className="priceAndConfirm" style={{ margin: '2em 10em', textAlign: 'end' }}>
                <p>Total: ${totalPrice}</p>
                <Button onClick={handleClickMpPay}>Confirmar compra</Button>
            </div>
        </>
    )
}

export default UserCartPage