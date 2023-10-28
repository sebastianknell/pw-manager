'use client'

import { useState } from "react";

export default function Page() {
    var passwordList = [
        {
            passwordId: 1,
            web: 'google.com',
            lastUpdate: new Date()
        },
        {
            passwordId: 2,
            web: 'youtube.com',
            lastUpdate: new Date()
        },
        {
            passwordId: 3,
            web: 'facebook.com',
            lastUpdate: new Date()
        }
    ]

    const [search, setSearch] = useState('')

    return (
        <div className="flex justify-center h-screen">
            <div className="p-2 space-y-4">
                <p className="text-4xl font-bold">Mis Contraseñas</p>
                <input type="search" placeholder="Buscar" className="p-2 rounded-md outline-none w-max" value={search} onChange={(event) => setSearch(event.target.value)}/>
                <div className="space-y-2">
                    {passwordList
                        .filter(pwd => !pwd.web.search(search))
                        .map((pwd) => {
                        return (
                            <div
                                key={pwd.passwordId}
                                className="p-2 rounded-md bg-gray-300 hover:bg-gray-400 select-none shadow-sm"
                            >
                                <p className="text-lg font-semibold">{pwd.web}</p>
                                <p>{pwd.lastUpdate.toDateString()}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}