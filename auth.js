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
            toggleBtn.textContent = isHidden ? '🙈' : '👁️';
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
