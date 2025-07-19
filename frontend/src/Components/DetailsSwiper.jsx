import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import useAxios from "../useAxios";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation, FreeMode, Thumbs } from "swiper/modules";

export default function DetailsSwiper() {
  const Params = useParams();
  const { response: productData, error, loading } = useAxios(`${import.meta.env.VITE_API_BASE_URL}/products/${Params.id}/`);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (productData && productData.images) {
      setImages(productData.images);
    }
  }, [productData]);

  const imageSlides = images.map(image => {
    return (
      <SwiperSlide key={image}>
        <img src={`${import.meta.env.VITE_API_BASE_URL}${image}`} alt="Product Image" className="w-full h-full object-contain"/>
      </SwiperSlide>
    );
  });

  return (
    <div className="w-full h-96 md:h-[500px] bg-white rounded-lg shadow-lg flex items-center justify-center">
      {loading && <div className="text-gray-600">Loading images...</div>}
      {error && <div className="text-red-500">Error loading images: {error.message}</div>}
      {images.length > 0 && (
        <Swiper
          spaceBetween={10}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination, Navigation, FreeMode, Thumbs]}
          className="mySwiper w-full h-full"
        >
          {imageSlides}
        </Swiper>
      )}
      {images.length === 0 && !loading && !error && (
        <div className="text-gray-500">No images available.</div>
      )}
    </div>
  );
}
