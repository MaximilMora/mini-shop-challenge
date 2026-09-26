import Header from './components/Header.jsx';
import ProductList from './components/ProductList.jsx';
import Cart from './components/Cart.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="layout">
        <ProductList />
        <Cart />
      </main>
    </>
  );
}
