import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./../socket.js";

const Room = () => {
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Frontend connected:", socket.id);
        });

        socket.on("joined", (success) => {
            if (success) {
                localStorage.clear("roomId");
                navigate("/tic-tac")
            }else{
                alert("room-full");
            }
        });

        return () => {
            socket.off("joined");
            socket.disconnect();
        };
    }, []);

    const joinRoom = () => {
        localStorage.setItem("roomId",roomCode);
        socket.emit("join-room", roomCode);
    };

    const generateRoomCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 5; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        setRoomCode(code);
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Create Game Room</h1>

                <input
                    placeholder="Player 1"
                    value={user1}
                    onChange={(e) => setUser1(e.target.value)}
                    style={styles.input}
                />

                <input
                    placeholder="Player 2"
                    value={user2}
                    onChange={(e) => setUser2(e.target.value)}
                    style={styles.input}
                />

                <button
                    onClick={generateRoomCode}
                    disabled={!user1 || !user2}
                    style={styles.button}
                >
                    Generate Room Code
                </button>

                {roomCode && (
                    <>
                        <div style={styles.badge}>{roomCode}</div>
                        <button onClick={joinRoom} style={styles.button}>
                            Join Room
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
const styles = { page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "20px", }, card: { background: "#ffffff", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "380px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", textAlign: "center", }, title: { marginBottom: "8px", fontSize: "26px", fontWeight: "700", }, subtitle: { marginBottom: "24px", color: "#666", fontSize: "14px", }, input: { width: "100%", padding: "12px", fontSize: "15px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "14px", outline: "none", }, button: { width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#667eea", color: "#fff", fontSize: "16px", fontWeight: "600", marginTop: "8px", transition: "0.3s", }, result: { marginTop: "24px", }, badge: { display: "inline-block", padding: "10px 18px", background: "#764ba2", color: "#fff", fontSize: "18px", fontWeight: "700", borderRadius: "999px", letterSpacing: "2px", marginBottom: "10px", }, players: { fontSize: "14px", color: "#444", }, };

export default Room;