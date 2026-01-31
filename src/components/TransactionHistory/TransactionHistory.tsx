import { useCasino } from "@/src/components/CasinoContext/CasinoContext";
import { useTransactions } from "@/src/hooks/useTransactions";
import { useEffect } from "react";
import { supabase } from "@/src/hooks/supabaseClient";
import { RealtimeChannel } from "@supabase/realtime-js";
import { useTranslation } from "react-i18next";

export const TransactionHistory = () => {
    const { t } = useTranslation();
    const { showHistory } = useCasino();

    const {
        transactions,
        loading,
        page,
        hasMore,
        fetchTransactions,
        nextPage,
        prevPage,
    } = useTransactions();

    useEffect(() => {
        if (!showHistory) return;

        let channel: RealtimeChannel | null = null;

        const init = async () => {
            await fetchTransactions(1);

            const { data: session } = await supabase.auth.getSession();
            const userId = session?.session?.user?.id;
            if (!userId) return;

            channel = supabase
                .channel(`transactions-user-${userId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "UPDATE",
                        schema: "public",
                        table: "transactions",
                        filter: `user_id=eq.${userId}`,
                    },
                    () => {
                        fetchTransactions(1);
                    }
                )
                .subscribe();
        };

        void init();

        return () => {
            if (channel) {
                void supabase.removeChannel(channel);
            }
        };
    }, [showHistory, fetchTransactions]);

    if (loading) return <p>{t("transactions.loading")}</p>;
    if (!transactions.length)
        return <p style={{ color: "white" }}>{t("transactions.empty")}</p>;

    return (
        <div className="tx-table-wrap">
            <h2>{t("transactions.title")}</h2>

            <table className="tx-table">
                <thead>
                <tr>
                    <th>{t("transactions.type")}</th>
                    <th>{t("transactions.amount")}</th>
                    <th>{t("transactions.method")}</th>
                    <th>{t("transactions.status")}</th>
                    <th>{t("transactions.date")}</th>
                </tr>
                </thead>

                <tbody>
                {transactions.map((tx) => (
                    <tr key={tx.id}>
                        <td data-label={t("transactions.type")}>
                            {tx.type === "deposit"
                                ? t("transactions.types.deposit")
                                : t("transactions.types.withdraw")}
                        </td>

                        <td data-label={t("transactions.amount")}>
                            {tx.amount.toLocaleString()} ֏
                        </td>

                        <td data-label={t("transactions.method")}>
                            {tx.method === "card"
                                ? t("transactions.methods.card")
                                : tx.method === "idram"
                                    ? t("transactions.methods.idram")
                                    : t("transactions.methods.telcell")}
                        </td>

                        <td data-label={t("transactions.status")}>
                <span className={`status ${tx.status}`}>
                  {tx.status === "pending"
                      ? t("transactions.statuses.pending")
                      : tx.status === "approved"
                          ? t("transactions.statuses.approved")
                          : t("transactions.statuses.rejected")}
                </span>
                        </td>

                        <td data-label={t("transactions.date")}>
                            {new Date(tx.created_at).toLocaleString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    marginTop: 20,
                }}
            >
                <button
                    style={{ padding: "5px", borderRadius: "5px" }}
                    disabled={page === 1}
                    onClick={prevPage}
                >
                    ⬅ {t("transactions.prev")}
                </button>

                <span
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                    }}
                >
          {t("transactions.page")} {page}
        </span>

                <button
                    style={{ padding: "5px", borderRadius: "5px" }}
                    disabled={!hasMore}
                    onClick={nextPage}
                >
                    {t("transactions.next")} ➡
                </button>
            </div>
        </div>
    );
};
