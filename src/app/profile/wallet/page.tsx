"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useCasino } from "@/src/components/CasinoContext/CasinoContext";
import { supabase } from "@/src/hooks/supabaseClient";
import Deposit from "@/src/app/profile/Deposit";
import MyBalance from "@/src/app/profile/MyBalance";
import { AttachCard } from "@/src/components/AttachCard/AttachCard";
import { BonusDetails } from "@/src/components/BonusDetails/BonusDetails";
import { useCallback, useEffect, useState } from "react";
import useBreakpoints from "@/src/hooks/useBreackPoints";
import Withdraw from "@/src/app/profile/wallet/Withdraw";
import { TransactionHistory } from "@/src/components/TransactionHistory/TransactionHistory";
import { useBalance } from "@/src/hooks/useBalance";
import { useBalanceRealtime } from "@/src/hooks/useBalanceRealtime";
import Image from "next/image";

// Նոր ներմուծված կոմպոնենտները
import { UserInfo } from "./UserInfo";
import { WalletSummary } from "./WalletSummary";
import {BalanceSidebar} from "@/src/app/profile/wallet/BalanceSlideBar";

export default function Balance() {
    const [uniqueId, setUniqueId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const router = useRouter();
    const { t } = useTranslation();
    const { isDesktop, isTablet } = useBreakpoints();
    const { balance, fetchBalance } = useBalance();

    const {
        openAttachCard, setOpenAttachCard, openBonuses, setOpenBonuses,
        showBalance, showDeposit, setShowDeposit,
        showAttachCard, setShowAttachCard, setShowCardInfo,
        showWithdraw, setShowWithdraw, showHistory, setShowHistory, showCardInfo,
    } = useCasino();

    useBalanceRealtime(userId, fetchBalance);

    const generateAndSaveUniqueId = useCallback(async (uid: string) => {
        let attempts = 0;
        while (attempts < 5) {
            const newId = Math.floor(10000000 + Math.random() * 90000000).toString();
            const { data: existingUser } = await supabase.from("users").select("user_id").eq("unique_id", newId).maybeSingle();
            if (!existingUser) {
                const { error } = await supabase.from("users").update({ unique_id: newId }).eq("user_id", uid);
                if (!error) return newId;
            }
            attempts++;
        }
        return null;
    }, []);

    useEffect(() => {
        const init = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            const uid = sessionData?.session?.user?.id;
            if (!uid) return;
            setUserId(uid);
            await fetchBalance();
            const { data } = await supabase.from("users").select("unique_id, first_name").eq("user_id", uid).maybeSingle();
            if (!data) return;
            const uId = data.unique_id || await generateAndSaveUniqueId(uid);
            setUniqueId(uId);
            setUsername(data.first_name ?? "User");
        };
        init().then(r => r);
    }, [fetchBalance, generateAndSaveUniqueId]);

    useEffect(() => {
        if (openAttachCard) { setShowAttachCard(true); setOpenAttachCard(false); }
    }, [openAttachCard, setOpenAttachCard, setShowAttachCard]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="balance-info">
            <UserInfo username={username} uniqueId={uniqueId} />
            <WalletSummary balance={balance} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                {!isTablet && <BalanceSidebar isDesktop={isDesktop} handleLogout={handleLogout} />}

                <div className="balance-info-item-history">
                    {showDeposit && !showAttachCard && (
                        <div className="cards-info">
                            <ul>
                                {/* Card Payment Option */}
                                <li>
                                    <button className="cards-btn" onClick={() => { setShowCardInfo("card"); setShowDeposit(true); setShowWithdraw(false); setShowHistory(false); }}>
                                        <div className="users-cards">
                                            <div className="users-cards-img"><Image src="/masterCard.webp" alt="mastercard" width={48} height={48} /></div>
                                            <p>{t("card")}</p>
                                        </div>
                                    </button>
                                    {showDeposit && isTablet && showCardInfo === "card" && (
                                        <Deposit onClose={() => setShowDeposit(false)} onBalanceUpdate={fetchBalance} mode="card" />
                                    )}
                                </li>
                                {/* Idram Option */}
                                <li>
                                    <button className="cards-btn" onClick={() => { setShowCardInfo("idram"); setShowDeposit(true); setShowWithdraw(false); setShowHistory(false); }}>
                                        <div className="users-cards">
                                            <div className="users-cards-img"><Image src="/idBank.webp" alt="idram" width={48} height={48} /></div>
                                            <p>Idram / idBank</p>
                                        </div>
                                    </button>
                                    {showDeposit && isTablet && showCardInfo === "idram" && (
                                        <Deposit onClose={() => setShowDeposit(false)} onBalanceUpdate={fetchBalance} mode="idram" />
                                    )}
                                </li>
                                {/* TelCell & EasyPay (Static for now as in original) */}
                                <li>
                                    <button className="cards-btn">
                                        <div className="users-cards">
                                            <div className="users-cards-img"><Image src="/telCell.webp" alt="telcell" width={48} height={48} /></div>
                                            <p>TelCell Wallet</p>
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {showWithdraw && <Withdraw onCloseAction={() => setShowWithdraw(false)} />}
                    {showHistory && <TransactionHistory />}

                    {showDeposit && !isTablet && (
                        <Deposit mode={showCardInfo as any} onClose={() => setShowDeposit(false)} onBalanceUpdate={fetchBalance} />
                    )}
                    {showBalance && <MyBalance balance={balance} />}
                    {showAttachCard && <AttachCard onClose={() => setShowAttachCard(false)} />}
                    {openBonuses && <BonusDetails onClose={() => setOpenBonuses(false)} />}
                </div>
            </div>
        </div>
    );
}