import { useState, useEffect } from "react";
import * as eva from "eva-icons";

export default function PasswordCard({ data, onSave, onCancel }) {
    useEffect(() => {
        eva.replace();
    }, []);

    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
                                    value={data.web}
                                    type="url"
                                />
                                <button
                                    className="bg-white rounded-md p-2 w-10 ml-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(data.web)
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
                                    value={data.username}
                                />
                                <button
                                    className="bg-white rounded-md p-2 w-10 ml-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            data.username
                                        )
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
                                    value={data.password}
                                    type={isPasswordFocused ? "text" : "password"}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setIsPasswordFocused(false)}
                                />
                                <button
                                    className="bg-white rounded-md p-2 w-10 ml-2"
                                    onClick={() =>
                                        navigator.clipboard.writeText(
                                            data.password
                                        )
                                    }
                                >
                                    <i data-eva="clipboard-outline"></i>
                                </button>
                            </div>
                        </div>
                        <br></br>
                        <div className="mt-4">
                            {"Ultimá actualización: " +
                                new Date().toDateString()}
                        </div>
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
                            onClick={onSave}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
