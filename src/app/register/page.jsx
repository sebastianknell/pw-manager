"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    generateEphemeral,
    generateSalt,
    deriveVerifier,
    derivePrivateKey,
    Ephemeral,
} from "secure-remote-password/client";
import * as eva from "eva-icons";
import { Button } from "@nextui-org/button";
import CryptoJS from "crypto-js";
import { API } from "@/config/environment";

export default function Page() {
    useEffect(() => {
        eva.replace();
    }, []);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [canSeePassword, setCanSeePassword] = useState(false);
    const [secretKey, setSecretKey] = useState("");
    const [showSecretKey, setShowSecretKey] = useState(false);

    function generateSecretKey() {
        const newSecretKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
        setSecretKey(newSecretKey);
        setShowSecretKey(true);
    }

    async function register() {
        const salt = generateSalt();
        const privateKey = derivePrivateKey(salt, username, password);
        const verifier = deriveVerifier(privateKey);
    
        const response = await fetch(`${API}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                salt,
                verifier,
            }),
        });
    
        if (response.ok) {
            // Registro exitoso, ahora generamos la clave secreta
            // const newSecretKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
            // setSecretKey(newSecretKey);
            // setShowSecretKey(true);
    
            // // Utilizamos la nueva clave secreta al copiar al portapapeles
            // navigator.clipboard.writeText(newSecretKey);
            router.push("/login");
        }
    }
    
    function copyToClipboard() {
        setShowSecretKey(false);
        router.push("/login");
    }
    
    function checkPassword(pwd) {
        return (
            /[A-Z]/.test(pwd) &&
            /[a-z]/.test(pwd) &&
            /[0-9]/.test(pwd) &&
            /[^A-Za-z0-9]/.test(pwd) &&
            pwd.length >= 10
        );
    }

    function validatePassword(currPassword) {
        if (checkPassword(currPassword)) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
        setPassword(currPassword);
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="space-y-2 text-center">
                <input
                    placeholder="usuario"
                    className="p-2 rounded-md outline-none w-72"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <div className="w-72 m-auto">
                    <div className="flex p-2 rounded-md bg-white">
                        <input
                            type={canSeePassword ? "text" : "password"}
                            placeholder="contraseña"
                            className="outline-none grow"
                            value={password}
                            onChange={(event) =>
                                validatePassword(event.target.value)
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
                <p>
                    La contraseña debe tener 10 o más caracteres, y tener por lo
                    menos una mayúscula, un número y un símbolo
                </p>
                <div className="flex justify-center">
                    <button
                        className="p-2 rounded-md bg-blue-500 text-white disabled:bg-gray-400 w-32"
                        onClick={register}
                        disabled={!isPasswordValid}
                    >
                        Registrarme
                    </button>
                </div>
                {showSecretKey && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-md">
                            <p className="mb-2">Tu nueva clave secreta:</p>
                            <div className="flex items-center">
                                <span className="mr-2">{secretKey}</span>
                                <button
                                    className="p-2 rounded-md bg-blue-500 text-white w-32"
                                    onClick={copyToClipboard}
                                >
                                    Copiar
                                </button>
                            
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
