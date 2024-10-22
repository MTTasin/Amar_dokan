import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Cart from "../Components/CartIcon";

export default function Layout({ children }) {
  return (
    <>
      <div className="font-siliguri flex flex-col h-screen">
        <Header />
        <Cart />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
}
