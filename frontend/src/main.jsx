import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import {Provider} from "react-redux"
import { store } from './redux/store.js'
import { CartProvider } from './Pages/Context/CartContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <CartProvider>
    <App />
    </CartProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
