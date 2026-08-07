document.addEventListener('DOMContentLoaded', () => {
    // Tratamento do formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (typeof Auth === 'undefined') {
                console.error('Auth não está definido. Verifique se o script de autenticação foi carregado antes deste arquivo.');
                alert('Erro ao carregar o sistema de login. Tente recarregar a página.');
                return;
            }

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

            if (typeof Auth === 'undefined') {
                console.error('Auth não está definido. Verifique se o script de autenticação foi carregado antes deste arquivo.');
                alert('Erro ao carregar o sistema de cadastro. Tente recarregar a página.');
                return;
            }

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
    // Se estiver na index (dashboard), protege a rota e atualiza dados
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        if (typeof Auth !== 'undefined') {
            Auth.protectRoute();
            const savedBalance = localStorage.getItem('yacht_balance') || '5.00';
            const balanceElement = document.getElementById('userBalance');
            if (balanceElement) {
                balanceElement.innerText = `R$ ${savedBalance}`;
            }
        } else {
            console.error('Auth não está definido. A rota do dashboard não pôde ser protegida.');
        }
    }
});
