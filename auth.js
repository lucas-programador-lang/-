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
    login(username, password) {
        if (username && password) {
            const users = this._getUsers();
            const account = users[username];

            // Só autentica se o usuário existir e a senha bater
            if (!account || account.password !== password) {
                return false;
            }

            localStorage.setItem('yacht_logged', 'true');
            localStorage.setItem('yacht_user', username);
            localStorage.setItem('yacht_balance', account.balance);
            return true;
        }
        return false;
    },
    register(username, password) {
        if (username && password) {
            const users = this._getUsers();

            // Não permite recadastrar um usuário já existente
            if (users[username]) {
                return false;
            }

            // Dar 5,00 no cadastro conforme regras
            users[username] = { password: password, balance: '5.00' };
            this._saveUsers(users);

            localStorage.setItem('yacht_logged', 'true');
            localStorage.setItem('yacht_user', username);
            localStorage.setItem('yacht_balance', '5.00');
            return true;
        }
        return false;
    },
    logout() {
        localStorage.removeItem('yacht_logged');
        localStorage.removeItem('yacht_user');
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
    // Tratamento do formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            if (!usernameInput || !passwordInput) {
                console.error('Campos de usuário/senha não encontrados no formulário de login.');
                alert('Erro no formulário. Tente recarregar a página.');
                return;
            }

            const user = usernameInput.value;
            const pass = passwordInput.value;

            try {
                if (Auth.login(user, pass)) {
                    window.location.href = 'index.html';
                } else {
                    alert('Preencha os campos corretamente!');
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

            const regUserInput = document.getElementById('regUser');
            const regPassInput = document.getElementById('regPass');

            if (!regUserInput || !regPassInput) {
                console.error('Campos de usuário/senha não encontrados no formulário de registro.');
                alert('Erro no formulário. Tente recarregar a página.');
                return;
            }

            const user = regUserInput.value;
            const pass = regPassInput.value;

            try {
                if (Auth.register(user, pass)) {
                    alert('Cadastro realizado com sucesso! Você ganhou R$ 5,00.');
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao realizar cadastro.');
                }
            } catch (err) {
                console.error('Erro ao tentar cadastro:', err);
                alert('Erro ao realizar cadastro.');
            }
        });
    }
});
