import { Route, Routes } from "react-router-dom"
import NavbarC from '../components/NavbarC'
import FooterC from '../components/FooterC'
import PrivateRoute from "../helpers/PrivateRoute"
import AdminPage from '../pages/AdminPage'
import AdminCategoryPage from '../pages/AdminCategoryPage'
import AdminUserPage from '../pages/AdminUserPage'
import AdminProductPage from '../pages/AdminProductPage'
import UserCartPage from '../pages/UserCartPage'
import UserFavoritePage from '../pages/UserFavoritePage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AboutUsPage from '../pages/AboutUsPage'
import CategoryPage from '../pages/CategoryPage'
import ErrorPage from '../pages/ErrorPage'
import ProductPage from '../pages/ProductPage'


const RoutesViews = () => {
    return (
        <>
            <NavbarC />
            <Routes>
                <Route path="/adminPage" element={
                    <PrivateRoute routeRole={'admin'}>
                        <AdminPage />
                    </PrivateRoute>
                }/>
                <Route path="/adminCategory" element={
                    <PrivateRoute routeRole={'admin'}>
                        <AdminCategoryPage />
                    </PrivateRoute>
                }/>
                <Route path="/adminUser" element={
                    <PrivateRoute routeRole={'admin'}>
                        <AdminUserPage />
                    </PrivateRoute>
                }/>
                <Route path="/adminProduct" element={
                    <PrivateRoute routeRole={'admin'}>
                        <AdminProductPage />
                    </PrivateRoute>
                }/>
                <Route path="/userCart" element={
                    <PrivateRoute routeRole={'user'}>
                        <UserCartPage />
                    </PrivateRoute>
                }/>
                <Route path="/userFavorites" element={
                    <PrivateRoute routeRole={'user'}>
                        <UserFavoritePage />
                    </PrivateRoute>
                }/>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/aboutUs" element={<AboutUsPage />} />
                <Route path="/category/:categpryId" element={<CategoryPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
            <FooterC />
        </>
    )
}

export default RoutesViews