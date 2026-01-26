"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    name: string;
    value: string;
    options: Option[];
    onChange: (name: string, value: string) => void;
    placeholder?: string;
}

export const CustomSelect = ({
                                 name,
                                 value,
                                 options,
                                 onChange,
                                 placeholder,
                             }: CustomSelectProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="custom-select" ref={ref}>
            <div
                className="custom-select__value"
                onClick={() => setOpen(prev => !prev)}
            >
                {selected ? selected.label : placeholder}
                <span className={`arrow ${open ? "open" : ""}`} />
            </div>

            {open && (
                <ul className="custom-select__dropdown">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            onClick={() => {
                                onChange(name, opt.value);
                                setOpen(false);
                            }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
