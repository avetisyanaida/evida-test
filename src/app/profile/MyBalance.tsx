import { useTranslation } from "react-i18next";

interface MyBalanceProps {
    balance: number;
}

export default function MyBalance({ balance }: MyBalanceProps) {
    const { t } = useTranslation();

    return (
        <div className="my-balance">
            <div className="my-balance-item">
                <button>
                    <i className={"icon balance"}></i>
                </button>
                <h4>{t("mainAccount")}</h4>
            </div>

            <p>{t("totalPlayableAmount")}</p>
            <span>{balance.toLocaleString("de-DE")} {t("money")}</span>
        </div>
    );
}
