import Header from './components/Header.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';
import { ProductsProvider } from './context/ProductsContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Header />
        <main className="layout">
          <ProductList />
          <Cart />
        </main>
      </CartProvider>
    </ProductsProvider>
  );
}
