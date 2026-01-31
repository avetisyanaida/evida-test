"use client";

import {useState, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import useBreakpoints from "../../hooks/useBreackPoints";
import {useRouter, useSearchParams} from "next/navigation";
import {useCasino} from "@/src/components/CasinoContext/CasinoContext";
import {supabase} from "@/src/hooks/supabaseClient";
import {LangSwitcher} from "@/src/components/SwitcherComponent/Switcher";
import {AuthButtons} from "./AuthButtons";
import {UserMenu} from "./UserMenu";
import Image from "next/image";

interface HeaderProps {
    isLoggedIn: boolean;

    userName?: string;
    uniqueId?: string;
    isLimited?: boolean;

    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onDepositClick?: () => void;
}

export const Header = ({
                           isLoggedIn,
                           onLoginClick,
                           onSignupClick,
                           onDepositClick,
                       }: HeaderProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {t} = useTranslation();
    const {isTabletLarge, isMobile} = useBreakpoints();

    const {
        setWalletMode,
        setOpenAttachCard,
        setOpenBonuses,
        setShowAttachCard,
        setShowBalance,
        setShowDeposit,
        setShowWithdraw,
        setShowHistory
    } = useCasino();

    const [showPopover, setShowPopover] = useState(false);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    const [balance, setBalance] = useState<number>(0);
    const [userName, setUserName] = useState<string>();
    const [uniqueId, setUniqueId] = useState<string>();

    useEffect(() => {
        if (!isLoggedIn) return;

        let cancelled = false;

        (async () => {
            const {data: session} = await supabase.auth.getSession();
            const userId = session?.session?.user?.id;
            if (!userId || cancelled) return;

            const {data} = await supabase
                .from("users")
                .select("balance, first_name, unique_id")
                .eq("user_id", userId)
                .maybeSingle();

            if (data && !cancelled) {
                setBalance(Number(data.balance ?? 0));
                setUserName(data.first_name ?? "User");
                setUniqueId(data.unique_id ?? "-");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn, searchParams]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setShowPopover(false);
            }
        };

        if (showPopover) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopover]);

    const togglePopover = () => setShowPopover((prev) => !prev);

    const handleDeposit = () => {
        onDepositClick?.();
        setWalletMode(true);
        setShowPopover(false);
        setShowAttachCard(false);
        setOpenAttachCard(false);
        setOpenBonuses(false);
        setShowBalance(false);
        setShowDeposit(true);
        setShowHistory(false);
        router.push("/profile/wallet");
    };

    const onPersonalData = () => {
        setShowPopover(false);
        router.push("/profile/personal-details")
    }
    const onVerification = () => {
        setShowPopover(false);
        router.push("/profile/verification")
    }
    const onLimits = () => {
        setShowPopover(false);
        router.push("/profile/limited")
    }

    const onWithdraw = () => {
        setWalletMode(false);
        setShowWithdraw(true);
        setShowDeposit(false);
        setShowBalance(false);
        setShowAttachCard(false);
        setShowPopover(false);
        setShowHistory(false);
        router.push("/profile/wallet");
    };


    const handleMenuHover = () => {
        window.scrollTo(0, 0);
        router.push(isLoggedIn ? "/profile" : "/");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };
    const handleMyCards = () => {
        setWalletMode(true);
        setOpenAttachCard(true);
        setOpenBonuses(false);
        setShowDeposit(false);
        setShowBalance(false);
        setTimeout(() => router.push("/profile/wallet"), 10);
        setShowPopover(false);
        setShowHistory(false);
    };

    const handleBonuses = () => {
        setOpenBonuses(true);
        setShowAttachCard(false);
        setShowBalance(false);
        setShowDeposit(false);
        setShowPopover(false);
        setShowHistory(false);
        setShowWithdraw(false);
        router.push("/profile/wallet");
    };

    const handleHistory = () => {
        setShowHistory(true);
        setShowDeposit(false);
        setShowWithdraw(false);
        setShowBalance(false);
        setShowAttachCard(false);
        setOpenBonuses(false);
        router.push("/profile/wallet");
    }

    return (
        <div className="container">
            <div className="main-block-item">
                <button className="logo-profile" onClick={handleMenuHover}>
                    <Image
                        src={!isMobile ? "/logo2.png" : "/logo.png"}
                        alt="logo"
                        width={100}
                        height={100}
                    />
                </button>

                {!isTabletLarge ? (
                    <ul className="user-info">
                        {!isLoggedIn ? (
                            <AuthButtons
                                onLoginClick={onLoginClick}
                                onSignupClick={onSignupClick}
                                t={t}
                            />
                        ) : (
                            <>
                                <li><i className="icon coupon"></i></li>
                                <li><i className="icon promotion"></i></li>

                                <li className="profile-deposit">
                                    <button className={'user-info-btn'} onClick={handleDeposit}>
                                        {t("deposit")}
                                    </button>
                                </li>
                                <UserMenu
                                    userName={userName}
                                    balance={balance}
                                    uniqueId={uniqueId}
                                    showPopover={showPopover}
                                    togglePopover={togglePopover}
                                    popoverRef={popoverRef}
                                    onMyCards={handleMyCards}
                                    onBonuses={handleBonuses}
                                    onPersonalData={onPersonalData}
                                    onVerification={onVerification}
                                    onLimits={onLimits}
                                    onLogout={handleLogout}
                                    deposit={handleDeposit}
                                    onWithdraw={onWithdraw}
                                    onHistory={handleHistory}
                                />
                            </>
                        )}
                        <li>
                            <LangSwitcher/>
                        </li>
                    </ul>
                ) : (
                    <ul className="user-info">
                        {!isLoggedIn ? (
                                <AuthButtons
                                    onLoginClick={onLoginClick}
                                    onSignupClick={onSignupClick}
                                    t={t}
                                />
                        ) : (
                            <>
                                <UserMenu
                                    userName={userName}
                                    balance={balance}
                                    uniqueId={uniqueId}
                                    showPopover={showPopover}
                                    togglePopover={togglePopover}
                                    popoverRef={popoverRef}
                                    onMyCards={handleMyCards}
                                    onBonuses={handleBonuses}
                                    onPersonalData={onPersonalData}
                                    onVerification={onVerification}
                                    onLimits={onLimits}
                                    onLogout={handleLogout}
                                    deposit={handleDeposit}
                                    onWithdraw={onWithdraw}
                                    onHistory={handleHistory}
                                />
                                <LangSwitcher/>
                            </>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};
