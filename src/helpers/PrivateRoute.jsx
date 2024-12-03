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
        if (routeRole.includes(userRole)){
            return children
        } else{
            setTimeout(() => {
                navigate('/')
            }, 500);
        }
    }
}

export default PrivateRoute