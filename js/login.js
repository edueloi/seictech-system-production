document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.getElementById('remember-password');
    const togglePassword = document.getElementById('togglePassword');
    const yearSpan = document.getElementById('year');
    const notificationContainer = document.getElementById('notification-container');

    // --- NOVA FUNÇÃO PARA EXIBIR NOTIFICAÇÕES ---
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
            // Espera a animação de saída terminar para remover o elemento
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000); // A notificação some após 3 segundos
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

    // Manipulação do envio do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validação simples
            if (!emailInput.value || !passwordInput.value) {
                // USA A NOVA NOTIFICAÇÃO DE ERRO
                showNotification('Por favor, preencha e-mail e senha.', 'error');
                return;
            }

            // Funcionalidade "Salvar login"
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // USA A NOVA NOTIFICAÇÃO DE SUCESSO
            showNotification('Login bem-sucedido! Redirecionando...');
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // REDIRECIONAMENTO IMEDIATO
            window.location.href = '../index.html';
        });
    }
});