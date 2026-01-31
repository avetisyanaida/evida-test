import "@/src/assets/styles/global.scss";
import "@/src/assets/styles/index.scss";
import "@/src/assets/styles/mixin.scss";
import "@/src/assets/styles/variables.scss";
import "@/src/assets/icons/icon.css";
import "@/src/assets/styles/globalSlider.css";
import "@/src/i18n";
import type {PropsWithChildren} from "react";
import RootClient from "@/src/components/RootClient/RootClient";
import {UserProvider} from "@/src/context/UserContext";

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }:PropsWithChildren) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" type="image/png" href="/logo-profile.png" />
            <title>EVIDA CASINO</title>
        </head>
        <body className={'app-body'}>
        <main className="main-content">
            <UserProvider>
                <RootClient>{children}</RootClient>
            </UserProvider>
        </main>
        </body>
        </html>
    );
}
