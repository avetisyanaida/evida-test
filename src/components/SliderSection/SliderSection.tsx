'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
    {
        id: 1,
        desktop: "/bonus-camp.png",
        mobile: "/bonus-camp.png",
        title: "Բարի գալուստ մեր կայք",
    },
    {
        id: 2,
        desktop: "/bonus-camp1.png",
        mobile: "/bonus-camp1.png",
        title: "Խաղա ու շահիր",
    },
    {
        id: 3,
        desktop: "/bonus-camp2.png",
        mobile: "/bonus-camp2.png",
        title: "Մասնակցիր մրցաշարերին",
    },
];

export const SliderSection = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="hero-slider">
            {slides.map((slide, i) => (
                <div
                    key={slide.id}
                    className={`hero-slide ${i === index ? "active" : ""}`}
                >
                    <Image
                        src={slide.desktop}
                        alt={slide.title}
                        fill
                        priority={i === 0}
                        sizes="(max-width: 768px) 100vw, 1920px"
                        className="hero-image"
                    />
                </div>
            ))}

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
