'use client';

import { useTranslation } from "react-i18next";
import useBreakpoints from "../../hooks/useBreackPoints";
import React, { useEffect, useState } from "react";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { useCasino } from "../CasinoContext/CasinoContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/src/hooks/supabaseClient";

interface Props {
    onLoginClick?: () => void;
}

export const NavWrap = ({onLoginClick}: Props) => {
    const { t } = useTranslation();
    const { setShowProviders } = useCasino();
    const { isTabletLarge } = useBreakpoints();
    const [openTabsList, setOpenTabsList] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setIsLoggedIn(!!data.user);
        });
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowProviders(true);
        setOpenTabsList(false);
    };

    const handleDepositClick = () => {
        if (isLoggedIn) {
            router.push("/profile/wallet");
        } else {
            onLoginClick?.();
        }
    };


    return (
        <>
            {isTabletLarge ? (
                <section style={{ backgroundColor: "#140854" }} className="nav-wrap-bottom">
                    <nav>
                        <ul>
                            <li>
                                <button onClick={() => setOpenTabsList(!openTabsList)}>
                                    <i className="icon menu"></i>
                                    Menu
                                </button>
                            </li>

                            <li>
                                <button onClick={handleClick}>
                                    <i className="icon casino"></i>
                                    {t('casino')}
                                </button>
                            </li>

                            {/* 👇 ԱՅՍ ՄԱՍՆ Է ՓՈԽՎՈՒՄ */}
                            <li className="deposit-li">
                                <button className="wallet-btn" onClick={handleDepositClick}>
                                    <Image
                                        src={isLoggedIn ? "/deposit.svg" : "/deposit-logo2.png"}
                                        alt="wallet icon"
                                        width={100}
                                        height={100}
                                    />
                                </button>

                                <button className="deposit-text" onClick={handleDepositClick}>
                                    {isLoggedIn ? t("deposit") : t("login")}
                                </button>
                            </li>

                            <li>
                                <button>
                                    <i className="icon live-casino"></i>
                                    {t('liveCasino')}
                                </button>
                            </li>

                            <li>
                                <button>
                                    <i className="icon balloon"></i>
                                    {t('balloon')}
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {openTabsList && (
                        <ModalComponent title={''} onClose={() => setOpenTabsList(false)}>
                            <div className="tabs-list">
                                <ul>
                                    <li><a href="#" onClick={handleClick}>{t("casino")}</a></li>
                                    <li><a href="#">{t("liveCasino")}</a></li>
                                    <li><a href="#">{t("tvGames")}</a></li>
                                    <li><a href="#">{t("casinoTour")}</a></li>
                                    <li><a href="#">{t("blot")}</a></li>
                                    <li><a href="#">{t("balloon")}</a></li>
                                    <li><a href="#">{t("tournaments")}</a></li>
                                    <li><a href="#">{t("promo")}</a></li>
                                </ul>
                            </div>
                        </ModalComponent>
                    )}
                </section>
            ) : null}
        </>
    );
};
