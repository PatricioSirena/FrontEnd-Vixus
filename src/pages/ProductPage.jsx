import { useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import clienteAxios, { configHeaders } from "../helpers/axios"
import Carrousel from "../components/Carrousel"
import { Button, Col, Container, Row } from "react-bootstrap"

const ProductPage = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [isFavorite, setIsFavorite] = useState(false)
    const [product, setProduct] = useState({})
    const storageRole = JSON.parse(sessionStorage.getItem('role'))
    const token = JSON.parse(sessionStorage.getItem('token'))


    const getProduct = useCallback(async () => {
        try {
            const result = await clienteAxios.get(`/products/${params.productId}`)
            setProduct(result.data);
            if(storageRole === 'user'){
                await getFavorites(result.data._id)
                return
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        } 
    }, [params.productId, storageRole])

    const getFavorites = async (productId) =>{    
            try {
                const result = await clienteAxios.get(`/products/getFavorites`, configHeaders)
                const favorites = result.data.products            
                if(favorites.includes(productId)){
                    setIsFavorite(true)
                    return
                } else {
                    setIsFavorite(false)
                    return            
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }   
    }

    const handleClickAddToCart = async () =>{
        if(token === null){
            alert('Debe iniciar sesion, redirigiendo a login')
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        } 
        try {
            const result = await clienteAxios.post(`/products/addToCart/${product._id}`, {}, configHeaders)
            alert(result.data.msg);
            setIsLoading(true)
        } catch (error) {
            alert(error.response.data.msg);
        } 
    }

    const handleClickAddToFav = async () =>{
        if(token === null){
            alert('Debe iniciar sesion, redirigiendo a login')
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        }
        try {
            const result = await clienteAxios.post(`/products/addToFavorite/${params.productId}`, {}, configHeaders)
            alert(result.data.msg);
            setIsLoading(true)
        } catch (error) {
            alert(error.response.data.msg)
        }
    }
    
    const handleClickDelFromFav = async () =>{
        if(token === null){
            alert('Debe iniciar sesion, redirigiendo a login')
            setTimeout(() => {
                navigate('/login')
            }, 1000);
        }
            try {
                const result = await clienteAxios.post(`/products/delFromFavorite/${params.productId}`, {}, configHeaders)
                alert(result.data.msg);
                setIsLoading(true)
            } catch (error) {
                alert(error.response.data.msg)
            }
    }

    useEffect(() => {
        if (isLoading) {
            getProduct()
        }
    },[isLoading, getProduct])

    return (
        <>
            <Container>
                <Row>
                    <Col sm={12} md={5}>
                        <Carrousel idPage={'productPage'} productImages={product.galery} />
                    </Col>
                    <Col sm={12} md={7} style={{textAlign: 'center'}}>
                        <div className="description">{product.description}</div>
                        <div className="options" >
                            <Button 
                            className="mx-3 mt-3" 
                            disabled={product.quantity === 0 ? true : storageRole === 'user' || null ? false : true} 
                            onClick={() => handleClickAddToCart()}>
                                {product.quantity === 0 ? 'Sin Stock' : 'Comprar'}
                                </Button>
                            <Button 
                            className="mx-3 mt-3" 
                            disabled={storageRole === 'user' ? false : storageRole === null ? false : true}
                            onClick={isFavorite ? handleClickDelFromFav : handleClickAddToFav }>
                                {   isFavorite ? 
                                    'Borrar Fav' 
                                    :
                                    'Favorito'
                                    
                                }
                                </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default ProductPage