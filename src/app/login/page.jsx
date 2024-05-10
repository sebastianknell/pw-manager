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
import { cryptoService } from "@/services/cryptoService";

export default function Page() {
    useEffect(() => {
        eva.replace();
    }, []);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [canSeePassword, setCanSeePassword] = useState(false);

    async function onLogin() {
        // const clientEphemeral = generateEphemeral();
        // console.log(clientEphemeral.public)
        // console.log(clientEphemeral.secret)
        const clientEphemeral = {
            public: "1b3363a2e5331877e7f6e48bbbc4544a0eca38b140174a6bf3cd393b66a6f507322472bf7ce555f4e01283a499bdccba9a58b810738e2a1b74dfb205d0d485a7bb034dc2bb33d7027c2d0887fe14e59cfdc33197c01eabbf8af210aa7e1cb1fbac5878dc17311964e509558a9083c068add41b2393e5d8d7f11f4658fe6e204d0e10838a6f07a5979c51b914c9296fe9749fa9b59454dd7e821935f5e736a440420afd584d8a88ae49877449237361a4225d540378c63d0a2b02556af5bee1ff2b7dab99f7c4208bb59658189ed84cca4d2d2e640ac77d83b9794d0ed868a055dfe8b4d01abf2e912ff10e1a7570dd8211ca232a51b6a506dfa83a1ea994541c",
            secret: "04dd472570688529b06a3692e7faf8460424caa6bad9cf9a03b0eba0a018d83d",
        };
        // proof
        // 1506be59ac98b7fbf71784ebc84ec2b3d803f21c20c4496c9d368a476012756a

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

            if (data.salt && data.ephemeral) {
                const salt = data.salt;
                const ephemeral = data.ephemeral;
                console.log(salt);
                console.log(ephemeral);
                const privateKey = derivePrivateKey(salt, username, password);

                const clientSession = deriveSession(
                    clientEphemeral.secret,
                    ephemeral,
                    salt,
                    username,
                    privateKey
                );
                console.log("proof", clientSession.proof);
                console.log("S", clientSession.S);

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
                    const serverSessionProof = data.proof;
                    try {
                        verifySession(
                            clientEphemeral.public,
                            clientSession,
                            serverSessionProof
                        );

                        localStorage.setItem("token", data.token);
                        const tokenData = jwtDecode(data.token);
                        console.log(tokenData);
                        const username = tokenData.username;
                        const encryptionSalt = tokenData.encryptionSalt;
                        console.log(encryptionSalt);
                        const encryptionKey = await cryptoService.deriveKey(
                            password,
                            encryptionSalt,
                            10000,
                            "SHA-256",
                            256
                        );
                        const keyStr = await cryptoService.exportKey(
                            encryptionKey
                        );
                        console.log(keyStr);
                        cryptoService.encryptionKey = encryptionKey;

                        router.push("/dashboard");
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                console.error(
                    "La respuesta no contiene la información completa del usuario."
                );
            }
        }
    }

    function createAccount() {
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
                            className="outline-none grow"
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

