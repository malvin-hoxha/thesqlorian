const STORAGE_KEY = "thesqlorian.progress";
const PROGRESS_VERSION = 1;

export function createDefaultProgress() { //safe fallback
    return {
        version: PROGRESS_VERSION,
        currentChallengeIndex: 0,
        completedChallengeIndexes: [],
    };
}


//completedChallengeIndexes: [1, 1, 2, -5, 900] => [1, 2] rejecting corrupted/invalid data
export function normalizeProgress(progress, challengeCount) {
    const defaultProgress = createDefaultProgress();

    if (!progress || typeof progress !== "object" || progress.version !== PROGRESS_VERSION
        || !Number.isInteger(challengeCount) || challengeCount <= 0
    ) {
        return defaultProgress;
    }

    const currentChallengeIndex = Number.isInteger(progress.currentChallengeIndex) ? Math.min(
        Math.max(progress.currentChallengeIndex, 0),
        challengeCount - 1,
    ) : 0;

    const completedChallengeIndexes = Array.isArray(progress.completedChallengeIndexes) ? [
        ...new Set ( // remove duplicates
            progress.completedChallengeIndexes.filter(
                (index) =>
                    Number.isInteger(index) && index >= 0 && index < challengeCount
            ) 
        )
    ].sort((a,b) => a - b) : [];

    return {
        version: PROGRESS_VERSION,
        currentChallengeIndex,
        completedChallengeIndexes,
    };
}

function getBrowserStorage() {
    try {
        return globalThis.localStorage ?? null;
    } catch {
        return null;
    }
}

export function loadProgress(challengeCount, storage = getBrowserStorage()) {
    if (!storage) {
        return createDefaultProgress();
    }

    try {
        const storedProgress = storage.getItem(STORAGE_KEY);

        if (!storedProgress) {
            return createDefaultProgress();
        }

        return normalizeProgress(
            JSON.parse(storedProgress),
            challengeCount,
        );
    } catch {
        return createDefaultProgress();
    }
}

export function saveProgress(progress, challengeCount, storage = getBrowserStorage()) {
    const normalizedProgress = normalizeProgress(progress, challengeCount);

    try {
        storage?.setItem(STORAGE_KEY, JSON.stringify(normalizedProgress));
    } catch {
        // The game should continue even if browser storage is unavailable.
    }

    return normalizedProgress;
}

export function markChallengeCompleted(progress, challengeIndex, challengeCount) {
    const normalizedProgress = normalizeProgress(progress, challengeCount);
    return normalizeProgress(
        {
            ...normalizedProgress,
            completedChallengeIndexes: [
                ...normalizedProgress.completedChallengeIndexes,
                challengeIndex,
            ],
        },
        challengeCount,
    );
}

export function resetProgress(storage = getBrowserStorage()) {
    try {
        storage?.removeItem(STORAGE_KEY);
    } catch {
        // The game should continue even if browser storage is unavailable.
    }
}