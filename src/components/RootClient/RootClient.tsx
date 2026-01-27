"use client";

import "@/src/i18n";
import React, { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ToastContainer } from "react-toastify";

import { CasinoProvider } from "@/src/components/CasinoContext/CasinoContext";
import { Header } from "@/src/components/Header/Header";
import { HeaderMenu } from "@/src/components/Header/HeaderMenu";
import { SliderSection } from "@/src/components/SliderSection/SliderSection";
import { TabsComponent } from "@/src/components/TabsComponent/TabsComponent";
import { Login } from "@/src/components/Login/Login";
import { AdminComponent } from "@/src/components/SignUp/AdminComponent";
import { ChatUser } from "@/src/components/ChatUser/ChatUser";
import Footer from "@/src/components/Footer/Footer";
import { NavWrap } from "@/src/components/NavWrap/NavWrap";
import { useAccountLimit } from "@/src/hooks/useAccountLimit";

import { useScrollTop } from "@/src/hooks/useScrollTop";
import { useUser } from "@/src/context/UserContext";
import {ProvidersStrip} from "@/src/components/ProvidersStrip/ProvidersStrip";

export default function RootClient({ children }: { children: React.ReactNode }) {
    useScrollTop();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { user, loading: userLoading } = useUser();
    const { isLimited, currentLimit, loading: limitLoading } = useAccountLimit();

    const isLoggedIn = !!user;
    const loading = userLoading || limitLoading; // combine loading states

    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenSignup, setIsOpenSignup] = useState(false);

    const isAdmin = pathname.startsWith("/admin");
    const isWallet = pathname.startsWith("/profile/wallet");
    const provider = searchParams.get("provider");

    const isCasino = pathname === "/" || pathname === "/profile" || !!provider;
    const showFullLayout = isCasino && !isWallet;

    return (
        <CasinoProvider>
            {!isAdmin && (
                <Header
                    isLoggedIn={isLoggedIn}
                    userName={user?.name ?? ""}
                    uniqueId={user?.uniqueId ?? ""}
                    onLoginClick={() => setIsOpenLogin(true)}
                    onSignupClick={() => setIsOpenSignup(true)}
                    isLimited={isLimited}
                />
            )}

            {loading || limitLoading && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    zIndex: 9999,
                }} />
            )}

            {!isAdmin && showFullLayout && (
                <>
                    <HeaderMenu />
                    {/*<SliderSection />*/}
                    <ProvidersStrip/>
                    <TabsComponent />
                    <NavWrap />
                    <Footer />

                    {isLimited && currentLimit && (
                        <div className="limited-notice">
                            ⛔ Ձեր հաշիվը սահմանափակված է մինչև{" "}
                            {new Date(currentLimit.until).toLocaleString()}
                        </div>
                    )}
                </>
            )}

            <ChatUser />
            {children}

            {isOpenLogin && <Login onClose={() => setIsOpenLogin(false)} />}
            {isOpenSignup && <AdminComponent onClose={() => setIsOpenSignup(false)} />}

            <ToastContainer
                position="top-center"
                theme="colored"
                autoClose={25000}
                style={{ zIndex: 999999 }}
            />
        </CasinoProvider>
    );
}
