document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    const welcomeMessageElement = document.getElementById('welcomeMessage');
    const formateursListElement = document.getElementById('formateursList');
    const logoutButton = document.getElementById('logoutButton');

    const API_BASE_URL = 'http://localhost:3000/api'; // Ajustez si votre port est différent

    // --- Gestionnaire de formulaire de connexion ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('jwtToken', data.token);
                    if (messageElement) messageElement.textContent = 'Connexion réussie ! Redirection...';
                    messageElement.style.color = 'green';
                    window.location.href = '/'; // Rediriger vers la page d'accueil protégée
                } else {
                    if (messageElement) messageElement.textContent = data.message || 'Email ou mot de passe incorrect.';
                    messageElement.style.color = 'red';
                }
            } catch (error) {
                console.error('Erreur de connexion:', error);
                if (messageElement) messageElement.textContent = 'Erreur lors de la connexion au serveur.';
                messageElement.style.color = 'red';
            }
        });
    }

    // --- Gestionnaire de formulaire d'inscription ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nom, prenom, email, password }),
                });

                const data = await response.json();

                if (response.status === 201) {
                    if (messageElement) messageElement.textContent = 'Inscription réussie ! Vous pouvez vous connecter.';
                    messageElement.style.color = 'green';
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    if (messageElement) messageElement.textContent = data.message || 'Erreur lors de l\'inscription.';
                    messageElement.style.color = 'red';
                }
            } catch (error) {
                console.error('Erreur d\'inscription:', error);
                if (messageElement) messageElement.textContent = 'Erreur lors de la connexion au serveur.';
                messageElement.style.color = 'red';
            }
        });
    }


    // --- Gestion de la page d'accueil (protégée) ---
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            if (welcomeMessageElement) welcomeMessageElement.textContent = 'Vous devez être connecté pour voir cette page.';
            // Optionnel: Rediriger vers la page de connexion si aucun token n'est trouvé
            // window.location.href = '/login.html';
            if (dataContainer) dataContainer.style.display = 'none';
        } else {
            if (welcomeMessageElement) welcomeMessageElement.textContent = 'Bienvenue !';
            fetchFormateurs(token);
        }
    }

    // --- Bouton de déconnexion ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('jwtToken');
            if (welcomeMessageElement) welcomeMessageElement.textContent = 'Vous avez été déconnecté.';
            if (formateursListElement) formateursListElement.innerHTML = '';
            if (dataContainer) dataContainer.style.display = 'none';
            alert('Vous avez été déconnecté.');
            window.location.href = '/login.html';
        });
    }

    // --- Fonction pour récupérer les formateurs (exemple de requête authentifiée) ---
    async function fetchFormateurs(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/formateurs`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 401 || response.status === 403) {
                if (welcomeMessageElement) welcomeMessageElement.textContent = 'Session expirée ou invalide. Veuillez vous reconnecter.';
                if (formateursListElement) formateursListElement.innerHTML = '';
                localStorage.removeItem('jwtToken'); // Nettoyer le token invalide
                // Optionnel: Rediriger vers login
                // window.location.href = '/login.html';
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
            }

            const formateurs = await response.json();
            if (formateursListElement) {
                formateursListElement.innerHTML = ''; // Vider la liste précédente
                if (formateurs.length > 0) {
                    formateurs.forEach(formateur => {
                        const li = document.createElement('li');
                        li.textContent = `${formateur.prenom} ${formateur.nom} - Spécialité: ${formateur.specialite}`;
                        formateursListElement.appendChild(li);
                    });
                } else {
                    formateursListElement.innerHTML = '<li>Aucun formateur trouvé.</li>';
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des formateurs:', error);
            if (formateursListElement) formateursListElement.innerHTML = `<li>Erreur: ${error.message}</li>`;
        }
    }
});