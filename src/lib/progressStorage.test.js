import { describe, expect, it } from "vitest";

import {
    createDefaultProgress,
    loadProgress,
    markChallengeCompleted,
    normalizeProgress,
    resetProgress,
    saveProgress,
} from "./progressStorage.js";

function createMemoryStorage(initialValues = {}) {
    const values = new Map(Object.entries(initialValues));

    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },

        setItem(key, value) {
            values.set(key, String(value));
        },

        removeItem(key) {
            values.delete(key);
        },
    };
}

describe("progressStorage", () => {
    it("creates default progress", () => {
        expect(createDefaultProgress()).toEqual({
            version: 1,
            currentChallengeIndex: 0,
            completedChallengeIndexes: [],
        });
    });

    it("normalizes valid progress", () => {
        const progress = normalizeProgress(
            {
                version: 1,
                currentChallengeIndex: 3,
                completedChallengeIndexes: [0, 1, 2],
            },
            19,
        );

        expect(progress).toEqual({
            version: 1,
            currentChallengeIndex: 3,
            completedChallengeIndexes: [0, 1, 2],
        });
    });

    it("filters invalid and duplicate completed challenge indexes", () => {
        const progress = normalizeProgress(
            {
                version: 1,
                currentChallengeIndex: 2,
                completedChallengeIndexes: [2, 1, 1, -5, 900, "3"],
            },
            19,
        );

        expect(progress.completedChallengeIndexes).toEqual([1, 2]);
    });

    it("clamps the current challenge index to the valid range", () => {
        expect(
            normalizeProgress(
                {
                    version: 1,
                    currentChallengeIndex: 100,
                    completedChallengeIndexes: [],
                },
                19,
            ).currentChallengeIndex,
        ).toBe(18);

        expect(
            normalizeProgress(
                {
                    version: 1,
                    currentChallengeIndex: -10,
                    completedChallengeIndexes: [],
                },
                19,
            ).currentChallengeIndex,
        ).toBe(0);
    });

    it("returns default progress for an unsupported version", () => {
        const progress = normalizeProgress(
            {
                version: 999,
                currentChallengeIndex: 5,
                completedChallengeIndexes: [0, 1, 2],
            },
            19,
        );

        expect(progress).toEqual(createDefaultProgress());
    });

    it("returns default progress when challenge count is invalid", () => {
        expect(
            normalizeProgress(
                {
                    version: 1,
                    currentChallengeIndex: 0,
                    completedChallengeIndexes: [],
                },
                0,
            ),
        ).toEqual(createDefaultProgress());
    });

    it("returns default progress when storage is empty", () => {
        const storage = createMemoryStorage();

        expect(loadProgress(19, storage)).toEqual(
            createDefaultProgress(),
        );
    });

    it("returns default progress for malformed stored JSON", () => {
        const storage = createMemoryStorage({
            "thesqlorian.progress": "{broken-json",
        });

        expect(loadProgress(19, storage)).toEqual(
            createDefaultProgress(),
        );
    });

    it("loads and normalizes saved progress", () => {
        const storage = createMemoryStorage({
            "thesqlorian.progress": JSON.stringify({
                version: 1,
                currentChallengeIndex: 100,
                completedChallengeIndexes: [0, 1, 1, 500],
            }),
        });

        expect(loadProgress(19, storage)).toEqual({
            version: 1,
            currentChallengeIndex: 18,
            completedChallengeIndexes: [0, 1],
        });
    });

    it("saves normalized progress", () => {
        const storage = createMemoryStorage();

        const savedProgress = saveProgress(
            {
                version: 1,
                currentChallengeIndex: 100,
                completedChallengeIndexes: [2, 2, 1, -1],
            },
            19,
            storage,
        );

        expect(savedProgress).toEqual({
            version: 1,
            currentChallengeIndex: 18,
            completedChallengeIndexes: [1, 2],
        });

        expect(
            JSON.parse(storage.getItem("thesqlorian.progress")),
        ).toEqual(savedProgress);
    });

    it("marks a challenge as completed without duplicates", () => {
        const progress = {
            version: 1,
            currentChallengeIndex: 2,
            completedChallengeIndexes: [0, 1],
        };

        const updatedProgress = markChallengeCompleted(
            progress,
            2,
            19,
        );

        const repeatedProgress = markChallengeCompleted(
            updatedProgress,
            2,
            19,
        );

        expect(repeatedProgress.completedChallengeIndexes).toEqual([
            0,
            1,
            2,
        ]);
    });

    it("safely handles malformed progress when marking a challenge complete", () => {
        const progress = markChallengeCompleted(
            {
                version: 1,
                currentChallengeIndex: 0,
                completedChallengeIndexes: "invalid",
            },
            0,
            19,
        );

        expect(progress.completedChallengeIndexes).toEqual([0]);
    });

    it("resets saved progress", () => {
        const storage = createMemoryStorage({
            "thesqlorian.progress": JSON.stringify({
                version: 1,
                currentChallengeIndex: 5,
                completedChallengeIndexes: [0, 1, 2, 3, 4],
            }),
        });

        resetProgress(storage);

        expect(storage.getItem("thesqlorian.progress")).toBeNull();
    });

    it("falls back safely when reading storage throws", () => {
        const storage = {
            getItem() {
                throw new Error("Storage unavailable");
            },
        };

        expect(loadProgress(19, storage)).toEqual(
            createDefaultProgress(),
        );
    });

    it("continues safely when writing storage throws", () => {
        const storage = {
            setItem() {
                throw new Error("Storage unavailable");
            },
        };

        expect(() =>
            saveProgress(
                {
                    version: 1,
                    currentChallengeIndex: 2,
                    completedChallengeIndexes: [0, 1],
                },
                19,
                storage,
            ),
        ).not.toThrow();
    });
});