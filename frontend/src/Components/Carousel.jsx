import { useRef, useEffect, useState } from "react";
import useFetch from "./../useFetch";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-creative";

import { EffectCreative, Autoplay } from "swiper/modules";

export default function Carou() {
  const [data, setData] = useState([]);

  const { response, error, loading } = useFetch(
    `http://127.0.0.1:8000/carousels/`
  );

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  const carousel = data.map((carousel) => {
    return (
      <SwiperSlide key={carousel.id}>
        <img
          src={carousel.image}
          alt=""
          className="w-[80vw] h-[60vh] mx-auto"
        />{" "}
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
            shadow: true,
            translate: ["-120%", 0, -500],
          },
          next: {
            shadow: true,
            translate: ["120%", 0, -500],
          },
        }}
        modules={[EffectCreative, Autoplay]}
        className="mySwiper2"
      >
        {carousel}
      </Swiper>
    </>
  );
}
