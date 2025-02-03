// src/routes/index.js
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Registration from '../pages/Registration';
import FeaturedProducts from '../pages/FeaturedProducts';
import ContactUs from '../pages/ContactUs';
import PlaceOrder from '../pages/PlaceOrder';
import FabricSelection from '../pages/FabricSelection';
import ColorSelection from '../pages/ColorSelection';
import BrowseCatalog from '../pages/BrowseCatalog';
import Wishlist from '../pages/Wishlist';
import Cart from '../pages/Cart';
import ForgotPassword from '../pages/ForgotPassword';
import Profile from '../pages/Profile';
import AdminPage from '../pages/AdminPage';
import ManageUsers from '../pages/ManageUsers';
import ManageProducts from '../pages/ManageProducts'; // Ensure the path is correct
import MaterialManagement from '../pages/MaterialManagement';
import ManageCategories from '../pages/ManageCategories';
import ManageSubcategories from '../pages/ManageSubcategories';
import ViewProducts from '../pages/ViewProducts';
import EditProduct from '../pages/EditProduct';
import ProductDetails from '../pages/ProductDetails';
import AboutUs from '../pages/AboutUs';
import ProductInfo from '../pages/ProductInfo';
import CustomizationForm from '../pages/CustomizationForm';
import Checkout from '../pages/Checkout';
import VendorRegistration from '../pages/VendorRegistration';
import VendorLogin from '../pages/VendorLogin';
import VendorDashboard from '../pages/VendorDashboard';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "registration", element: <Registration /> },
            { path: "profile", element: <Profile /> },
            { path: "featured-products", element: <FeaturedProducts /> },
            { path: "contact-us", element: <ContactUs /> },
            { path: "place-order", element: <PlaceOrder /> },
            { path: "fabric-selection", element: <FabricSelection /> },
            { path: "color-selection", element: <ColorSelection /> },
            { path: "browse-catalog", element: <BrowseCatalog /> },
            { path: "wishlist", element: <Wishlist /> },
            { path: "cart", element: <Cart /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "manage-materials", element: <MaterialManagement /> },
            { path: "manage-products/:id", element: <ManageProducts /> },
            { path: "about-us", element: <AboutUs /> },
            { path: "product-info/:id", element: <ProductInfo /> },
            { path: "customize/:id", element: <CustomizationForm /> },
            { path: "checkout", element: <Checkout /> },
            { path: "vendor-register", element: <VendorRegistration /> },
            { path: "vendor-login", element: <VendorLogin /> },
            { path: "vendor-page", element: <VendorDashboard /> },
           
            // Admin routes
            {
                path: "admin",
                element: <AdminPage />,
                children: [
                    { path: "manage-users", element: <ManageUsers /> }, // Nested route
                    { path: "manage-products", element: <ManageProducts /> },
                    { path: "manage-categories", element: <ManageCategories /> },
                    { path: "manage-subcategories", element: <ManageSubcategories /> },
                    { path: "view-products", element: <ViewProducts /> },
                    { path: "edit-product/:id", element: <EditProduct /> },
                    { path: "product-details/:id", element: <ProductDetails /> },
                ]
            },
            { path: "product/:id", element: <ProductDetails /> }
            // Other routes...
        ]
    }
]);

export default router;