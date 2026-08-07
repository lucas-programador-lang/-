document.addEventListener('DOMContentLoaded', () => {
    // Tratamento do formulário de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            
            if (Auth.login(user, pass)) {
                window.location.href = 'index.html';
            } else {
                alert('Preencha os campos corretamente!');
            }
        });
    }

    // Tratamento do formulário de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('regUser').value;
            const pass = document.getElementById('regPass').value;
            
            if (Auth.register(user, pass)) {
                alert('Cadastro realizado com sucesso! Você ganhou R$ 5,00.');
                window.location.href = 'index.html';
            } else {
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
        }
    }
});
