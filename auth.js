// Sistema de autenticação e controle de sessões básicas
const Auth = {
    _getUsers() {
        try {
            return JSON.parse(localStorage.getItem('yacht_users')) || {};
        } catch (err) {
            console.error('Erro ao ler yacht_users do localStorage:', err);
            return {};
        }
    },
    _saveUsers(users) {
        localStorage.setItem('yacht_users', JSON.stringify(users));
    },
    isLoggedIn() {
        return localStorage.getItem('yacht_logged') === 'true';
    },
    login(email, password) {
        if (email && password) {
            const users = this._getUsers();
            const account = users[email];

            // Só autentica se o e-mail existir e a senha bater
            if (!account || account.password !== password) {
                return false;
            }

            localStorage.setItem('yacht_logged', 'true');
            localStorage.setItem('yacht_user', email);
            localStorage.setItem('yacht_name', account.fullName);
            localStorage.setItem('yacht_balance', account.balance);
            return true;
        }
        return false;
    },
    register(fullName, email, password) {
        if (fullName && email && password) {
            const users = this._getUsers();

            // Não permite recadastrar um e-mail já existente
            if (users[email]) {
                return false;
            }

            // Dar 5,00 no cadastro conforme regras
            users[email] = { password: password, balance: '5.00', fullName: fullName };
            this._saveUsers(users);

            localStorage.setItem('yacht_logged', 'true');
            localStorage.setItem('yacht_user', email);
            localStorage.setItem('yacht_name', fullName);
            localStorage.setItem('yacht_balance', '5.00');
            return true;
        }
        return false;
    },
    logout() {
        localStorage.removeItem('yacht_logged');
        localStorage.removeItem('yacht_user');
        localStorage.removeItem('yacht_name');
        localStorage.removeItem('yacht_balance');
        window.location.href = 'login.html';
    },
    protectRoute() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Botão de olhinho para mostrar/ocultar senha (login e cadastro)
    const eyeOpenIcon = `<svg class="icon-eye" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/>
    </svg>`;
    const eyeOffIcon = `<svg class="icon-eye" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.5 3.5l17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M10.6 5.2C11 5.1 11.5 5 12 5c7 0 10.5 7 10.5 7-.6 1.2-1.5 2.6-2.8 3.9M6.6 6.6C3.8 8.3 1.5 12 1.5 12S5 19 12 19c1.4 0 2.7-.3 3.8-.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9.9 10c-.3.5-.4 1-.4 1.6 0 1.6 1.3 2.9 2.9 2.9.5 0 1-.1 1.5-.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

    document.querySelectorAll('.toggle-password').forEach((toggleBtn) => {
        toggleBtn.addEventListener('click', () => {
            const targetId = toggleBtn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) {
                console.error(`Campo de senha "${targetId}" não encontrado para o botão de mostrar/ocultar.`);
                return;
            }
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            toggleBtn.innerHTML = isHidden ? eyeOffIcon : eyeOpenIcon;
            toggleBtn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
        });
    });

    // Tratamento do formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            if (!emailInput || !passwordInput) {
                console.error('Campos de e-mail/senha não encontrados no formulário de login.');
                alert('Erro no formulário. Tente recarregar a página.');
                return;
            }

            const email = emailInput.value;
            const pass = passwordInput.value;

            try {
                if (Auth.login(email, pass)) {
                    window.location.href = 'index.html';
                } else {
                    alert('E-mail ou senha incorretos!');
                }
            } catch (err) {
                console.error('Erro ao tentar login:', err);
                alert('Erro ao realizar login.');
            }
        });
    }
    // Tratamento do formulário de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const regNameInput = document.getElementById('regName');
            const regEmailInput = document.getElementById('regEmail');
            const regPassInput = document.getElementById('regPass');

            if (!regNameInput || !regEmailInput || !regPassInput) {
                console.error('Campos de nome/e-mail/senha não encontrados no formulário de registro.');
                alert('Erro no formulário. Tente recarregar a página.');
                return;
            }

            const fullName = regNameInput.value;
            const email = regEmailInput.value;
            const pass = regPassInput.value;

            try {
                if (Auth.register(fullName, email, pass)) {
                    alert('Cadastro realizado com sucesso! Você ganhou R$ 5,00.');
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao realizar cadastro. Esse e-mail já pode estar cadastrado.');
                }
            } catch (err) {
                console.error('Erro ao tentar cadastro:', err);
                alert('Erro ao realizar cadastro.');
            }
        });
    }
});
