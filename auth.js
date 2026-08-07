// Sistema de autenticação e controle de sessões básicas
const Auth = {
    isLoggedIn() {
        return localStorage.getItem('yacht_logged') === 'true';
    },

    login(username, password) {
        if (username && password) {
            localStorage.setItem('yacht_logged', 'true');
            localStorage.setItem('yacht_user', username);
            return true;
        }
        return false;
    },

    register(username, password) {
        if (username && password) {
            // Dar 5,00 no cadastro conforme regras
            localStorage.setItem('yacht_logged', 'true');
            localStorage.setItem('yacht_user', username);
            localStorage.setItem('yacht_balance', '5.00');
            return true;
        }
        return false;
    },

    logout() {
        localStorage.removeItem('yacht_logged');
        window.location.href = 'login.html';
    },

    protectRoute() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
};
