'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import useBreakpoints from "@/src/hooks/useBreackPoints";

const slides = [
    {
        id: 1,
        desktop: "/bonus-camp.webp",
        mobile: "/bonus-camp-mobile.webp",
        title: "Բարի գալուստ մեր կայք",
    },
    {
        id: 2,
        desktop: "/bonus-camp3.webp",
        mobile: "/bonus-camp3-mobile.webp",
        title: "Խաղա ու շահիր",
    },
    {
        id: 3,
        desktop: "/bonus-camp2.webp",
        mobile: "/bonus-camp2-mobile.webp",
        title: "Մասնակցիր մրցաշարերին",
    },
];

export const SliderSection = () => {
    const [index, setIndex] = useState(0);
    const {isMobile} = useBreakpoints();

    useEffect(() => {
        if (isMobile) return;

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [isMobile]);


    const slide = slides[index];

    return (
        <section className="hero-slider">
            <div className="hero-slide active">
                <Image
                    key={slide.id}
                    src={isMobile ? slide.mobile : slide.desktop}
                    alt={slide.title}
                    fill
                    priority
                    sizes={isMobile ? "100vw" : "1920px"}
                    className="hero-image"
                />
            </div>

            {/* dots */}
            <div className="hero-dots">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        className={i === index ? "active" : ""}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </section>
    );
};
