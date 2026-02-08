// Default gestures if nothing is saved yet
export const referenceGestures = {
    openPalm: null,
    closedFist: null,
    hook: null,
    tabletop: null,
    thumbBent: null
};

// Function to update a gesture and save to localStorage
export function saveReferenceGesture(name, landmarks) {
    referenceGestures[name] = landmarks;
    localStorage.setItem('referenceGestures', JSON.stringify(referenceGestures));
    console.log(`Saved gesture '${name}' to localStorage`);
}

// Load gestures from localStorage when the page loads
export function loadReferenceGestures() {
    const saved = localStorage.getItem('referenceGestures');
    if (saved) {
        const parsed = JSON.parse(saved);
        for (const key in parsed) {
            if (parsed[key]) referenceGestures[key] = parsed[key];
        }
    }
}

// Call loadReferenceGestures on module load
loadReferenceGestures();