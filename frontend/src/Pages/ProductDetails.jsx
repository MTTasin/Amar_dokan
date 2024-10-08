import { Link, useParams } from "react-router-dom";
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


    const swiper = () => {
        return (
            <DetailsSwiper key={data.id} />
        )
    }

    return(
        <>

<div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <Link to={`/products/${data.category}`} className="capitalize">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              {data.category}
            </Link>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              {data.title}
            </span>
          </li>
        </ul>
      </div>


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