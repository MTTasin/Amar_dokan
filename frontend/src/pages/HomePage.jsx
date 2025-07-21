import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import Spinner from '../components/Spinner.jsx';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Sub-components for the HomePage ---

const HeroCarousel = ({ slides }) => (
  <section className="w-full h-[70vh] md:h-[90vh] bg-gray-200">
    {/* Custom styles for the Swiper navigation and pagination to match the theme */}
    <style>{`
      .hero-carousel .swiper-button-next,
      .hero-carousel .swiper-button-prev {
        color: #F36523; /* brand-orange */
        background-color: rgba(255, 255, 255, 0.6);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        transition: background-color 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .hero-carousel .swiper-button-next:hover,
      .hero-carousel .swiper-button-prev:hover {
        background-color: rgba(255, 255, 255, 0.9);
      }
      .hero-carousel .swiper-button-next::after,
      .hero-carousel .swiper-button-prev::after {
        font-size: 24px;
        font-weight: bold;
      }
      .hero-carousel .swiper-pagination-bullet {
        background-color: rgba(255, 255, 255, 0.7);
        width: 10px;
        height: 10px;
        opacity: 1;
        transition: background-color 0.3s ease;
      }
      .hero-carousel .swiper-pagination-bullet-active {
        background-color: #F36523; /* brand-orange */
      }
    `}</style>
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={slides.length > 1}
      className="h-full hero-carousel" // Added class for scoping styles
    >
      {slides.map((slide) => (
        <SwiperSlide 
          key={slide.id} 
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.background_image_url})` }}
        >
          {/* <img src={slide.background_image_url} alt="" /> */}
          <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white p-4 max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-anton uppercase tracking-wider">{slide.title}</h1>
              <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg">{slide.subtitle}</p>
              <Link to={slide.button_link} className="mt-8 bg-brand-orange text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 inline-block">
                {slide.button_text}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

const FeaturedCategories = ({ categories }) => (
  <section className="py-12 md:py-16 bg-background-light">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-anton text-center text-text-primary mb-12">Featured Categories</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/shop?category=${category.slug}`} 
            className="group relative block overflow-hidden rounded-lg aspect-[4/5] bg-cover bg-center"
            style={{ backgroundImage: `url(${category.image_url || 'https://placehold.co/400x500/cccccc/334155?text=Category'})` }}
          >
            <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-20">
              <h3 className="text-xl md:text-2xl text-white font-anton uppercase tracking-widest text-center px-2">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProducts = ({ products }) => (
  <section className="py-12 md:py-16 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-anton text-center text-text-primary mb-12">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  </section>
);


const LatestProducts = ({ products }) => (
    <section className="py-12 md:py-16 bg-background-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-anton text-center text-text-primary mb-12">Latest Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    </section>
);

const Newsletter = () => (
  <section className="py-16 md:py-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')" }}>
    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h2 className="text-3xl md:text-4xl font-anton text-white">JOIN THE INNER CIRCLE</h2>
      <p className="text-white mt-2 mb-6 max-w-lg mx-auto">Get exclusive access to new drops, special offers, and style inspiration.</p>
      <form className="max-w-md mx-auto flex">
        <input type="email" placeholder="Enter your email address" className="w-full px-4 py-3 rounded-l-lg border-none text-text-primary focus:ring-2 focus:ring-brand-orange" required />
        <button type="submit" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-r-lg hover:bg-opacity-90 transition-colors">Subscribe</button>
      </form>
    </div>
  </section>
);

const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const VideoCtaSection = ({ videoUrl }) => {
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    return (
        <section className="py-16 md:py-20 bg-gray-800 text-white" style={{backgroundImage: `linear-gradient(rgba(31, 41, 55, 0.8), rgba(31, 41, 55, 0.8)), url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-anton">WATCH OUR BRAND STORY</h2>
                <p className="mt-4 max-w-2xl mx-auto">See the passion and craftsmanship that goes into every piece we create.</p>
                <div className="mt-8">
                    <div className="aspect-video max-w-3xl mx-auto bg-black rounded-lg shadow-lg">
                        {embedUrl ? ( <iframe width="100%" height="100%" src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-lg"></iframe> ) : ( <div className="flex items-center justify-center h-full"><p className="text-gray-400">Video not available.</p></div> )}
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Main HomePage Component ---

const HomePage = () => {
  const { items: allProducts, listStatus } = useSelector((state) => state.products);
  const { items: allCategories } = useSelector((state) => state.categories);
  const { config: siteConfig } = useSelector((state) => state.site);
  const { slides: heroSlides, status: heroStatus } = useSelector((state) => state.hero);

  const {featured: featuredProducts } = useSelector((state) => state.products); // Get featuredProducts from the new state
  const featuredCategories = useMemo(() => allCategories.filter(c => c.is_featured).slice(0, 4), [allCategories]);
  const latestProducts = useMemo(() => [...allProducts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8), [allProducts]);
  
  if (listStatus === 'loading' || heroStatus === 'loading') {
    return <Spinner />;
  }

  console.log(featuredProducts)

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <FeaturedCategories categories={featuredCategories} />
      <FeaturedProducts products={featuredProducts} />
      <VideoCtaSection videoUrl={siteConfig.brand_video_url} />
      <LatestProducts products={latestProducts} />
      <Newsletter />
    </>
  );
};

HeroCarousel.defaultProps = { slides: [] };
FeaturedCategories.defaultProps = { categories: [] };
FeaturedProducts.defaultProps = { products: [] };
LatestProducts.defaultProps = { products: [] };

export default HomePage;
