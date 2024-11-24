import { useRef, useEffect, useState } from "react";
import useFetch from "./../useFetch";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowRight } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/effect-creative";

import { EffectCreative, Autoplay, Pagination } from "swiper/modules";

export default function Carou() {
  const [data, setData] = useState([]);

  const { response, error, loading } = useFetch(
    `https://amardokanbackend.tasinblog.com/carousels/`
  );

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  const carousel = data.map((carousel) => {
    return (
      <SwiperSlide key={carousel.id} className="flex justify-center relative">
        <a href={carousel.link}>
        <img
          src={carousel.image}
          alt=""
          className="w-[80vw] h-[25vh] md:h-[60vh] object-cover"
        />
        <div className="absolute flex invert link-hover text-2xl md:text-3xl rounded-none border-white bottom-6 md:bottom-10 left-16 md:left-56"><span>Shop now</span> <span className="mt-1.5 ml-1"><FaArrowRight /></span></div>
        </a>
      </SwiperSlide>
    );
  });

  return (
    <>
      <Swiper
        grabCursor={true}
        effect={"creative"}
        autoplay={{
          delay: 2500,
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
        className="mySwiper2 "
      >
        {carousel}
        
      </Swiper>
    </>
  );
}
