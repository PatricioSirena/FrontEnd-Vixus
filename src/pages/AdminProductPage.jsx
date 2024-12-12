import TableC from "../components/TableC"
import { useEffect, useState } from "react"
import clienteAxios, {configHeaders} from "../helpers/axios"
import Form  from "react-bootstrap/Form"

const AdminProductPage = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchWord, setSearchWord] = useState('')


    const getStockProducts = async () =>{
        const resultProducts = await clienteAxios.get('/products', configHeaders)        
        setProducts(resultProducts.data)
        setIsLoading(false)
    }

    const handleChangeSearch = (ev) =>{
        setSearchWord(ev.target.value)
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchWord.toLowerCase()) 
        || product.description.toLowerCase().includes(searchWord.toLowerCase())
        || product.color.toLowerCase().includes(searchWord.toLowerCase())
        || product.size.toLowerCase().includes(searchWord.toLowerCase())
        || product.price.toString().includes(searchWord)
    );

    useEffect(() => {
        if (isLoading) {
            getStockProducts()            
        }
    }, [products, isLoading])
    

    return (
        <>
            <Form>
                <Form.Group controlId="formBasicSearch">
                    <Form.Control onChange={handleChangeSearch} style={{width: '14em', margin: '2em 8em'}} value={searchWord} placeholder="Buscar"/>
                </Form.Group>
            </Form>
            <TableC array={filteredProducts} idPage={'productAdmin'} setIsLoadingHook={setIsLoading} getStockFunction={getStockProducts}/>
        </>
    )
}

export default AdminProductPage