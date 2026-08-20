import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useDialogFocus(dialogRef, initialFocusRef, { onEscape } = {}) {
    useEffect(() => {
        const dialog = dialogRef.current;
        const previouslyFocusedElement = document.activeElement;

        if (!dialog) {
            return undefined;
        }

        const focusTarget =
            initialFocusRef?.current ||
            dialog.querySelector(FOCUSABLE_SELECTOR) ||
            dialog;

        focusTarget.focus();

        function handleKeyDown(event) {
            if (event.key === "Escape" && onEscape) {
                event.preventDefault();
                onEscape();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements = [
                ...dialog.querySelectorAll(FOCUSABLE_SELECTOR),
            ];

            if (focusableElements.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }

            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement =
                focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastFocusableElement
            ) {
                event.preventDefault();
                firstFocusableElement.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            if (previouslyFocusedElement instanceof HTMLElement) {
                previouslyFocusedElement.focus();
            }
        };
    }, [dialogRef, initialFocusRef, onEscape]);
}
