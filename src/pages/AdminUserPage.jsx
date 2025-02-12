import TableC from "../components/TableC"
import { useEffect, useState } from "react"
import clienteAxios, {configHeaders} from "../helpers/axios"
import { Form } from "react-bootstrap"

const AdminUserPage = () => {
    
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchWord, setSearchWord] = useState('')


    const getUsers = async () =>{
        try {
            const result = await clienteAxios.get('/users', configHeaders)
            setUsers(result.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeSearch = (ev) =>{
        setSearchWord(ev.target.value)
    }

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchWord.toLowerCase()) 
        || user.email.toLowerCase().includes(searchWord.toLowerCase())
        || user.role.toLowerCase().includes(searchWord.toLowerCase())
        || user.phone.toString().includes(searchWord)
    )

    useEffect(() => {
        if (isLoading) {
            getUsers()
        }
    }, [isLoading])
    

    return (
        <>
        <Form>
                <Form.Group controlId="formBasicSearch">
                    <Form.Control onChange={handleChangeSearch} style={{width: '12em', margin: '1em 8em 0px'}} value={searchWord} placeholder="Buscar usuario"/>
                </Form.Group>
            </Form>
        <TableC array={filteredUsers} setIsLoadingHook={setIsLoading}/>
        </>
    )
}

export default AdminUserPage