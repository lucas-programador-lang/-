document.addEventListener('DOMContentLoaded', () => {
    // ===== Modais (ex: Depositar) =====
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (modalId === 'depositModal') {
                const qrView = document.getElementById('depositQrView');
                if (qrView) {
                    qrView.style.display = 'none';
                    document.getElementById('qrcodeCanvas').innerHTML = '';
                }
            }
            modal.classList.add('open');
            document.body.classList.add('modal-open');
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            document.body.classList.remove('modal-open');
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.open').forEach((modal) => {
                modal.classList.remove('open');
            });
            document.body.classList.remove('modal-open');
        }
    });

    // ===== QR Code Pix (modal de Depositar) =====
    window.gerarQrCodeDeposito = function () {
        const cpfInput = document.getElementById('depositCpf');
        const telefoneInput = document.getElementById('depositTelefone');

        if (!cpfInput.value.trim() || !telefoneInput.value.trim()) {
            alert('Preencha CPF e Telefone para gerar o Pix.');
            return;
        }

        // Código Pix "copia e cola" (exemplo — substituir pela integração real do gateway)
        const pixCode = '00020126580014BR.GOV.BCB.PIX2572qrcode.cartwavehub.com.br/v2/qr/cob/945c7fe1-5dc0-49a1-be8d-041bf95642e05204000053039865802BR5925PLATAFORMA6009SAO PAULO62070503***6304ABCD';

        const qrContainer = document.getElementById('qrcodeCanvas');
        qrContainer.innerHTML = '';

        if (typeof QRCode !== 'undefined') {
            new QRCode(qrContainer, {
                text: pixCode,
                width: 200,
                height: 200,
                colorDark: '#0b1420',
                colorLight: '#ffffff'
            });
        } else {
            console.error('Biblioteca QRCode não carregada.');
            qrContainer.innerText = 'Não foi possível gerar o QR Code.';
        }

        document.getElementById('depositPixCode').innerText = pixCode;
        document.getElementById('depositQrView').style.display = 'block';
    };

    window.copiarCodigoPixDeposito = function () {
        const pixCode = document.getElementById('depositPixCode').innerText;
        navigator.clipboard.writeText(pixCode).then(() => alert('Código Pix copiado!'));
    };

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

            // Atualiza o saldo em todos os lugares onde ele aparece (Início, Carteira, Perfil)
            const balanceTargets = ['userBalance', 'sacarSaldoDisponivel'];
            balanceTargets.forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.innerText = `R$ ${savedBalance}`;
            });

            // Preenche dados do Perfil, se o Auth expuser o usuário logado
            const perfilUsuario = document.getElementById('perfilUsuario');
            const perfilSaldo = document.getElementById('perfilSaldo');
            if (perfilUsuario) {
                const currentUser = (typeof Auth.getCurrentUser === 'function')
                    ? Auth.getCurrentUser()
                    : localStorage.getItem('yacht_user') || '-';
                perfilUsuario.innerText = currentUser || '-';
            }
            if (perfilSaldo) {
                perfilSaldo.innerText = `R$ ${savedBalance}`;
            }
        } else {
            console.error('Auth não está definido. A rota do dashboard não pôde ser protegida.');
        }

        // ===== Navegação da Sidebar (troca de seções) =====
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        const sections = document.querySelectorAll('.page-section');

        function showSection(sectionKey) {
            sections.forEach((section) => {
                section.classList.toggle('active', section.id === `section-${sectionKey}`);
            });
            navItems.forEach((item) => {
                item.classList.toggle('active', item.dataset.section === sectionKey);
            });
            // Lembra a última seção visitada
            localStorage.setItem('yacht_last_section', sectionKey);
        }

        navItems.forEach((item) => {
            item.addEventListener('click', () => {
                showSection(item.dataset.section);
            });
        });

        // Restaura a última seção visitada (padrão: início)
        const lastSection = localStorage.getItem('yacht_last_section');
        if (lastSection && document.getElementById(`section-${lastSection}`)) {
            showSection(lastSection);
        }
    }
});
