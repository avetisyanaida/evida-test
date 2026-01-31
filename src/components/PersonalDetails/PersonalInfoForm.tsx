import React from "react";
import {useTranslation} from "react-i18next";
import {CustomSelect} from "@/src/components/ui/CustomSelect";

interface FormsPersonal {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    day: string;
    month: string;
    year: string;
    gender: string;
    country: string;
    personalNumber: string;
}
interface PersonalInfoFormProps {
    formsPersonal: FormsPersonal;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    phone: string;
    setPhone: (phone: string) => void;
    usernameStatus: "idle" | "checking" | "taken" | "free";
}


export const PersonalInfoForm = ({
                                     formsPersonal,
                                     handleChange,
                                     phone,
                                     setPhone,
                                     usernameStatus,
                                 }: PersonalInfoFormProps) => {
    const {t} = useTranslation();
    const monthOptions = [
        { value: "january", label: t("january") },
        { value: "february", label: t("february") },
        { value: "march", label: t("march") },
        { value: "april", label: t("april") },
        { value: "may", label: t("may") },
        { value: "june", label: t("june") },
        { value: "july", label: t("july") },
        { value: "august", label: t("august") },
        { value: "september", label: t("september") },
        { value: "october", label: t("october") },
        { value: "november", label: t("november") },
        { value: "december", label: t("december") },
    ];


    return (
        <div className="personal-details-info fade">
            <div className="details-info-item">
                <label>
                    <input
                        onChange={handleChange}
                        name="userName"
                        value={formsPersonal.userName}
                        type="text"
                        placeholder={t("username")}
                        className={usernameStatus === "taken" ? "input-error" : ""}
                    />
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="email"
                        value={formsPersonal.email}
                        type="email"
                        placeholder={t("email")}
                    />
                </label>

                <label>
                    <input
                        type="tel"
                        value={phone}
                        placeholder={t("phone")}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="firstName"
                        value={formsPersonal.firstName}
                        type="text"
                        placeholder={t("firstName")}
                    />
                </label>

                <label>
                    <input
                        onChange={handleChange}
                        name="lastName"
                        value={formsPersonal.lastName}
                        type="text"
                        placeholder={t("lastName")}
                    />
                </label>
            </div>

            <div className="details-info-item">
                <CustomSelect
                    name="gender"
                    value={formsPersonal.gender}
                    placeholder={t('gender')}
                    options={[
                        {value: "female", label: t("female")},
                        {value: "male", label: t("male")},
                    ]}
                    onChange={(name, value) =>
                        handleChange({
                            target: {name, value},
                        } as any)
                    }
                />

                <div className="birth-day">
                    <label>
                        <input
                            onChange={handleChange}
                            name="day"
                            value={formsPersonal.day}
                            type="number"
                            placeholder={t("day")}
                        />
                    </label>
                    <CustomSelect
                        name="month"
                        value={formsPersonal.month}
                        placeholder={t("month")}
                        options={monthOptions}
                        onChange={(name, value) =>
                            handleChange({
                                target: { name, value },
                            } as any)
                        }
                    />
                    <label>
                        <input
                            onChange={handleChange}
                            name="year"
                            value={formsPersonal.year}
                            type="number"
                            placeholder={t("year")}
                        />
                    </label>
                </div>

                <CustomSelect
                    name="country"
                    value={formsPersonal.country}
                    options={[
                        { value: "Armenia", label: t("armenia") },
                        { value: "Georgia", label: t("georgia") },
                    ]}
                    onChange={(name, value) =>
                        handleChange({
                            target: { name, value },
                        } as any)
                    }
                />
                <label>
                    <input
                        onChange={handleChange}
                        name="personalNumber"
                        value={formsPersonal.personalNumber}
                        type="text"
                        placeholder={t("personalNumber")}
                    />
                </label>
            </div>
        </div>
    );
};
