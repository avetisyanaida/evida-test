'use client';

import {useTranslation} from "react-i18next";
import React from "react";
import useBreakpoints from "../../hooks/useBreackPoints";
import {useCasino} from "@/src/components/CasinoContext/CasinoContext";
import {useRouter} from "next/navigation";

interface HeaderMenuItem {
    key: string;
    provider?: string;
}
const HEADER_MENU: HeaderMenuItem[] = [
    { key: "casino", provider: "allGames" },
    { key: "liveCasino" },
    { key: "tvGames" },
    { key: "casinoTour" },
    { key: "blot" },
    { key: "balloon" },
    { key: "tournaments" },
    { key: "promo" },
];

export const HeaderMenu = () => {
    const {setShowProviders} = useCasino();
    const {t} = useTranslation();
    const {isTabletLarge} = useBreakpoints();
    const router = useRouter();

    const handleClickCasino = (provider?: string) => {
        if (!provider) return
        setShowProviders(true);
        router.push(`?provider=${provider}`, {scroll: false});
    };

    if (isTabletLarge) return null;

    return (
        <div className="header-menu">
            <div className="container">
                <ul>
                    {HEADER_MENU.map((item) => (
                        <li key={item.key}>
                            <button onClick={() => handleClickCasino(item.provider)}>
                                {t(item.key)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
