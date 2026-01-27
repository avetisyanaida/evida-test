"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
    label: string;
    value: number;
    icon: string;
    glow?: string;
}

/**
 * ⚠️ hydration-safe animated number
 */
const useAnimatedNumber = (target: number) => {
    const [value, setValue] = useState<number | null>(null);

    // ✅ 1. deterministic first render
    useEffect(() => {
        setValue(target);
    }, [target]);

    // ✅ 2. animation ONLY on client
    useEffect(() => {
        if (value === null) return;

        const id = setInterval(() => {
            const delta =
                (Math.random() * 0.8 + 0.2) *
                (Math.random() > 0.5 ? 1 : -1);

            setValue(prev =>
                Number(Math.max(0, (prev ?? target) + delta).toFixed(2))
            );
        }, 300);

        return () => clearInterval(id);
    }, [value, target]);

    // ✅ 3. FIXED locale → no mismatch
    return value === null
        ? target.toFixed(2)
        : value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
};

export const ProviderCard = ({ label, value, icon, glow }: Props) => {
    const animatedValue = useAnimatedNumber(value);

    return (
        <div className={`provider-card ${glow ?? ""}`}>
            <div className="border-right" />
            <div className="border-bottom" />
            <div className="border-left" />
            <div className="provider-icon">
                <Image src={icon} alt={label} width={56} height={56} />
            </div>
            <div className="provider-info">
                <span className="provider-label">{label}</span>
                <strong className="provider-value">{animatedValue}</strong>
            </div>
        </div>
    );
};
