document.addEventListener('DOMContentLoaded', () => {
    // Initialize Chart Bars
    const chartContainer = document.getElementById('activityChart');
    const weeklyData = [15, 40, 25, 60, 35, 10, 50];

    weeklyData.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = '0%';
        chartContainer.appendChild(bar);
        setTimeout(() => { bar.style.height = value + '%'; }, 200);
    });

    // ---- Exercise Recommendation Logic ----

    // Maps each test exercise to its recommended exercise info
    const exerciseMap = {
        openPalm: {
            name: 'Table Stretch',
            reps: 'x 10',
            instructions: 'Place your hand flat on the table and raise your palm higher while keeping your fingers flat on the table by bending at the knuckle. Hold for 3 seconds, lower your palm back down. Repeat.'
        },
        closedFist: {
            name: 'Squeeze a Soft Ball',
            reps: 'x 10',
            instructions: 'Ball your hand into a loose fist while holding a soft ball, slowly squeeze the ball for 3 seconds then release the tension. Repeat.'
        },
        hook: {
            name: 'Hook Bend',
            reps: 'x 10',
            instructions: 'Start with your hand in an open palm position and slowly curl your fingers into a hook position. Hold for 3 seconds, release the curl back into the open palm position. Repeat.'
        },
        tabletop: {
            name: 'Tabletop Bend',
            reps: 'x 10',
            instructions: 'Start with your hand in an open palm position and slowly bend your fingers into the tabletop bend position. Hold for 3 seconds, raise your fingers back up to the open palm position. Repeat.'
        },
        thumbBent: {
            name: 'Touch Thumb to Each Finger Tip',
            reps: 'x 5 each finger',
            instructions: 'Touch the tip of your thumb to the tip of each of the other fingertips one at a time. Repeat 5 times for each finger.'
        }
    };

    function getSeverity(percent) {
        if (percent < 45) return { level: 'high', frequency: 'Once every day', seeSpecialist: true };
        if (percent < 60) return { level: 'medium', frequency: 'Once every 2nd day', seeSpecialist: false };
        if (percent < 85) return { level: 'low', frequency: 'Once every 3rd day', seeSpecialist: false };
        return null; // 85% or above — no recommendation needed
    }

    function buildRecommendations() {
        const raw = localStorage.getItem('evaluationResults');
        if (!raw) return;

        let results;
        try { results = JSON.parse(raw); } catch { return; }
        if (!Array.isArray(results) || results.length === 0) return;

        const recSection = document.getElementById('recommendationsSection');
        const recList = document.getElementById('recommendationsList');
        const noRec = document.getElementById('noRecommendations');

        const recommendations = [];

        results.forEach(({ exercise, percent }) => {
            const severity = getSeverity(percent);
            if (!severity) return; // score is good, no recommendation

            const info = exerciseMap[exercise];
            if (!info) return;

            recommendations.push({ exercise, percent, severity, info });
        });

        if (recommendations.length === 0) {
            // All scores are 85%+
            noRec.style.display = 'block';
            recSection.style.display = 'none';
            return;
        }

        // Sort by severity: high first, then medium, then low
        const severityOrder = { high: 0, medium: 1, low: 2 };
        recommendations.sort((a, b) => severityOrder[a.severity.level] - severityOrder[b.severity.level]);

        recList.innerHTML = '';

        recommendations.forEach(({ percent, severity, info }) => {
            const card = document.createElement('div');
            card.className = `rec-card severity-${severity.level}`;

            card.innerHTML = `
                <h4>${info.name} ${info.reps}</h4>
                <span class="rec-badge ${severity.level}">
                    ${severity.level === 'high' ? 'Needs Attention' : severity.level === 'medium' ? 'Moderate' : 'Mild'}
                </span>
                <p class="rec-score">Your score: ${percent}%</p>
                <p class="rec-instructions">${info.instructions}</p>
                <p class="rec-frequency">Frequency: ${severity.frequency}</p>
                ${severity.seeSpecialist ? '<p class="rec-specialist">We recommend seeing a specialist.</p>' : ''}
            `;

            recList.appendChild(card);
        });

        recSection.style.display = 'block';
        noRec.style.display = 'none';
    }

    buildRecommendations();
});
