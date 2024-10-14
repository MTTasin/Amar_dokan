import { FaShoppingCart } from "react-icons/fa";



export default function Cart() {

    


    return (
        <div className="fixed top-20 right-5 bg-secondary text-white w-10 h-10 rounded-full flex justify-center items-center">
            <div className="indicator"><FaShoppingCart className="text-xl" /><span className="badge badge-xs badge-primary indicator-item text-white p-2"></span></div>
        </div>
    );
}