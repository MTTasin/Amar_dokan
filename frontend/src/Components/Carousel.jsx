import { useRef, useEffect, useState } from "react";
import useFetch from "./../useFetch";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-creative";

import { EffectCreative, Autoplay } from "swiper/modules";

export default function Carou() {
  const [data, setData] = useState([]);

  const { response, error, loading } = useFetch(
    `http://192.168.0.105:8000/carousels/`
  );

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  const carousel = data.map((carousel) => {
    return (
      <SwiperSlide key={carousel.id} className="flex justify-center relative">
        <img
          src={carousel.image}
          alt=""
          className="w-[80vw] h-[25vh] md:h-[60vh] object-cover"
        />
        <a className="absolute btn bg-green-400 text-white rounded-none border-white bottom-5 left-16 md:left-56" href={carousel.link}>Check out now</a>
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
        modules={[EffectCreative, Autoplay]}
        className="mySwiper2 "
      >
        {carousel}
        
      </Swiper>
    </>
  );
}
