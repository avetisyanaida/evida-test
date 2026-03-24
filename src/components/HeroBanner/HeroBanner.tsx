"use client";

import Image from "next/image";
import styles from "./HeroBanner.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

export const HeroBanner = () => {
    return (
        <section className={styles.hero}>
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 3000 }}
                loop={true}
                slidesPerView={1}
            >
                <SwiperSlide>
                    <div className={styles.slide}>
                        <Image src="/bonus-camp.webp" alt="slide1" fill />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className={styles.slide}>
                        <Image src="/bonus-camp2.webp" alt="slide2" fill />
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className={styles.slide}>
                        <Image src="/bonus-camp3.webp" alt="slide3" fill />
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    );
};