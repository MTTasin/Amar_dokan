import { useEffect, useState } from "react";
import useAxios from "./../useAxios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowRight } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";

import { EffectCreative, Autoplay, Pagination } from "swiper/modules";

export default function Carou() {
  const { response: data, error, loading } = useAxios(
    `${import.meta.env.VITE_API_BASE_URL}/carousels/`
  );

  const carouselSlides = data && Array.isArray(data) ? data.map((carousel) => {
    return (
      <SwiperSlide key={carousel.id} className="flex justify-center relative rounded-lg overflow-hidden shadow-lg">
        <a href={carousel.link} className="block w-full h-full">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${carousel.image}`}
            alt={carousel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-8">
            <div className="text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-md">{carousel.name}</h2>
              <button className="bg-white text-gray-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition duration-300 flex items-center space-x-2">
                <span>Shop Now</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </a>
      </SwiperSlide>
    );
  }) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <div className="text-center text-gray-600">Loading Carousels...</div>}
      {error && <div className="text-center text-red-500">Error loading carousels: {error.message}</div>}
      {data && data.length > 0 && (
        <Swiper
          grabCursor={true}
          effect={"creative"}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop={true}
          creativeEffect={{
            prev: {
              translate: ["-120%", 0, -500],
            },
            next: {
              translate: ["120%", 0, -500],
            },
          }}
          pagination={{ clickable: true }}
          modules={[EffectCreative, Autoplay, Pagination]}
          className="mySwiper h-[300px] md:h-[500px] rounded-lg"
        >
          {carouselSlides}
        </Swiper>
      )}
    </div>
  );
}
