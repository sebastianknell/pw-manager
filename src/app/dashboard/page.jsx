"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as eva from "eva-icons";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Password from "@/components/password";
import PasswordCard from "@/components/passwordCard";
import { cryptoService } from "@/services/cryptoService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            logout();
        }
    }, [countdown, router]);

    useEffect(() => {
        eva.replace();
    }, []);

    const [passwordList, setPasswordList] = useState([]);
    const [search, setSearch] = useState("");
    const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);

    const logout = () => {
        authService.logout();
        router.push("/login");
    };

    const handleNewPassword = () => {
        setShowNewPasswordForm(true);
    };

    //create secure password
    function generateSecurePassword(length = 12) {
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        return password;
    }

    const handleGeneratePassword = () => {
        const newPassword = generateSecurePassword();
        toast.info(`Contraseña generada: ${newPassword}`, {
            position: "top-right",
            autoClose: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
        });
    };

    useEffect(() => {
        getPasswords().then(() => {});
    }, []);

    async function getPasswords() {
        console.log("getting passwords");
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5050/getpasswords", {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });
        if (res.ok) {
            const data = await res.json();
            if (data.passwordData === "") {
                setPasswordList([]);
            } else {
                // desencriptar
                try {
                    console.log("password data", data.passwordData);
                    const decryptedData = await cryptoService.decryptData(
                        data.passwordData,
                        cryptoService.encryptionKey,
                        data.encryptionIV
                    );
                    let decryptedDataArr = JSON.parse(decryptedData);
                    decryptedDataArr.forEach((x) => (x.lastUpdate = null));
                    setPasswordList(decryptedDataArr);
                } catch (e) {
                    console.log(e);
                    logout();
                }
            }
        } else {
            if (res.status === 403) {
                logout();
            }
        }
    }

    async function syncPasswords(passwordData) {
        console.log("syncing passwords");
        try {
            // Encriptar
            const iv = cryptoService.generateIV();
            const encryptedData = await cryptoService.encryptData(
                JSON.stringify(passwordData),
                cryptoService.encryptionKey,
                iv
            );
            console.log("encrypted data", encryptedData);

            // Guardar en el servidor
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5050/savepasswords", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    passwordData: encryptedData,
                    encryptionIV: iv,
                }),
            });

            if (res.ok) {
                return true;
            } else {
                console.error(
                    "Error al guardar las contraseñas en el servidor"
                );
                if (res.status === 403) {
                    logout();
                }
                return false;
            }
        } catch (error) {
            console.error("Error al encriptar las contraseñas:", error);
        }
    }

    async function saveNewPassword(newPassword) {
        console.log("saving passwords");
        const orderedPasswordList = [...passwordList];
        let newId;
        if (orderedPasswordList.length > 0) {
            const max = orderedPasswordList.reduce((prev, current) =>
                prev && prev.passwordId > current.passwordId ? prev : current
            );
            newId = max.passwordId + 1;
        } else {
            newId = 1;
        }
        orderedPasswordList.push({ ...newPassword, passwordId: newId });

        const success = await syncPasswords(orderedPasswordList);
        if (success) {
            setShowNewPasswordForm(false);
            await getPasswords();
        }
    }

    async function updatePasswords(updatedPassword) {
        console.log("updating passwords");
        const passwordListCopy = [...passwordList];
        console.log(passwordListCopy);
        console.log(updatedPassword);
        const idx = passwordListCopy.findIndex(
            (x) => x.passwordId === updatedPassword.passwordId
        );
        if (idx === -1) {
            console.log("Problema al actualizar contraseña");
            return;
        }
        passwordListCopy[idx] = updatedPassword;

        const success = await syncPasswords(passwordListCopy);
        if (success) {
            await getPasswords();
        }
    }

    async function deletePassword(passwordId) {
        console.log("deleting password");
        let passwordListCopy = [...passwordList];
        passwordListCopy = passwordListCopy.filter(
            (x) => x.passwordId !== passwordId
        );
        const success = await syncPasswords(passwordListCopy);
        if (success) {
            await getPasswords();
        }
    }

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <ToastContainer />
            <div className="flex flex-col h-screen overflow-scroll">
                <div className="flex justify-between items-center p-2 bg-blue-500">
                    <h1 className="text-white text-xl">
                        Utec Password Manager
                    </h1>
                    <div className="flex">
                        <button
                            className="p-2 bg-green-500 rounded-md text-white w-32 mr-2"
                            onClick={handleGeneratePassword}
                        >
                            Generar
                        </button>
                        <button
                            className="p-2 rounded-md bg-red-500 text-white w-32"
                            onClick={logout}
                        >
                            Salir
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <div className="p-2 space-y-4 mt-2">
                        <button
                            className="flex p-2 bg-blue-500 rounded-md text-white"
                            onClick={handleNewPassword}
                        >
                            <i
                                data-eva="plus-outline"
                                className="fill-white mr-1"
                            ></i>
                            Nueva
                        </button>

                        <input
                            type="search"
                            placeholder="Buscar"
                            className="p-2 rounded-md outline-none w-max"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                        <div className="space-y-2">
                            {passwordList
                                .filter(
                                    (pwd) =>
                                        pwd &&
                                        pwd.web &&
                                        pwd.web
                                            .toLowerCase()
                                            .includes(search.toLowerCase())
                                )
                                .map((pwd) => (
                                    <Password
                                        key={pwd.passwordId}
                                        data={pwd}
                                        onSave={updatePasswords}
                                        onDelete={deletePassword}
                                    ></Password>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Nuevo componente para el formulario de nueva contraseña */}
            {/* <NewPasswordForm
        visible={showNewPasswordForm}
        onClose={() => setShowNewPasswordForm(false)}
        onSave={handleSaveNewPassword}
      /> */}
            {showNewPasswordForm &&
                createPortal(
                    <PasswordCard
                        data={{
                            passwordId: null,
                            username: "",
                            web: "",
                            password: "",
                            lastUpdate: null,
                        }}
                        onCancel={() => setShowNewPasswordForm(false)}
                        onSave={saveNewPassword}
                    ></PasswordCard>,
                    document.body
                )}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-center">
                La sesión expira en {Math.floor(countdown / 60)}:
                {countdown % 60} minutos
            </div>
        </>
    );
}
