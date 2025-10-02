document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('remember-password');
    const togglePassword = document.getElementById('togglePassword');
    const yearSpan = document.getElementById('year');
    const notificationContainer = document.getElementById('notification-container');

    // --- ELEMENTOS PARA RECUPERAÇÃO DE SENHA ---
    const recoveryForm = document.getElementById('recoveryForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');

    // --- FUNÇÃO PARA EXIBIR NOTIFICAÇÕES (Toast) ---
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

    // --- LÓGICAS DA PÁGINA ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            const icon = togglePassword.querySelector('i');
            passwordInput.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye', isPassword);
            icon.classList.toggle('fa-eye-slash', !isPassword);
        });
    }

    // --- SUBMISSÃO DO FORMULÁRIO DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!emailInput.value || !passwordInput.value) {
                return showNotification('Por favor, preencha e-mail e senha.', 'error');
            }

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value, password: passwordInput.value })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer login.');
                }

                if (rememberCheckbox.checked) {
                    localStorage.setItem('rememberedEmail', emailInput.value);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                sessionStorage.setItem('authToken', data.token);
                sessionStorage.setItem('isLoggedIn', 'true');
                showNotification('Login bem-sucedido! Redirecionando...');
                setTimeout(() => window.location.href = '../index.html', 1500);

            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }
    
    // --- LÓGICA PARA TROCAR ENTRE FORMULÁRIOS DE LOGIN E RECUPERAÇÃO ---
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            recoveryForm.classList.remove('hidden');
        });
    }

    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            recoveryForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    // --- SUBMISSÃO DO FORMULÁRIO DE RECUPERAÇÃO ---
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const recoveryEmailInput = document.getElementById('recovery-email');

            if (!recoveryEmailInput.value) {
                return showNotification('Por favor, digite um e-mail.', 'error');
            }

            try {
                const response = await fetch(`${API_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: recoveryEmailInput.value })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao solicitar recuperação.');
                }

                showNotification('Se o e-mail existir, uma instrução será enviada.');
                recoveryForm.reset();
                loginForm.classList.remove('hidden');
                recoveryForm.classList.add('hidden');

            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }
});