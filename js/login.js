document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('remember-password');
    const togglePassword = document.getElementById('togglePassword');
    const yearSpan = document.getElementById('year');
    const notificationContainer = document.getElementById('notification-container');

    // --- NOVOS ELEMENTOS PARA RECUPERAÇÃO DE SENHA ---
    const recoveryForm = document.getElementById('recoveryForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginLink = document.getElementById('backToLoginLink');

    // --- FUNÇÃO PARA EXIBIR NOTIFICAÇÕES (Toast) ---
    function showNotification(message, type = 'success') {
        const toast = document.createElement('div');
        toast.classList.add('toast', type);

        const iconClass = type === 'success' ? 'fa-solid fa-check-circle' : 'fa-solid fa-exclamation-circle';
        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(toast);

        // Define um tempo para a notificação desaparecer
        setTimeout(() => {
            toast.classList.add('exiting');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // --- LÓGICAS DA PÁGINA ---

    // Define o ano atual no rodapé
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Carrega o e-mail salvo no localStorage, se houver
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }

    // Funcionalidade para mostrar/ocultar a senha
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            const icon = togglePassword.querySelector('i');

            passwordInput.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye', isPassword);
            icon.classList.toggle('fa-eye-slash', !isPassword);
            togglePassword.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
        });
    }

    // Manipulação do envio do formulário de LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!emailInput.value || !passwordInput.value) {
                showNotification('Por favor, preencha e-mail e senha.', 'error');
                return;
            }

            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            showNotification('Login bem-sucedido! Redirecionando...');
            sessionStorage.setItem('isLoggedIn', 'true');
            
            window.location.href = '../index.html';
        });
    }
    
    // --- LÓGICA PARA TROCAR ENTRE FORMULÁRIOS ---

    // Quando clicar em "Esqueci minha senha"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            recoveryForm.classList.remove('hidden');
        });
    }

    // Quando clicar em "Voltar para o login"
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            recoveryForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    // Manipulação do envio do formulário de RECUPERAÇÃO
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const recoveryEmailInput = document.getElementById('recovery-email');

            if (!recoveryEmailInput.value) {
                showNotification('Por favor, digite um e-mail.', 'error');
                return;
            }

            // Exibe a mensagem de sucesso
            showNotification('Um e-mail com instruções para recuperar sua senha foi enviado.');

            // Opcional: Volta para a tela de login após a mensagem
            setTimeout(() => {
                recoveryForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                recoveryEmailInput.value = ''; // Limpa o campo
            }, 3500);
        });
    }
});