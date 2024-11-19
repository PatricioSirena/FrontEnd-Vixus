import { useEffect, useState } from "react"
import TableC from "../components/TableC"
import clienteAxios, { configHeaders } from "../helpers/axios"


const UserCartPage = () => {

    const [cartProducts, setCartProducts] = useState([])
    const [isLoaing, setIsLoaing] = useState(true)
    
    const getCart = async () =>{
        const arrayCart = [];
        const result = await clienteAxios.get('/products/getCart', configHeaders)
        const cartResult = result.data.products
        for(const item of cartResult){
            const {idProduct, quantity} = item
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
        setIsLoaing(false)
    }

    useEffect(() => {
        if(isLoaing){
            getCart()
        }
    }, [cartProducts])
    


    return (
        <>
        <TableC idPage={'userCart'} array={cartProducts}/>
        </>
    )
}

export default UserCartPage