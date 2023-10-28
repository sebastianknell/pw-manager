"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateEphemeral, generateSalt } from "secure-remote-password/client";

export default function Page() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    async function register() {
        const response = await fetch("localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                salt: generateSalt(),
                verifier: generateEphemeral().public
            }),
        });
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
            <div className="space-y-2">
                <div className="flex justify-center items-center flex-col space-y-2">
                    <input
                        placeholder="usuario"
                        className="p-2 rounded-md outline-none block"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="contraseña"
                        className="p-2 rounded-md outline-none block"
                        value={password}
                        onChange={(event) =>
                            validatePassword(event.target.value)
                        }
                    />
                    <p>
                        La contraseña debe tener 10 o más caracteres, y tener
                        por lo menos una mayúscula, un número y un símbolo
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        className="p-2 rounded-md bg-blue-500 text-white disabled:bg-gray-400"
                        onClick={register}
                        disabled={!isPasswordValid}
                    >
                        Registrarme
                    </button>
                </div>
            </div>
        </div>
    );
}
