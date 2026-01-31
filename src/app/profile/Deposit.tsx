import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";
import { useCasino } from "@/src/components/CasinoContext/CasinoContext";

interface DepositProps {
    onClose: () => void;
    onBalanceUpdate: (newBalance: number) => void;
    mode: "card" | "idram" | "telcell";
}

interface SavedCard {
    id: string;
    brand: string;
    last4: string;
    provider: string;
}

export default function Deposit({ onClose, mode }: DepositProps) {
    const [amount, setAmount] = useState("");
    const [text, setText] = useState("");
    const [provider] = useState("idram");

    const { t } = useTranslation();
    const { showMoreInfo, setShowMoreInfo } = useCasino();

    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [cardsOpen, setCardsOpen] = useState(false);

    useEffect(() => {
        if (mode !== "card") return;

        const loadCards = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) return;

            const { data } = await supabase
                .from("cards")
                .select("id, brand, last4, provider")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (data && data.length > 0) {
                setSavedCards(data);
                setSelectedCardId(data[0].id);
            }
        };

        loadCards();
    }, [mode]);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setText(""), [amount, provider]);

    const handleDeposit = async () => {
        const num = Number(amount);

        if (!num || num < 200) {
            setText(t("depositErrors.minAmount"));
            return;
        }

        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;

            if (!user) {
                setText(t("loginRequired"));
                return;
            }

            if (mode === "card") {
                if (selectedCardId) {
                    const res = await fetch("/api/payments/deposit-saved-card", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user_id: user.id,
                            amount: num,
                            card_id: selectedCardId,
                        }),
                    });

                    if (res.ok) {
                        setText(t("depositSuccess"));
                    } else {
                        setText(t("depositErrors.savedCardFailed"));
                    }
                    return;
                }

                const res = await fetch("/api/payments/deposit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        amount: num,
                        method: "card",
                    }),
                });

                const data = await res.json();
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
                return;
            }

            const res = await fetch("/api/payments/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: num,
                    method: mode,
                }),
            });

            const data = await res.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        } catch (err) {
            console.error("Deposit error:", err);
            setText(t("depositErrors.general"));
        }
    };

    return (
        <div className="deposit-wallet">
            {mode === "card" && (
                <>
                    <h3>{t("arcaDescription")}</h3>
                    <h4 style={{ color: "red" }}>{t("lawNote")}</h4>

                    <div className={"more-info-card"}>
                        <button
                            onClick={() => setShowMoreInfo(!showMoreInfo)}
                            className={"btn-more-info"}
                        >
                            {showMoreInfo ? t("close") : t("more")}
                        </button>

                        {showMoreInfo && (
                            <div className={"more-info"}>
                                <h5 style={{ color: "grey" }}>
                                    {t("depositInfo.card.stepsTitle")} <br />
                                    1. {t("depositInfo.card.step1")} <br />
                                    2. {t("depositInfo.card.step2")}
                                </h5>

                                <h5 style={{ color: "grey" }}>
                                    {t("depositInfo.card.savedCardNote")}
                                </h5>

                                <h5 style={{ color: "grey" }}>
                                    {t("depositInfo.card.redirectTitle")} <br />
                                    1. {t("depositInfo.card.redirectStep1")} <br />
                                    2. {t("depositInfo.card.redirectStep2")} <br />
                                    3. {t("depositInfo.card.redirectStep3")}
                                </h5>
                            </div>
                        )}
                    </div>

                    {savedCards.length > 0 && (
                        <div className="card-select">
                            <div
                                className="card-select-header"
                                onClick={() => setCardsOpen(!cardsOpen)}
                            >
                                <div className="card-summary">
                                    {selectedCardId
                                        ? (() => {
                                            const card = savedCards.find(
                                                (c) => c.id === selectedCardId
                                            );
                                            return `${card?.brand} •••• ${card?.last4}`;
                                        })()
                                        : `➕ ${t("addCard")}`}
                                </div>

                                <div className="arrow">
                                    {cardsOpen ? "▲" : "▼"}
                                </div>
                            </div>

                            {cardsOpen && (
                                <div className="card-select-body">
                                    {savedCards.map((card) => (
                                        <div
                                            key={card.id}
                                            className={`card-option ${
                                                selectedCardId === card.id ? "active" : ""
                                            }`}
                                            onClick={() => {
                                                setSelectedCardId(card.id);
                                                setCardsOpen(false);
                                            }}
                                        >
                                            {card.brand} •••• {card.last4}
                                        </div>
                                    ))}

                                    <div
                                        className={`card-option new ${
                                            selectedCardId === null ? "active" : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedCardId(null);
                                            setCardsOpen(false);
                                        }}
                                    >
                                        ➕ {t("addCard")}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {mode === "idram" && (
                <>
                    <h2 style={{ color: "white", textAlign: "left" }}>
                        {t("idramTitle")}
                    </h2>

                    <div className={"more-info-card"}>
                        <button
                            onClick={() => setShowMoreInfo(!showMoreInfo)}
                            className={"btn-more-info"}
                        >
                            {showMoreInfo ? t("close") : t("more")}
                        </button>

                        {showMoreInfo && (
                            <div className={"more-info"}>
                                <h5 style={{ color: "red" }}>
                                    {t("depositInfo.idram.main")}
                                </h5>
                                <h5 style={{ color: "grey" }}>
                                    {t("depositInfo.idram.note")}
                                </h5>
                                <h5 style={{ color: "grey" }}>
                                    {t("depositInfo.idram.steps")}
                                </h5>
                                <h5 style={{ color: "grey" }}>
                                    {t("depositInfo.idram.appSteps")}
                                </h5>
                            </div>
                        )}
                    </div>
                </>
            )}

            <label>
                <input
                    className={"no-spinner"}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t("amountPlaceholder")}
                />
            </label>

            <div className="btn">
                <button
                    onClick={handleDeposit}
                    style={{ backgroundColor: "#d2c81b", color: "black" }}
                >
                    {t("ok")}
                </button>
                <button
                    onClick={onClose}
                    style={{ backgroundColor: "#211a4f" }}
                >
                    {t("cancel")}
                </button>
            </div>

            {text && (
                <p
                    style={{
                        marginTop: 20,
                        color: text.includes("❌") ? "red" : "green",
                    }}
                >
                    {text}
                </p>
            )}
        </div>
    );
}
