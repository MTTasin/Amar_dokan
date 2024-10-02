import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation, FreeMode, Thumbs } from "swiper/modules";

export default function DetailsSwiper() {
  
  const Params = useParams();
  const [data, setData] = useState([]);

  const fetchImages = () => {
    axios
      .get(`http://192.168.0.105:8000/products/${Params.id}/`)
      .then((res) => {
        setData(res.data.images);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    fetchImages();
  }, []);

  const ima = data.map(image => {
    return (
      <SwiperSlide key={image}>
        <img src={image} alt="" className="mx-auto"/>
      </SwiperSlide>
    );
  });



  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation, FreeMode, Thumbs]}
        className="mySwiper"
      >
        {ima}
      </Swiper>

      
    </>
  );
}
