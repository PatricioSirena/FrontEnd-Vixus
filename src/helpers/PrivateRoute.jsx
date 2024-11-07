import { useNavigate } from "react-router-dom"

const PrivateRoute = ({children, routeRole}) => {
    const navigate = useNavigate()
    const token = JSON.parse(sessionStorage.getItem('token'))
    const userRole = JSON.parse(sessionStorage.getItem('role'))

    if (!token) {
        setTimeout(() => {
            navigate('/')
        }, 500);
    } else {
        if (routeRole !== userRole){
            setTimeout(() => {
                navigate('/')
            }, 500);
        } else{
            return children
        }
    }
}

export default PrivateRoute