'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function onLogin() {

    }

    function createAccount() {
        router.push('/register')
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="space-y-2">
                <input placeholder="usuario" className="p-2 rounded-md outline-none block" value={username} onChange={(event) => setUsername(event.target.value)}/>
                <input placeholder="contraseña" className="p-2 rounded-md outline-none block" value={password} onChange={(event) => setPassword(event.target.value)}/>
                <div className="flex justify-center">
                    <button className="p-2 rounded-md bg-blue-500 text-white" onClick={onLogin}>
                        Ingresar
                    </button>
                </div>
                <div className="flex justify-center">
                    <button className="p-2 rounded-md bg-gray-500 text-white" onClick={createAccount}>
                        Crear cuenta
                    </button>
                </div>
            </div>
        </div>
    )
}