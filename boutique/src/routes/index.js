import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Customer from '../pages/Customer';
import Registration from '../pages/Registration';
import Editprofile from '../pages/Editprofile';
import FeaturedProducts from '../pages/FeaturedProducts'; // Fixed the casing here
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

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "login",
                element : <Login/>
            },
            {
                path : "customer",
                element : <Customer/>
            },
            {
                path : "registration",
                element : <Registration/>
            },
            {
                path : "editprofile",
                element : <Editprofile/>
            },
            {
                path : "featured-products",
                element : <FeaturedProducts/>
            },
            {
                path : "contact-us",
                element : <ContactUs/>
            },
            {
                path : "place-order",
                element : <PlaceOrder/>
            },
            {
                path : "fabric-selection",
                element : <FabricSelection/>
            },
            {
                path : "color-selection",
                element : <ColorSelection/>
            },
            {
                path : "browse-catalog",
                element : <BrowseCatalog/>
            },
            {
                path : "custom-orders",
                element : <CustomDressOrder/> 
            },
            {
                path : "wishlist",
                element : <Wishlist/>
            },
            {
                path : "cart",
                element : <Cart/>
            },
            {
                path : "dress-style-selection",
                element : <DressStyleSelection/>
            },
            {
                path : "forgot-password",
                element : <ForgotPassword/>
            },
            
            // Other routes...
        ]
    }
]);

export default router;
