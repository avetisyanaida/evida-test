import * as React from "react";
import type { AdminProps, ErrorProps } from "./AdminComponent.tsx";
import { useTranslation } from "react-i18next";
import {useState} from "react";

interface AdminFormProps {
    formData: AdminProps;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClick: () => void;
    error: ErrorProps;
    loading?: boolean;
}

export const AdminForm = ({ formData, handleChange, handleClick, error, loading }: AdminFormProps) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="admin-block">
            <label className="label">
                <input
                    className={error.firstName ? "error" : ""}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('form.firstName')}
                />
            </label>

            <label className="label">
                <input
                    className={error.lastName ? "error" : ""}
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t("form.lastName")}
                />
            </label>

            <label className="label">
                <input
                    className={error.email ? "error" : ""}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("form.email")}
                />
            </label>
            <label className={'label'}>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </label>
            <label className="label">
                <input
                    className={error.password ? "error" : ""}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("form.password")}
                />
                <i
                    style={{position: 'absolute', right: '20px', top: "14px", cursor: 'pointer', backgroundColor: 'white'}}
                    className={showPassword ? "icon eye-open" : "icon eye-close"}
                    onClick={() => setShowPassword(!showPassword)}
                />
            </label>

            <label className="label">
                <input
                    className={error.confirmPassword ? "error" : ""}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t("form.confirmPassword")}
                />
                <i
                    style={{position: 'absolute', right: '20px', top: "14px", cursor: 'pointer', backgroundColor: 'white'}}
                    className={showConfirmPassword ? "icon eye-open" : "icon eye-close"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
            </label>

            <button className="log" onClick={handleClick} disabled={loading}>
                {loading ? t("form.creating") : t("form.createAccount")}
            </button>
        </div>
    );
};
