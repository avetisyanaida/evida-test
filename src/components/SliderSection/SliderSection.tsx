'use client';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";

export const SliderSection = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    const slides = [
        { id: 1, image: "/bonus-camp.png", title: "Բարի գալուստ մեր կայք" },
        { id: 2, image: "/bonus-camp2.png", title: "Խաղա ու շահիր" },
        { id: 3, image: "/bonus-camp3.png", title: "Մասնակցիր մրցաշարերին" },
    ];

    return (
        <section className="slider-section">
            <Slider {...settings} className="slider">
                {slides.map(slide => (
                    <div key={slide.id} className="slide">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            loading="lazy"
                        />
                        {/* <h3>{slide.title}</h3> */}
                    </div>
                ))}
            </Slider>
        </section>
    );
};
