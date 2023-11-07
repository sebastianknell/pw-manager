"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    derivePrivateKey,
    deriveSession,
    generateEphemeral,
    verifySession,
} from "secure-remote-password/client";
import * as eva from "eva-icons";
import { jwtDecode } from "jwt-decode";

export default function Page() {
    useEffect(() => {
        eva.replace();
    }, []);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [canSeePassword, setCanSeePassword] = useState(false);

    async function onLogin() {
        const clientEphemeral = generateEphemeral();
        let response = await fetch("http://localhost:5050/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                ephemeral: clientEphemeral.public,
            }),
        });
        if (response.ok) {
            let data = await response.json();
            console.log(data);
            const salt = data.salt;
            const ephemeral = data.ephemeral;

            const privateKey = derivePrivateKey(salt, username, password);
            const clientSession = deriveSession(
                clientEphemeral.secret,
                ephemeral,
                salt,
                username,
                privateKey
            );

            console.log(clientSession.key);

            response = await fetch("http://localhost:5050/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    proof: clientSession.proof,
                }),
            });

            if (response.ok) {
                data = await response.json();
                console.log(data);
                const serverSessionProof = data.proof;
                try {
                    verifySession(
                        clientEphemeral.public,
                        clientSession,
                        serverSessionProof
                    );
                    console.log(data.token);
                    localStorage.setItem('token', data.token);
                    console.log(jwtDecode(data.token));
                    router.push("/dashboard");
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    function createAccount() {
        console.log('register')
        router.push("/register");
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="space-y-2">
                <input
                    placeholder="usuario"
                    className="p-2 rounded-md outline-none w-72"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <div className="w-72">
                    <div className="flex p-2 rounded-md bg-white">
                        <input
                            placeholder="contraseña"
                            type={canSeePassword ? "text" : "password"}
                            className="outline-none block"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                        <button
                            onClick={() => {
                                setCanSeePassword(!canSeePassword);
                            }}
                        >
                            <i data-eva="eye-outline"></i>
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="p-2 rounded-md bg-blue-500 text-white w-32"
                        onClick={onLogin}
                    >
                        Ingresar
                    </button>
                </div>
                <div className="flex justify-center">
                    <button
                        className="p-2 rounded-md bg-gray-500 text-white w-32"
                        onClick={createAccount}
                    >
                        Crear cuenta
                    </button>
                </div>
            </div>
        </div>
    );
}
