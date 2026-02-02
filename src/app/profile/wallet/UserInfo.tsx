import { useTranslation } from "react-i18next";
import Image from "next/image";

export const UserInfo = ({ username, uniqueId }: { username: string | null; uniqueId: string | null }) => {
    const { t } = useTranslation();
    return (
        <div className="users-welcome">
            <a href="">
                <Image src={"/logo-profile.webp"} alt="profile" width={48} height={48} />
            </a>
            <div>
                <h2>{t("greeting")} {username}</h2>
                <p>ID - {uniqueId}</p>
            </div>
        </div>
    );
};