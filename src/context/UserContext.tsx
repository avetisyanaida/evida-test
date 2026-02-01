"use client";

import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import {supabase} from "@/src/hooks/supabaseClient";

interface UserData {
    id: string;
    email: string;
    name: string;
    uniqueId: string;
}

interface UserContextType {
    user: UserData | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
});

export const UserProvider = ({children}: PropsWithChildren) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const isResetFlow = () => {
        if (typeof window === "undefined") return false;
        return window.location.pathname === "/reset";
    };


    const loadUser = async () => {
        console.log("🔵 loadUser CALLED", {
            path: typeof window !== "undefined" ? window.location.pathname : "SSR",
        });
        setLoading(true);

        // 🚫 RESET = ոչ մի user, վերջ
        if (isResetFlow()) {
            console.log("🟣 RESET FLOW → SKIP USER");
            setLoading(false);
            return;
        }

        // const { data } = await supabase.auth.getSession();

        const {data} = await supabase.auth.getSession();
        const authUser = data.session?.user;

        console.log("🔵 getSession RESULT", {
            hasSession: !!data.session,
            userId: data.session?.user?.id,
        });


        if (!authUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        const {data: profile} = await supabase
            .from("users")
            .select("first_name, unique_id")
            .eq("user_id", authUser.id)
            .single();

        console.log("🔵 SET USER", {
            id: authUser.id,
            email: authUser.email,
        });


        setUser({
            id: authUser.id,
            email: authUser.email ?? "",
            name: profile?.first_name ?? "",
            uniqueId: profile?.unique_id ?? "",
        });

        setLoading(false);
    };

    useEffect(() => {
        loadUser();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log("🔴 AUTH STATE CHANGE", {
                    event,
                    hasSession: !!session,
                    path: window.location.pathname,
                });

                loadUser();
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);


    return (
        <UserContext.Provider value={{user, loading}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
