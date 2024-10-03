import { useParams } from "react-router-dom";
import DetailsSwiper from "../Components/DetailsSwiper";
import StarReview from "../Components/StarReview";
import axios from "axios";
import { useState, useEffect } from "react";


export default function ProductDetails() {
    const params = useParams()
    
    const [data, setData] = useState([])

    useEffect(() => {
        axios
            .get(`http://192.168.0.105:8000/products/${params.id}/`)
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [ params.id ])


    console.log(data)

    const swiper = () => {
        return (
            <DetailsSwiper key={data.id} />
        )
    }

    return(
        <>
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-300 h-[80vh]">
                <div className="text-center my-auto md:order-1 order-2"><h1 className="text-red-500 md:text-7xl text-3xl">{data.title}</h1>
                <p className="text-xl mt-10">{data.description}</p>
                <div className="flex justify-center"><StarReview rating={data.rating} /><span className="text-yellow-500 mt-4 ml-2">{data.rating}</span></div>
                </div>
                <div className="md:order-2 order-1 my-auto"><div className="w-1/2 mx-auto">{swiper()}</div></div>
            </div>
            <div>
                
            </div>
        </div>
            
            

            
        </>
    )
}