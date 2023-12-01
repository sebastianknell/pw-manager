import { useState } from "react";
import PasswordCard from "./passwordCard";
import { createPortal } from "react-dom";

export default function Password({ data, onSave, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);

    async function onCardSave(updatedPassword) {
        await onSave(updatedPassword);
        setIsOpen(false);
    }

    function onCardCancel() {
        setIsOpen(false);
    }

    async function onCardDelete() {
        await onDelete(data.passwordId);
        setIsOpen(false);
    }

    return (
        <>
            <div
                key={data.passwordId}
                className="p-2 rounded-md bg-gray-300 hover:bg-gray-400 select-none shadow-sm"
                onClick={() => setIsOpen(true)}
            >
                <p className="text-lg font-semibold">{data.web}</p>
                <p>{/* data.lastUpdate.toDateString() */}</p>
            </div>
            {isOpen &&
                createPortal(
                    <PasswordCard
                        data={data}
                        onSave={onCardSave}
                        onCancel={onCardCancel}
                        onDelete={onCardDelete}
                    ></PasswordCard>,
                    document.body
                )}
        </>
    );
}
