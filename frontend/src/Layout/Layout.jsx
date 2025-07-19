import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Cart from "../Components/CartIcon";

export default function Layout({ children }) {
  return (
    <div className="font-siliguri flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Cart />
      <Footer />
    </div>
  );
}
