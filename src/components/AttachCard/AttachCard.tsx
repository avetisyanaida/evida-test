"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/src/hooks/supabaseClient";
import { useCasino } from "@/src/components/CasinoContext/CasinoContext";

interface AttachPaymentProps {
    onClose: () => void;
}

interface SavedCard {
    id: string;
    provider: string;
    brand: string;
    last4: string;
}

export const AttachCard = ({ onClose }: AttachPaymentProps) => {
    const { t } = useTranslation();
    const { setShowDeposit, setShowAttachCard, setShowCardInfo } = useCasino();
    const [cards, setCards] = useState<SavedCard[]>([]);

    useEffect(() => {
        const loadCard = async () => {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;
            if (!user) return;

            const { data, error } = await supabase
                .from("cards")
                .select("id, provider, brand, last4")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });


            if (!error && data) {
                setCards(data);
            }
        };

        loadCard().then(r => r);
    }, []);

    const handleDeleteCard = async (cardId: string) => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (!user) return;

        const res = await fetch("/api/cards/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                card_id: cardId,
            }),
        });

        if (res.ok) {
            // UI-ից հանում ենք
            setCards(prev => prev.filter(c => c.id !== cardId));
        }
    };


    return (
        <div className="attach-card-modal">
            <div className="attach-card-content">
                <h2>💳 {t("attachCard.cardTitle")}</h2>

                {cards.length > 0 ? (
                    <div className="saved-cards-list">
                        {cards.map(card => (
                            <div key={card.id} className="saved-card">
                                <div className="card-left">
                                    <p>
                                        {card.brand} •••• {card.last4}
                                    </p>
                                    <button
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                        }}
                                        className="delete-card-btn"
                                        onClick={() => handleDeleteCard(card.id)}
                                    >
                                        <i className={'icon delete-card'}
                                           style={{
                                               backgroundColor: '#b77c7c',
                                               fontSize: '20px',
                                           }}
                                        ></i>
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    <p style={{color: 'white', margin: '10px 0 20px 0', fontSize: '20px'}}>{t("attachCard.noCard")}</p>
                )}
                <button
                    className="add-card-btn"
                    onClick={() => {
                        setShowAttachCard(false);
                        setShowDeposit(true);
                        setShowCardInfo("card");
                    }}
                >
                    {t("attachCard.addCarded")}
                </button>
                <button className="close-card-btn" onClick={onClose}>
                    {t("attachCard.close")}
                </button>
            </div>
        </div>
    );
};
