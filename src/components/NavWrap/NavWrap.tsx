'use client';

import {useTranslation} from "react-i18next";
import useBreakpoints from "../../hooks/useBreackPoints";
import React, {useState} from "react";
import {ModalComponent} from "../ModalComponent/ModalComponent";
import {useCasino} from "../CasinoContext/CasinoContext";
import {useRouter} from "next/navigation";


export const NavWrap = () => {
    const {t} = useTranslation();
    const {setShowProviders} = useCasino();
    const {isTabletLarge} = useBreakpoints();
    const [openTabsList, setOpenTabsList] = useState(false);
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowProviders(true);
        setOpenTabsList(false);
    };

    return <>
        {isTabletLarge ? (
            <section style={{backgroundColor: "#140854"}} className={'nav-wrap-bottom'}>
                <nav>
                    <ul>
                        <li>
                            <button onClick={() => {
                                setOpenTabsList(!openTabsList)
                            }}>
                                <i className={'icon menu'}></i>
                                Menu
                            </button>
                        </li>
                        <li>
                            <button onClick={handleClick}>
                                <i className={'icon casino'}></i>
                                {t('casino')}
                            </button>
                        </li>
                        <li className={'deposit-li'}>
                            <span className={'wallet-btn'} onClick={() => router.push('/profile/wallet')}>
                                <img src="/deposit.svg" alt="wallet icon" />
                            </span>
                            <button className={'deposit-text'}>Լիցքավորում</button>
                        </li>
                        <li>
                            <button>
                                <i className={'icon live-casino'}></i>
                                {t('liveCasino')}
                            </button>
                        </li>
                        <li>
                            <button>
                                <i className={'icon balloon'}></i>
                                {t('balloon')}
                            </button>
                        </li>
                    </ul>
                </nav>
                {openTabsList && (
                    <ModalComponent title={''} onClose={() => setOpenTabsList(false)}>
                        <div className="tabs-list">
                            <ul>
                                <li>
                                    <a href="#" onClick={handleClick}>
                                        {t("casino")}
                                    </a>
                                </li>
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
                )
                }
            </section>
        ) : null}
    </>
}