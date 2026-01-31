import React, {type RefObject} from "react";
import Image from "next/image";
import {useTranslation} from "react-i18next";

interface UserMenuProps {
    userName?: string;
    balance?: number | string;
    uniqueId?: string;
    showPopover: boolean;
    togglePopover: () => void;
    popoverRef: RefObject<HTMLDivElement | null>;
    onMyCards: () => void;
    onBonuses: () => void;
    onPersonalData: () => void;
    onVerification: () => void;
    onLimits: () => void;
    onLogout: () => void;
    deposit: () => void;
    onWithdraw: () => void;
    onHistory: () => void;
}

const formatBalance = (value: number | string | undefined) => {
    const num = Number(value ?? 0);
    if (isNaN(num)) return "0";
    return num.toLocaleString("de-DE");
};

export const UserMenu = ({
                             userName,
                             balance,
                             uniqueId,
                             showPopover,
                             togglePopover,
                             popoverRef,
                             onMyCards,
                             onBonuses,
                             onPersonalData,
                             onVerification,
                             onLimits,
                             onLogout,
                             deposit,
                             onWithdraw,
                             onHistory,
                         }: UserMenuProps) => {
    const {t} = useTranslation();
    return (
        <li className="profile-title-img">
            <p className="profiles-width">{userName}</p>
            <button className="profiles-width">
                {formatBalance(balance)} {t("money")}
            </button>
            <button className="profile-img" onClick={togglePopover}>
                <a href="#">
                    <i
                        className={`icon ${
                            showPopover ? "arrow-top" : "arrow-down"
                        }`}
                    ></i>
                </a>
                <Image src="/logo-profile.png" alt="" width={100} height={100} />
            </button>

            {showPopover && (
                <div
                    className={`user-popover ${
                        showPopover ? "visible" : ""
                    }`}
                    ref={popoverRef}
                >
                    <h3>ID - {uniqueId ?? "-"}</h3>
                    <ul>
                        <li>
                            <i className="icon card"></i>
                            <button onClick={onMyCards}>
                                {t("myCards")}
                            </button>
                        </li>
                        <li>
                            <i className={'icon deposit'}></i>
                            <button
                                onClick={deposit}
                            >
                                {t("deposit")}
                            </button>
                        </li>
                        <li>
                            <i className={'icon withdraw'}></i>
                            <button
                                onClick={onWithdraw}
                            >
                                {t("withdraw")}
                            </button>
                        </li>
                        <li>
                            <i className="icon history"></i>
                            <button
                                onClick={() => {
                                    onHistory();
                                    togglePopover();
                                }}
                            >
                                {t("history")}
                            </button>
                        </li>

                        <li>
                            <i className="icon notification"></i>
                            <button>{t("notifications")}</button>
                        </li>
                        <li>
                            <i className="icon bonus"></i>
                            <button onClick={onBonuses}>
                                {t("bonuses")}
                            </button>
                        </li>
                        <li>
                            <i className="icon personal"></i>
                            <button onClick={onPersonalData}>
                                {t("personalData")}
                            </button>
                        </li>
                        <li>
                            <i className="icon verification"></i>
                            <button onClick={onVerification}>
                                {t("verification")}
                            </button>
                        </li>
                        <li>
                            <i className="icon limits"></i>
                            <button onClick={onLimits}>
                                {t("limits")}
                            </button>
                        </li>
                        <li>
                            <i className="icon logout"></i>
                            <button onClick={onLogout}>
                                {t("logout")}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </li>
    );
};
