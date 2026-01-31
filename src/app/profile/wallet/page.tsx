"use client";

import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";
import {useCasino} from "@/src/components/CasinoContext/CasinoContext";
import {supabase} from "@/src/hooks/supabaseClient";
import Deposit from "@/src/app/profile/Deposit";
import MyBalance from "@/src/app/profile/MyBalance";
import {AttachCard} from "@/src/components/AttachCard/AttachCard";
import {BonusDetails} from "@/src/components/BonusDetails/BonusDetails";
import {useCallback, useEffect, useState} from "react";
import useBreakpoints from "@/src/hooks/useBreackPoints";
import Withdraw from "@/src/app/profile/wallet/Withdraw";
import {TransactionHistory} from "@/src/components/TransactionHistory/TransactionHistory";
import {useBalance} from "@/src/hooks/useBalance";
import {useBalanceRealtime} from "@/src/hooks/useBalanceRealtime";
import Image from "next/image";

export default function Balance() {
    const [uniqueId, setUniqueId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const router = useRouter();
    const {t} = useTranslation();
    const {isDesktop, isTablet} = useBreakpoints();

    const {
        openAttachCard,
        setOpenAttachCard,
        openBonuses,
        setOpenBonuses,
        showBalance,
        setShowBalance,
        showDeposit,
        setShowDeposit,
        showAttachCard,
        setShowAttachCard,
        setShowCardInfo,
        setShowMoreInfo,
        showWithdraw,
        setShowWithdraw,
        showHistory,
        setShowHistory,
        showCardInfo,
    } = useCasino();

    const {balance, fetchBalance} = useBalance();

    useBalanceRealtime(userId, fetchBalance);

    const generateAndSaveUniqueId = useCallback(
        async (uid: string): Promise<string | null> => {
            let attempts = 0;

            while (attempts < 5) {
                const newId = Math.floor(
                    10000000 + Math.random() * 90000000
                ).toString();

                const {data: existingUser} = await supabase
                    .from("users")
                    .select("user_id")
                    .eq("unique_id", newId)
                    .maybeSingle();

                if (!existingUser) {
                    const {error} = await supabase
                        .from("users")
                        .update({unique_id: newId})
                        .eq("user_id", uid);

                    if (!error) return newId;
                }

                attempts++;
            }

            return null;
        },
        []
    );

    useEffect(() => {
        if (openAttachCard) {
            setShowAttachCard(true);
            setOpenAttachCard(false);
        }
    }, [openAttachCard, setOpenAttachCard, setShowAttachCard]);

    useEffect(() => {
        const init = async () => {
            const {data: sessionData} = await supabase.auth.getSession();
            const uid = sessionData?.session?.user?.id;
            if (!uid) return;

            setUserId(uid);

            await new Promise(r => setTimeout(r, 0));

            await fetchBalance();

            const {data} = await supabase
                .from("users")
                .select("unique_id, first_name")
                .eq("user_id", uid)
                .maybeSingle();

            if (!data) return;

            let uId = data.unique_id;
            if (!uId) uId = await generateAndSaveUniqueId(uid);

            setUniqueId(uId);
            setUsername(data.first_name ?? "User");
        };

        void init();
    }, [fetchBalance, generateAndSaveUniqueId]);


    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="balance-info">
            <div className="users-welcome">
                <a href="">
                    <Image src={"/logo-profile.png"} alt="profile" width={48} height={48}/>
                </a>
                <div>
                    <h2>{t("greeting")} {username}</h2>
                    <p>ID - {uniqueId}</p>
                </div>
            </div>

            <div className="wallet-info">
                <ul>
                    <li>
                        {t("balance")}
                        <p>{balance.toLocaleString("de-DE")} {t("money")}</p>
                    </li>
                    <li>
                        {t("bonusBalance")}
                        <p>0 {t("money")}</p>
                    </li>
                </ul>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px"}}>
                {!isTablet ? (
                    <div className="balance-info-item">
                        <div className="all-infos">
                            <ul>
                                <li>
                                    <button onClick={() => {
                                        setShowBalance(true);
                                        setShowDeposit(false);
                                        setShowHistory(false);
                                        setShowAttachCard(false);
                                        setOpenBonuses(false);
                                        setShowWithdraw(false);
                                    }}>
                                        <i className={"icon balance"}></i>
                                        {!isDesktop ? t("myBalance") : null}
                                    </button>
                                </li>

                                <li>
                                    <button onClick={() => {
                                        setShowDeposit(true);
                                        setShowBalance(false);
                                        setShowAttachCard(false);
                                        setOpenBonuses(false);
                                        setShowWithdraw(false);
                                        setShowHistory(false);
                                    }}>
                                        <i className={"icon deposit"}></i>
                                        {!isDesktop ? t("deposit") : null}
                                    </button>
                                </li>

                                <li>
                                    <button onClick={() => {
                                        setShowDeposit(false);
                                        setShowBalance(false);
                                        setShowAttachCard(false);
                                        setOpenBonuses(false);
                                        setShowWithdraw(true);
                                        setShowHistory(false);
                                    }}>
                                        <i className={"icon withdraw"}></i>
                                        {!isDesktop ? t("withdraw") : null}
                                    </button>
                                </li>

                                <li>
                                    <button onClick={() => {
                                        setShowDeposit(false);
                                        setShowBalance(false);
                                        setShowAttachCard(false);
                                        setOpenBonuses(false);
                                        setShowWithdraw(false);
                                        setShowHistory(true);
                                    }}>
                                        <i className={'icon history'}></i>
                                        {!isDesktop ? t("history") : null}
                                    </button>
                                </li>

                                <li>
                                    <button onClick={() => {
                                        setShowAttachCard(true);
                                        setShowBalance(false);
                                        setShowDeposit(false);
                                        setShowWithdraw(false);
                                        setShowHistory(false);
                                    }}>
                                        <i className={"icon card"}></i>
                                        {!isDesktop ? t("myCards") : null}
                                    </button>
                                </li>

                                <li>
                                    <button onClick={handleLogout}>
                                        <i className={"icon log-out"}></i>
                                        {!isDesktop ? t("logout") : null}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : null}

                <div className="balance-info-item-history">
                    {showDeposit && !showAttachCard && (
                        <div className="cards-info">
                            <ul>
                                <li>
                                    <button className={"cards-btn"} onClick={() => {
                                        setShowDeposit(true);
                                        setShowBalance(false);
                                        setShowAttachCard(false);
                                        setShowCardInfo("card");
                                        setShowMoreInfo(false);
                                        setShowWithdraw(false);
                                        setShowHistory(false);
                                    }}>
                                        <div className={"users-cards"}>
                                            <div className={"users-cards-img"}>
                                                <Image src={"/masterCard.png"} alt="mastercard" width={48} height={48}/>
                                            </div>
                                            <p>{t("card")}</p>
                                        </div>
                                    </button>
                                    {showDeposit && isTablet && showCardInfo === "card" && (
                                        <Deposit onClose={() => setShowDeposit(false)}
                                                 onBalanceUpdate={() => fetchBalance()}
                                                 mode="card"
                                        />
                                    )}
                                </li>

                                <li>
                                    <button className={"cards-btn"} onClick={() => {
                                        setShowDeposit(true);
                                        setShowWithdraw(false);
                                        setShowBalance(false);
                                        setShowAttachCard(false);
                                        setShowCardInfo("idram");
                                        setShowMoreInfo(false);
                                        setShowHistory(false);
                                    }}>
                                        <div className={"users-cards"}>
                                            <div className={"users-cards-img"}>
                                                <Image src={"/idBank.png"} alt="idram" width={48} height={48}/>
                                            </div>
                                            <p>Idram / idBank</p>
                                        </div>
                                    </button>
                                    {showDeposit && isTablet && showCardInfo === "idram" && (
                                        <Deposit onClose={() => setShowDeposit(false)}
                                                 onBalanceUpdate={() => fetchBalance()}
                                                 mode={'idram'}
                                        />
                                    )}
                                </li>
                                <li>
                                    <button className={"cards-btn"}>
                                        <div className={"users-cards"}>
                                            <div className={"users-cards-img"}>
                                                <Image src={"/telCell.png"} alt="telcell" width={48} height={48}/>
                                            </div>
                                            <p>TelCell Wallet</p>
                                        </div>
                                    </button>
                                </li>
                                <li>
                                    <button className={"cards-btn"}>
                                        <div className={"users-cards"}>
                                            <div className={"users-cards-img"}>
                                                <Image src={"/easyPay.png"} alt="easy" width={48} height={48}/>
                                            </div>
                                            <p>Easy Wallet</p>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                    {showWithdraw && <Withdraw onCloseAction={() => setShowWithdraw(false)}/>}
                    {showHistory && <TransactionHistory/>}

                    <>

                        {showDeposit && !isTablet && (
                            <Deposit
                                mode={showCardInfo as "card" | "idram" | "telcell"}
                                onClose={() => setShowDeposit(false)}
                                onBalanceUpdate={() => fetchBalance()}
                            />
                        )}
                        {showBalance && <MyBalance balance={balance}/>}
                        {showAttachCard && <AttachCard onClose={() => setShowAttachCard(false)}/>}
                        {openBonuses && <BonusDetails onClose={() => setOpenBonuses(false)}/>}
                    </>

                </div>
            </div>
        </div>
    );
}
