"use client";

import {useEffect, useRef, useState} from "react";
import type { CasinoGame } from "@/src/types/casino";
import { ModalComponent } from "@/src/components/ModalComponent/ModalComponent";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import {gaEvent} from "@/src/lib/ga";

const SUPABASE_PUBLIC_URL = "https://yxqgxsxseunohktzuxbm.supabase.co/storage/v1/object/public/casino-assets";

const IMAGE_EXTS = [".webp", ".jpg", ".png"];

export const GameCard = ({ game }: { game: CasinoGame }) => {
    const basePath = `${SUPABASE_PUBLIC_URL}/${game.imageUrl.replace(/\.(webp|jpg|png)$/i, "")}`;
    const iframeWrapperRef = useRef<HTMLDivElement>(null);
    const {t} = useTranslation();

    const [isDemoOpen, setIsDemoOpen] = useState(false);

    const [variantIndex, setVariantIndex] = useState(0);
    const [src, setSrc] = useState(basePath + IMAGE_EXTS[0]);

    const [isMobile, setIsMobile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isDemoOpen) return;

        // ✅ GA event — demo actually started
        gaEvent("demo_play", {
            game_id: game.id,
            game_name: game.title,
            provider: game.provider || "unknown",
            mode: "demo",
        });
    }, [isDemoOpen]);


    useEffect(() => {
        const checkIsMobile = () => setIsMobile(window.innerWidth <= 767);
        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    const handleError = () => {
        if (variantIndex < IMAGE_EXTS.length - 1) {
            const nextIndex = variantIndex + 1;
            setVariantIndex(nextIndex);
            setSrc(basePath + IMAGE_EXTS[nextIndex]);
        } else {
            setSrc("/default-game.png");
        }
    };

    const handleFullscreen = () => {
        if (!iframeWrapperRef.current) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            iframeWrapperRef.current.requestFullscreen();
        }
    };


    const handleCardClick = () => isMobile && setIsModalOpen(true);
    const handlePlay = () => console.log("PLAY:", game.title);
    const handleDemo = () => {
        if (!game.demoUrl) return;

        gaEvent("game_open", {
            game_id: game.id,
            game_name: game.title,
            provider: game.provider || "unknown",
            mode: "demo",
            device: isMobile ? "mobile" : "desktop",
        });

        if (isMobile) {
            window.location.href = game.demoUrl;
        } else {
            setIsDemoOpen(true);
        }
    };


    return (
        <>
            <div className="casino-card" onClick={handleCardClick}>
                <Image
                    src={src}
                    alt={game.title}
                    width={300}
                    height={200}
                    loading="lazy"
                    fetchPriority={'low'}
                    onError={handleError}
                />

                {!isMobile && (
                    <div className="buttons">
                        <h3>{game.title}</h3>
                        {game.description && <p>{game.description}</p>}
                        <button className="gaming" onClick={e => { e.stopPropagation(); handlePlay(); }}>{t('casinoPlay.play')}</button>
                        <button className="demo" onClick={e => { e.stopPropagation(); handleDemo(); }}>{t('casinoPlay.demo')}</button>
                    </div>
                )}
            </div>

            {isMobile && isModalOpen && (
                <ModalComponent title={game.title} onClose={() => setIsModalOpen(false)}>
                    <div className="game-modal-body">
                        <Image src={src} alt={game.title} width={300} height={200} onError={handleError} />
                        {game.description && <p style={{ marginTop: 12 }}>{game.description}</p>}
                        <div className="buttons" style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10 }}>
                            <button className="gaming" onClick={handlePlay}>{t('casinoPlay.play')}</button>
                            <button className="demo" onClick={handleDemo}>{t('casinoPlay.demo')}</button>
                        </div>
                    </div>
                </ModalComponent>
            )}

            {isDemoOpen && !isMobile &&(
                <ModalComponent
                    title={`${game.title}`}
                    onClose={() => setIsDemoOpen(false)}
                >
                    <div
                        ref={iframeWrapperRef}
                        style={{
                            width: "100%",
                            height: "70vh",
                            position: "relative",
                            background: "#000",
                        }}
                    >
                        <button
                            onClick={handleFullscreen}
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
                                zIndex: 10,
                                padding: "6px 10px",
                                background: "rgba(0,0,0,0.6)",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.3)",
                                borderRadius: 6,
                                cursor: "pointer",
                            }}
                        >
                            ⛶
                        </button>
                        <iframe
                            src={game.demoUrl}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        />
                    </div>
                </ModalComponent>
            )}
        </>
    );
};
