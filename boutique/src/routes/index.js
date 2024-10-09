import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Customer from '../pages/Customer';
import Registration from '../pages/Registration';
import FeaturedProducts from '../pages/FeaturedProducts';
import ContactUs from '../pages/ContactUs';
import PlaceOrder from '../pages/PlaceOrder';
import FabricSelection from '../pages/FabricSelection';
import ColorSelection from '../pages/ColorSelection';
import BrowseCatalog from '../pages/BrowseCatalog';
import CustomDressOrder from '../pages/CustomDressOrder';
import Wishlist from '../pages/Wishlist';
import Cart from '../pages/Cart';
import DressStyleSelection from '../pages/DressStyleSelection';
import ForgotPassword from '../pages/ForgotPassword';
import CreateProfile from '../pages/CreateProfile';
import AdminPage from '../pages/AdminPage';
import ManageUsers from '../pages/ManageUsers';
import ManageProducts from '../pages/ManageProducts';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/", element: <Home /> },
            { path: "login", element: <Login /> },
            { path: "customer", element: <Customer /> },
            { path: "registration", element: <Registration /> },
            { path: "createprofile", element: <CreateProfile /> },
            { path: "featured-products", element: <FeaturedProducts /> },
            { path: "contact-us", element: <ContactUs /> },
            { path: "place-order", element: <PlaceOrder /> },
            { path: "fabric-selection", element: <FabricSelection /> },
            { path: "color-selection", element: <ColorSelection /> },
            { path: "browse-catalog", element: <BrowseCatalog /> },
            { path: "custom-orders", element: <CustomDressOrder /> },
            { path: "wishlist", element: <Wishlist /> },
            { path: "cart", element: <Cart /> },
            { path: "dress-style-selection", element: <DressStyleSelection /> },
            { path: "forgot-password", element: <ForgotPassword /> },

            // Admin routes
            {
                path: "admin",
                element: <AdminPage />,
                // children: [
                //     { path: "manage-users", element: <ManageUsers/> },
                //     { path: "manage-products", element: <ManageProducts/> },
                // ],
            },
            { path: "manage-users", element: <ManageUsers/> },
            { path: "manage-products", element: <ManageProducts/> },
            // Other routes...
        ]
    }
]);

export default router;
