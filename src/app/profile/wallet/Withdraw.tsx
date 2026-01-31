"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";
import { CustomSelect } from "@/src/components/ui/CustomSelect";
import { toast } from "react-toastify";

interface SavedCard {
    id: string;
    brand: string;
    last4: string;
}

type WithdrawMethod = "card" | "idram" | "telcell";

export default function Withdraw({
                                     onCloseAction,
                                 }: {
    onCloseAction: () => void;
}) {
    const { t } = useTranslation();

    const withdrawMethodOptions: {
        value: WithdrawMethod;
        label: string;
    }[] = [
        { value: "card", label: t("withdrawMethods.card") },
        { value: "idram", label: t("withdrawMethods.idram") },
        { value: "telcell", label: t("withdrawMethods.telcell") },
    ];

    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<WithdrawMethod>("card");
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) return;

            const { data } = await supabase
                .from("cards")
                .select("id, brand, last4")
                .eq("user_id", userData.user.id);

            setCards(data || []);
            setSelectedCardId(data?.[0]?.id ?? null);
        })();
    }, []);

    const submitWithdraw = async () => {
        if (loading) return;

        const { data: session } = await supabase.auth.getSession();
        const userId = session?.session?.user?.id;

        if (!userId) {
            toast.error(t("withdrawErrors.notLoggedIn"));
            return;
        }

        const parsedAmount = Number(amount);
        if (!parsedAmount || parsedAmount <= 0) {
            toast.warn(t("withdrawErrors.invalidAmount"));
            return;
        }

        if (method === "card" && !selectedCardId) {
            toast.warn(t("withdrawErrors.noCard"));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    amount: parsedAmount,
                    method,
                    card_id: method === "card" ? selectedCardId : null,
                }),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                toast.error(json.error || t("withdrawErrors.failed"));
                return;
            }

            await fetch("/api/notify-withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    withdrawId: json.withdrawId,
                    userId,
                    amount: parsedAmount,
                    method,
                }),
            });

            toast.success(t("withdrawSuccess"));
            onCloseAction();
        } catch (err) {
            toast.error(t("withdrawErrors.server"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="withdraw">
            <h3 style={{ margin: "15px 0" }}>{t("withdrawTitle")}</h3>

            <CustomSelect
                name="withdrawMethod"
                value={method}
                placeholder={t("withdrawSelectPlaceholder")}
                options={withdrawMethodOptions}
                onChange={(_, value) => {
                    setMethod(value as WithdrawMethod);
                    setSelectedCardId(null);
                }}
            />

            {method === "card" && (
                <div className="cards">
                    {cards.map((c) => (
                        <div
                            key={c.id}
                            className={`card ${selectedCardId === c.id ? "active" : ""}`}
                            onClick={() => setSelectedCardId(c.id)}
                        >
                            {c.brand} •••• {c.last4}
                        </div>
                    ))}
                </div>
            )}

            <label>
                <input
                    type="number"
                    placeholder={t("withdrawAmountPlaceholder")}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </label>

            <div style={{ margin: "15px 0" }} className="btn-withdraw">
                <button
                    style={{ padding: "10px 30px" }}
                    onClick={submitWithdraw}
                    disabled={loading}
                >
                    {loading ? t("loading") : t("ok")}
                </button>

                <button
                    style={{ padding: "10px 30px" }}
                    onClick={onCloseAction}
                >
                    {t("close")}
                </button>
            </div>
        </div>
    );
}
