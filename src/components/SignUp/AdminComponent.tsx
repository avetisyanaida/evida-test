import React, { useState } from "react";
import { AdminForm } from "./AdminForm";
import { ModalComponent } from "../ModalComponent/ModalComponent";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {supabase} from "@/src/hooks/supabaseClient";

export interface AdminProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    balance: number;
    user_id: string;
    user_code: number;
    phone: string;
    isAdult?: boolean;
    hasPromo?: boolean;
    promoCode?: string;
}

export interface ErrorProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Props {
    onClose: () => void;
}

export const AdminComponent: React.FC<Props> = ({ onClose }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<AdminProps>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        balance: 0,
        user_id: "",
        user_code: 0,
        phone: '+374',
        isAdult: true,
        promoCode: '',
        hasPromo: false,
    });

    const [error, setError] = useState<ErrorProps>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    const validateLatin = (text: string) => /^[A-Za-z]+$/.test(text);
    const validatePassword = (password: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);

    const validation = () => {
        const errors: ErrorProps = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        let isValid = true;

        if (!formData.firstName.trim()) {
            toast.error(t("registerModal.firstNameRequired"))
            isValid = false;
        } else if (!validateLatin(formData.firstName)) {
            toast.error(t("registerModal.onlyLatin"));
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            toast.error(t("registerModal.lastNameRequired"));
            isValid = false;
        } else if (!validateLatin(formData.lastName)) {
            toast.error(t("registerModal.onlyLatin"));
            isValid = false;
        }

        if (!formData.email.trim() || !validateEmail(formData.email)) {
            toast.error(t("registerModal.invalidEmail"));
            isValid = false;
        }

        if (!formData.password.trim()) {
            toast.error(t("registerModal.passwordRequired"));
            isValid = false;
        } else if (!validatePassword(formData.password)) {
            toast.error(t("registerModal.passwordRules"));
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error(t("registerModal.passwordsDontMatch"));
            isValid = false;
        }

        setError(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError((prev) => ({ ...prev, [name]: "" }));
    };

    const handleClick = async () => {
        if (!validation()) return;
        setLoading(true);

        try {
            const { data: authData, error: signUpError } =
                await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

            if (signUpError) {
                toast.error(t("registerModal.signUpError") + ": " + signUpError.message);
                return;
            }

            if (!authData?.user) {
                toast.error(t("registerModal.noUserCreated"));
                return;
            }

            const userCode = Math.floor(10000000 + Math.random() * 90000000);

            const normalizedPhone = "+374" + formData.phone.replace(/\D/g, "").slice(-8);

            const { error: insertError } = await supabase.from("users").insert({
                user_id: authData.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: normalizedPhone,
                balance: 0,
                unique_id: String(userCode),
            });

            if (insertError) {
                if (insertError.code === "23505") {
                    const msg = insertError.message.toLowerCase();

                    if (msg.includes("email")) {
                        toast.error(t("registerModal.emailExists"));
                    } else if (msg.includes("phone")) {
                        toast.error(t("registerModal.phoneExists"));
                    } else if (msg.includes("user_code")) {
                        toast.error(t("registerModal.userCodeExists"));
                    } else {
                        toast.error(t("registerModal.dbError"));
                    }
                    return;
                }
                return;
            }

            toast.success(t("registerModal.success"));

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                balance: 0,
                user_id: authData.user.id,
                user_code: 0,
                phone: "+374",
                isAdult: true,
                promoCode: '',
                hasPromo: true,
            });

            onClose();
        } catch (err: any) {
            toast.error(t("registerModal.unexpectedError"), err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalComponent title={t("registerModal.title")} onClose={onClose}>
            <AdminForm
                formData={formData}
                handleChange={handleChange}
                handleClick={handleClick}
                error={error}
                loading={loading}
            />
        </ModalComponent>
    );
};
