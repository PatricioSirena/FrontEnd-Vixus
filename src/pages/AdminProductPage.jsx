import TableC from "../components/TableC"
import { useEffect, useState } from "react"
import clienteAxios, {configHeaders} from "../helpers/axios"

const AdminProductPage = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const getStockProducts = async () =>{
        const resultProducts = await clienteAxios.get('/products', configHeaders)
        setProducts(resultProducts.data)
        setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) {
            getStockProducts()            
        }
    }, [products])
    

    return (
        <>
            <TableC array={products} idPage={'productAdmin'} setIsLoadingHook={setIsLoading} getStockFunction={getStockProducts}/>
        </>
    )
}

export default AdminProductPage