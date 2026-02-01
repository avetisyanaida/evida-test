"use client";

import { Suspense } from "react";
import ResetContainer from "./ResetContainer";

export default function ResetPage() {
    return (
        <Suspense fallback={<p>Loading…</p>}>
            <ResetContainer />
        </Suspense>
    );
}
