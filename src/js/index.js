document.addEventListener('DOMContentLoaded', () => {
    
    // Log Out functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            alert("Logging out...");
            // Redirect logic would go here
        }
    });

    // Interaction for Feature Cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const feature = card.querySelector('h3').innerText;
            alert(`You clicked on: ${feature}`);
        });
    });

});