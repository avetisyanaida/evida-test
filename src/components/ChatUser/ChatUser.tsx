"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/hooks/supabaseClient";

interface Message {
    id?: number;
    message: string;
    sender: "user" | "admin" | "system";
    created_at?: string;
    closed?: boolean;
}

export const ChatUser = () => {
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMsg, setNewMsg] = useState("");
    const [chatClosed, setChatClosed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // -------- 1) Load user --------------
    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email ?? "guest",
                });
            }
        };
        loadUser();
    }, []);

    // ------- helper: load messages -------
    const loadMessages = async (uid: string) => {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: true });

        if (!error) setMessages(data || []);
    };

    // -------- 2) Load messages when user ready --------
    useEffect(() => {
        if (!user?.id) return;
        loadMessages(user.id);
    }, [user?.id]);

    // -------- 3) Send message (local instant visible) --------
    const sendMsg = async () => {
        if (!newMsg.trim() || !user?.id || chatClosed) return;

        const text = newMsg.trim();
        setNewMsg("");

        // ⭐ LOCAL instant message (UI immediately updates)
        const localMessage: Message = {
            message: text,
            sender: "user",
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, localMessage]);

        // ⭐ Then save to supabase in background
        const { error } = await supabase.from("messages").insert([
            {
                user_id: user.id,
                email: user.email || "guest",
                message: text,
                sender: "user",
            },
        ]);

        if (error) console.error("Send error:", error);

        // Optionally reload real messages from DB to sync IDs
        // loadMessages(user.id);
    };

    // -------- 4) Close chat --------
    const closeChat = async () => {
        if (!user?.id) return;

        await supabase.from("messages").insert([
            {
                user_id: user.id,
                email: user.email,
                message: "🔒 Զրույցը փակվել է օգտատիրոջ կողմից",
                sender: "system",
                closed: true,
            },
        ]);

        await supabase
            .from("messages")
            .insert([
                {
                    user_id: user.id,
                    email: user.email,
                    message: "🔒 Զրույցը փակվել է օգտատիրոջ կողմից",
                    sender: "system",
                    closed: true,
                },
            ]);

        setMessages([]);
        setChatClosed(true);
    };

    // -------- Floating open button --------
    if (!isOpen) {
        return (
            <button
                style={styles.floatingButton}
                onClick={() => setIsOpen(true)}
            >
                💬
            </button>
        );
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.header}>
                <h4>💬 Support Chat</h4>
                <button style={styles.closeX} onClick={() => setIsOpen(false)}>✖</button>
            </div>

            <div style={styles.chat}>
                {messages.length === 0 ? (
                    <p style={{ color: "#888", textAlign: "center" }}>
                        Գրիր հաղորդագրություն 👇
                    </p>
                ) : (
                    messages.map((m, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.msg,
                                alignSelf:
                                    m.sender === "user" ? "flex-end" : "flex-start",
                                background:
                                    m.sender === "user"
                                        ? "#18133BFF"
                                        : m.sender === "admin"
                                            ? "#444"
                                            : "transparent",
                            }}
                        >
                            <p>{m.message}</p>
                            {m.sender !== "system" && m.created_at && (
                                <span style={styles.time}>
                                    {new Date(m.created_at).toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>

            {!chatClosed && (
                <>
                    <div style={styles.inputRow}>
                        <input
                            value={newMsg}
                            onChange={(e) => setNewMsg(e.target.value)}
                            placeholder="Գրիր հաղորդագրություն..."
                            style={styles.input}
                            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                        />
                        <button onClick={sendMsg} style={styles.sendButton}>
                            📤
                        </button>
                    </div>

                    <button onClick={closeChat} style={styles.endButton}>
                        🔒 Փակել զրույցը
                    </button>
                </>
            )}
        </div>
    );
};


// ----------- styles ----------
const styles = {
    floatingButton: {
        position: "fixed" as const,
        bottom: "80px",
        right: "28px",
        background: "#18133BFF",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        fontSize: "28px",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
    },
    wrapper: {
        position: "fixed" as const,
        bottom: "80px",
        right: "28px",
        width: "350px",
        background: "#0b0b0b",
        color: "#fff",
        borderRadius: "50%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        padding: 10,
        display: "flex",
        flexDirection: "column" as const,
        zIndex: 1001,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    closeX: {
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: "18px",
        cursor: "pointer",
    },
    chat: {
        height: "250px",
        overflowY: "auto" as const,
        display: "flex",
        flexDirection: "column" as const,
        gap: 8,
        background: "#111",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    msg: {
        maxWidth: "70%",
        padding: "8px 10px",
        borderRadius: 8,
        color: "#fff",
    },
    time: { fontSize: 10, opacity: 0.6 },
    inputRow: { display: "flex", gap: 8 },
    input: {
        flex: 1,
        padding: 8,
        borderRadius: 6,
        border: "1px solid #333",
        background: "#222",
        color: "#fff",
    },
    sendButton: {
        background: "#18133BFF",
        border: "none",
        borderRadius: 6,
        padding: "8px 10px",
        cursor: "pointer",
        color: "#fff",
    },
    endButton: {
        background: "#c0392b",
        border: "none",
        borderRadius: 6,
        padding: "8px 12px",
        cursor: "pointer",
        color: "#fff",
        marginTop: 8,
        width: "100%",
    },
};
