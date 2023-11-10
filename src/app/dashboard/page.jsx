"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as eva from "eva-icons";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Password from "@/components/password";
import { Button } from "antd";
import NewPasswordForm from "@/components/passwordform";
import PasswordCard from "@/components/passwordCard";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

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

  const handleSaveNewPassword = (newPasswordData) => {
    try {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5050/createPassword", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPasswordData.userPassword }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            console.error("Error al crear la contraseña");
            throw new Error("Error al crear la contraseña");
          }
        })
        .then((newData) => {
          setPasswordList([...passwordList, newData]);
        })
        .catch((error) => {
          console.error("Error al crear la contraseña:", error);
        })
        .finally(() => {
          setShowNewPasswordForm(false);
        });
    } catch (error) {
      console.error("Error al crear la contraseña:", error);
    }
  };

  useEffect(() => {
    getPasswords().then(() => {})
  }, []);

  async function getPasswords() {
    console.log("getting passwords")
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5050/getpasswords", {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
    });
    if (res.ok) {
        const data = await res.json();
        if (data.passwordData === "") {
            setPasswordList([])
        } else {
            setPasswordList(JSON.parse(data.passwordData));
        }
    }
  }

  async function saveNewPassword(newPassword) {
    console.log("saving passwords");
    const token = localStorage.getItem("token");
    const orderedPasswordList = [...passwordList]
    let newId;
    if (orderedPasswordList.length > 0) {
        const max = orderedPasswordList.reduce((prev, current) =>
            prev && prev.passwordId > current.passwordId ? prev : current
        );
        newId = max.passwordId + 1
    } else {
        newId = 1;
    }
    // setPasswordList([...passwordList, {...newPassword, passwordId: newId}]);
    orderedPasswordList.push({...newPassword, passwordId: newId });
    console.log(orderedPasswordList);
    // guardar en el server
    const res = await fetch("http://localhost:5050/savepasswords", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            passwordData: JSON.stringify(orderedPasswordList),
        }),
    });
    if (res.ok) {
        setShowNewPasswordForm(false);
        await getPasswords();
    }
  }

  return (
      <>
          <Head>
              <title>Dashboard</title>
          </Head>
          <div className="flex flex-col h-screen">
              <div className="flex justify-between items-center p-2 bg-blue-500">
                  <h1 className="text-white text-xl">Utec Password Manager</h1>
                  <button
                      className="p-2 rounded-md bg-red-500 text-white w-32"
                      onClick={logout}
                  >
                      Salir
                  </button>
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
                          {Array.isArray(passwordList) &&
                              passwordList
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
                      data={{username: '', web: '', password: ''}}
                      onCancel={() => setShowNewPasswordForm(false)}
                      onSave={saveNewPassword}
                  ></PasswordCard>,
                  document.body
              )}
      </>
  );
}
