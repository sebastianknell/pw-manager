import { useState } from "react";
import PasswordCard from "./passwordCard";
import { createPortal } from "react-dom";

export default function Password({ data }) {
    const [isOpen, setIsOpen] = useState(false);

    function onCardSave(updatedPassword) {
        // TODO: update data
        setIsOpen(false);
    }

    function onCardCancel() {
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
                    ></PasswordCard>,
                    document.body
                )}
        </>
    );
}
