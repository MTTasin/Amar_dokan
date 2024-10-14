import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Cart from "../Components/Cart";

export default function Layout({ children }) {
    return (
        <>
            <div className="font-siliguri">
            <Header />
            <div className="z-50"><Cart /></div>
            {children}
            <Footer />
            </div>
        </>
    );
}