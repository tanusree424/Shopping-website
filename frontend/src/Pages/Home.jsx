import React from 'react'
import Topbar from './Topbar'
import HeaderNavBar from './HeaderNavBar'
import Hero from './Hero.jsx';
import Features from './Features.jsx';
import Categories from './Categories.jsx';
import FeatureProducts from './FeatureProducts.jsx';
import Offers from './Offers.jsx';
import RecentProducts from './RecentProducts.jsx';
import Vendors from './Vendors.jsx';
import Footer from './Footer.jsx';
//ADD LINKS
import "../assets/css/style.min.css";
import "../assets/js/main.js";
import "../assets/lib/animate/animate.min.css";
import "../assets/lib/easing/easing.js"
import "../assets/lib/easing/easing.min.js"
import "../assets/lib/owlcarousel/assets/ajax-loader.gif";
import "../assets/lib/owlcarousel/assets/owl.carousel.min.css";
import "../assets/lib/owlcarousel/assets/owl.theme.default.css";
import "../assets/lib/owlcarousel/assets/owl.theme.default.min.css";
import "../assets/lib/owlcarousel/assets/owl.theme.green.css";
import "../assets/lib/owlcarousel/assets/owl.theme.green.min.css";
import "../assets/lib/owlcarousel/assets/owl.video.play.png";
import "../assets/lib/owlcarousel/owl.carousel.js"
import "../assets/lib/owlcarousel/owl.carousel.min.js"
import { useCart } from './Context/CartContext';
const Home = () => {
  const { cartItemsCount, setCartItemsCount } = useCart();
  return (
    <div>
      <Topbar/>
      <HeaderNavBar/>
      <Hero/>
      <Features cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount}/>
      <Categories cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
      <FeatureProducts cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
      <Offers/>
      <RecentProducts cartItemsCount={cartItemsCount} setCartItemsCount={setCartItemsCount} />
      <Vendors/>
      <Footer/>
    </div>
  )
}

export default Home
