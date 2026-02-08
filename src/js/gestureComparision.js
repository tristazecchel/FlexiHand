// Compare user landmarks to reference and return a percent match
export function compareGesture(userLandmarks, referenceLandmarks) {
    if (!userLandmarks || !referenceLandmarks) return 0;
    if (userLandmarks.length !== referenceLandmarks.length) return 0;

    let totalDistance = 0;

    for (let i = 0; i < userLandmarks.length; i++) {
        const u = userLandmarks[i];
        const r = referenceLandmarks[i];
        const dx = u.x - r.x;
        const dy = u.y - r.y;
        const dz = u.z - r.z;
        totalDistance += Math.sqrt(dx*dx + dy*dy + dz*dz);
    }

    // Normalize by number of landmarks
    const avgDistance = totalDistance / userLandmarks.length;

    // Convert to percent: smaller distance = higher score
    const maxDistance = 1.5;
    let score = Math.max(0, 100 * (1 - avgDistance / maxDistance));

    return Math.round(score);
}