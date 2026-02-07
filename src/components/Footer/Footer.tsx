"use client";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer>
            <div className="footer-content">
                <div className="footer-content-top">
                    <div className="footer-content-top-content">
                        <span>21+</span>
                        <h3>{t("footer.age_warning")}</h3>
                    </div>
                </div>

                <div className="footer-content-item">

                    <div className="footer-lists">
                        <h4>{t("footer.casino")}</h4>
                        <ul>
                            <li><a href={"#"}>{t("footer.slots")}</a></li>
                            <li><a href={"#"}>{t("footer.promos")}</a></li>
                            <li><a href={"https://affiliate.apartners.club/#/affiliate/register/3?affiliate_id=101636"} target={'_blank'}>{t("footer.affiliate")}</a></li>
                            <li><a href={"#"}>{t("footer.bonuses")}</a></li>
                        </ul>
                    </div>

                    <div className="footer-lists">
                        <h4>{t("footer.evida")}</h4>
                        <ul>
                            <li><a href={"#"}>{t("footer.license")}</a></li>
                            <li><a href={"#"}>{t("footer.privacy")}</a></li>
                            <li><a href={"#"}>{t("footer.about_us")}</a></li>
                            <li><a href={"#"}>{t("footer.terms")}</a></li>
                        </ul>
                    </div>

                    <div className="footer-lists">
                        <h4>{t("footer.info")}</h4>
                        <ul>
                            <li><a href={"#"}>{t("footer.contact")}</a></li>
                            <li><a href={"#"}>{t("footer.notifications")}</a></li>
                        </ul>
                    </div>

                    <div className="footer-lists">
                        <h4>{t("footer.live_casino")}</h4>
                        <ul>
                            <li><a href={"#"}>{t("footer.blackjack")}</a></li>
                            <li><a href={"#"}>{t("footer.roulette")}</a></li>
                            <li><a href={"#"}>{t("footer.poker")}</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-content-bottom">
                    <p>{t("footer.rights")}</p>
                </div>
            </div>
        </footer>
    );
}
