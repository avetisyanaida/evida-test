"use client";

import { ProviderCard } from "./ProviderCard";

const items = [
    { id: 1, label: "BRONZE", value: 5528.49, icon: "bronze-icon.png" },
    { id: 2, label: "SILVER", value: 63384.88, icon: "silver-icon.png" },
    { id: 3, label: "GOLD", value: 631893.94, icon: "gold-icon.png", glow: "gold" },
    { id: 4, label: "DIAMOND", value: 20034284.66, icon: "diamond-icon.png", glow: "diamond" },
];

export const ProvidersStrip = () => {
    return (
        <section>
            <div className="container">
                <div className="providers-strip">
                    {items.map(item => (
                        <ProviderCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </section>
    );
};
