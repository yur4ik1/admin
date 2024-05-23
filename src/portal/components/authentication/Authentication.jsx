import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import Layout from "../layout/Layout"

const Authentication = () => {
    const { userData } = useSelector((state) => state.auth)

    return (
        <>
            {
                userData ? <Layout><Outlet /></Layout> : <Navigate to='/' />
            }
        </>
    )
}

export default Authentication