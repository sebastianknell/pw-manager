"use client";

import { useState, useEffect } from "react";
import * as eva from "eva-icons";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import Head from "next/head";
import PasswordCard from "@/components/passwordCard";
import Password from "@/components/password";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token === null) {
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        eva.replace();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:5050/getpasswords", {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        }).then((data) => {
            data.json().then((data) => setPasswordList(data));
        });
    }, []);

    const [passwordList, setPasswordList] = useState([]);
    const [search, setSearch] = useState("");

    function logout() {
        authService.logout();
        router.push("/login");
    }

    const testPassword = {
        passwordId: 1,
        web: "google.com",
        username: "sebas",
        password: "hola",
        lastUpdate: "",
    };

    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className="flex flex-col h-screen">
                <div className="flex justify-between items-center p-2 bg-blue-500">
                    <h1 className="text-white text-xl">sebastianknell</h1>
                    <button
                        className="p-2 rounded-md bg-red-500 text-white w-32"
                        onClick={logout}
                    >
                        Salir
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="p-2 space-y-4 mt-2">
                        <button className="flex p-2 bg-blue-500 rounded-md text-white">
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
                                .filter((pwd) => pwd.web.includes(search))
                                .map((pwd) => {
                                    return (
                                        <Password key={pwd.passwordId} data={pwd}></Password>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
