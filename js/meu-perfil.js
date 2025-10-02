document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        window.location.href = './login.html';
        return;
    }

    const profileForm = document.getElementById('profile-form');
    const logoutButton = document.getElementById('logout-button');
    const deleteAccountButton = document.getElementById('delete-account-button');
    const notificationContainer = document.getElementById('notification-container');
    const welcomeMessage = document.querySelector('.header__user-menu');

    function showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        const iconClass = type === 'success' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-circle';
        toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
        notificationContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('exiting');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    }

    async function loadRoles() {
        try {
            const response = await fetch(`${API_URL}/roles`, {
                headers: { 'x-auth-token': token }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao carregar funções.');
            }

            const roles = await response.json();
            const roleSelect = document.getElementById('role');
            roleSelect.innerHTML = ''; // Clear existing options

            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.nome;
                roleSelect.appendChild(option);
            });

        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    async function loadUserProfile() {
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: { 'x-auth-token': token }
            });

            if (response.status === 401) {
                logout();
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao carregar perfil.');
            }

            const user = await response.json();

            document.getElementById('nome').value = user.nome || '';
            document.getElementById('sobrenome').value = user.sobrenome || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('cpf').value = user.cpf || '';
            document.getElementById('data_nascimento').value = user.data_nascimento ? user.data_nascimento.split('T')[0] : '';
            document.getElementById('profissao').value = user.profissao || '';
            document.getElementById('escolaridade').value = user.escolaridade || '';

            await loadRoles(); // Load roles into the dropdown

            if (user.role_id) {
                document.getElementById('role').value = user.role_id;
            }

            if (welcomeMessage) {
                const userName = user.nome || 'Usuário';
                const welcomeText = document.createElement('span');
                welcomeText.textContent = `Olá, ${userName}`;
                welcomeText.classList.add('header__welcome-message');
                welcomeMessage.prepend(welcomeText);
            }

        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
            nome: document.getElementById('nome').value,
            sobrenome: document.getElementById('sobrenome').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            data_nascimento: document.getElementById('data_nascimento').value,
            profissao: document.getElementById('profissao').value,
            escolaridade: document.getElementById('escolaridade').value,
            role_id: document.getElementById('role').value
        };

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password && password !== confirmPassword) {
            showNotification('As senhas não coincidem.', 'error');
            return;
        }

        if (password) {
            updatedData.senha = password;
        }

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao atualizar perfil.');
            }

            showNotification('Perfil atualizado com sucesso!');
            // Optionally, reload the user profile to reflect changes immediately
            loadUserProfile();

        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    deleteAccountButton.addEventListener('click', async () => {
        if (confirm('Tem certeza de que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
            try {
                const response = await fetch(`${API_URL}/users/me`, {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao deletar a conta.');
                }

                showNotification('Sua conta foi deletada com sucesso.');
                setTimeout(() => logout(), 2000);

            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    });

    function logout() {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = './login.html';
    }

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Você foi desconectado.');
        setTimeout(() => logout(), 1500);
    });

    loadUserProfile();
});
