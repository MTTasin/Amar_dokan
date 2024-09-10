import { Carousel } from "@mantine/carousel";
import { useRef } from "react";
import Autoplay from 'embla-carousel-autoplay';


export default function Carou() {
    const autoplay = useRef(Autoplay({ delay: 2000 }));
  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <Carousel
        className={`text-center text-3xl font-bold text-white` }
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        height="80vh"
        slideGap="lg"
        controlSize={20}
        loop
        withIndicators
        style={{ flex: 1 }}
      >
        <Carousel.Slide className="bg-primary">1</Carousel.Slide>
        <Carousel.Slide className="bg-secondary">2</Carousel.Slide>
        <Carousel.Slide className="bg-accent">3</Carousel.Slide>
        <Carousel.Slide className="bg-neutral">4</Carousel.Slide>
        <Carousel.Slide className="bg-info">5</Carousel.Slide>
        <Carousel.Slide className="bg-success">6</Carousel.Slide>
        <Carousel.Slide className="bg-warning">7</Carousel.Slide>
        <Carousel.Slide className="bg-error">8</Carousel.Slide>
        <Carousel.Slide className="bg-gray">9</Carousel.Slide>
        <Carousel.Slide className="bg-black">10</Carousel.Slide>
      </Carousel>
    </div>
  );
}
