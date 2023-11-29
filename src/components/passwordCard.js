import { useState, useEffect } from "react";
import * as eva from "eva-icons";

export default function PasswordCard({ data, onSave, onCancel }) {
    useEffect(() => {
        eva.replace();
    }, []);

    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [web, setWeb] = useState(data.web);
    const [username, setUsername] = useState(data.username);
    const [password, setPassword] = useState(data.password);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-center items-center">
            <div className="rounded-md p-4 bg-gray-200 z-50 shadow-lg w-1/3 h-1/2">
                <div className="flex flex-col h-full justify-between">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center flex-wrap">
                            <label className="w-82">URL:</label>
                            <div className="flex">
                                <input
                                    className="p-2 rounded-md outline-none w-72"
                                    value={web}
                                    type="url"
                                    onChange={(event) =>
                                        setWeb(event.target.value)
                                    }
                                />
                                <button
                                    className="bg-white rounded-md p-2 w-10 ml-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(web)
                                    }
                                >
                                    <i data-eva="clipboard-outline"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center flex-wrap">
                            <label className="w-82">Usuario:</label>
                            <div className="flex">
                                <input
                                    className="p-2 rounded-md outline-none w-72"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                />
                                <button
                                    className="bg-white rounded-md p-2 w-10 ml-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(username)
                                    }
                                >
                                    <i data-eva="clipboard-outline"></i>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center flex-wrap">
                            <label className="w-82">Contraseña:</label>
                            <div className="flex">
                                <input
                                    className="p-2 rounded-md outline-none w-72"
                                    value={password}
                                    type={
                                        isPasswordFocused ? "text" : "password"
                                    }
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />
                                <button
                                    className="bg-white rounded-md p-2 w-10 ml-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(password)
                                    }
                                >
                                    <i data-eva="clipboard-outline"></i>
                                </button>
                            </div>
                        </div>
                        <br></br>
                        {data.lastUpdate !== null && (
                            <div className="mt-4">
                                {"Ultimá actualización: " + lastUpdate}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="rounded-md p-2 bg-gray-400 text-white"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                        <button
                            className="rounded-md p-2 bg-blue-500 text-white ml-2"
                            onClick={() =>
                                onSave({
                                    passwordId: data.passwordId,
                                    web,
                                    username,
                                    password,
                                    lastUpdate: new Date().toDateString(),
                                })
                            }
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
