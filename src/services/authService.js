import { redirect } from "next/navigation";

export const authService = {
    userId: undefined,
    username: undefined,

    login: () => {

    },

    logout: () => {
        console.log("loggin out")
        localStorage.removeItem("token");
        // redirect("/login");
    }
}