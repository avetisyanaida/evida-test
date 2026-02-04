import "@/src/assets/styles/global.scss";
import "@/src/assets/styles/index.scss";
import "@/src/assets/styles/mixin.scss";
import "@/src/assets/styles/variables.scss";
import "@/src/assets/icons/icon.css";
import "@/src/i18n";

import type { PropsWithChildren } from "react";
import Script from "next/script";

import RootClient from "@/src/components/RootClient/RootClient";
import { UserProvider } from "@/src/context/UserContext";

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta
                name="description"
                content="Casino platform technical demo with admin panel, wallet logic and user management. Built for iGaming projects and startups."
            />
            <meta
                name="google-site-verification"
                content="Xxn5z7QQHRYtrACLluLtu9ntbfEMk99euuMJC9c0QCE"
            />
            <link rel="icon" type="image/png" href="/logo-profile.webp" />
            <title>Casino Platform Demo | iGaming Admin & Wallet System</title>

            {/* 🔥 GOOGLE ANALYTICS */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-BXL5J7QPYC"
                strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BXL5J7QPYC', {
              page_path: window.location.pathname,
            });
          `}
            </Script>
        </head>

        <body className="app-body">
        <main className="main-content">
            <UserProvider>
                <RootClient>{children}</RootClient>
            </UserProvider>
        </main>
        </body>
        </html>
    );
}
