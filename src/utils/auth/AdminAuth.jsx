import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { authenticateUser } from "./authenticateUser"

const AdminAuth = () => {
    const { userData } = useSelector((state) => state.auth)

    useEffect(() => {
        if (userData) {
            authenticateUser()
        }
    }, [userData])

    if (!userData) {
        return <Navigate to='/' />
    }

    return (
        <>
            {
                userData.role === 'admin' ? <Outlet /> : <Navigate to='/404' />
            }
        </>
    )
}

export default AdminAuth