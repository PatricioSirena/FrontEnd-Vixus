import TableC from "../components/TableC"
import { useEffect, useState } from "react"
import clienteAxios, {configHeaders} from "../helpers/axios"

const AdminUserPage = () => {
    
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)


    const getUsers = async () =>{
        const result = await clienteAxios.get('/users', configHeaders)
        setUsers(result.data)
        setIsLoading(false)
    }

    useEffect(() => {
        if (isLoading) {
            getUsers()
        }
    }, [users])
    

    return (
        <>
        <TableC array={users} setIsLoadingHook={setIsLoading} getUsersFunction={getUsers}/>
        </>
    )
}

export default AdminUserPage