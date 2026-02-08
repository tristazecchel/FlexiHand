document.querySelector('.btn-delete').addEventListener('click', () => {
    const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (confirmed) {
        console.log("Account deleted requested.");
        // Add logic to call your backend API here
    }
});

document.querySelector('.btn-logout').addEventListener('click', () => {
    alert("Logging out...");
    // Logic to clear session and redirect to login page
});

// Handle Goal Selection
const goalSelect = document.getElementById('dailyGoal');
goalSelect.addEventListener('change', (e) => {
    console.log(`New daily goal set to: ${e.target.value} lessons`);
});