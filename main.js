document.addEventListener('DOMContentLoaded', () => {

  /* ================================================
     1. MENU MOBILE — abre/fecha + fecha ao clicar link
     ================================================ */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navbar     = document.querySelector('.navbar');

  if (menuToggle && navbar) {
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('active');
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      document.body.style.overflow = isOpen ? 'hidden' : ''; // trava scroll
    });

    // Fecha ao clicar em qualquer link ou botão dentro do nav
    navbar.querySelectorAll('a, .btn').forEach(el => {
      el.addEventListener('click', () => {
        navbar.classList.remove('active');
        icon.className = 'fa-solid fa-bars';
        document.body.style.overflow = '';
      });
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
        navbar.classList.remove('active');
        icon.className = 'fa-solid fa-bars';
        document.body.style.overflow = '';
      }
    });
  }

  /* ================================================
     2. NAVBAR — sombra ao rolar
     ================================================ */
  const header = document.getElementById('header');

  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 50
        ? '0 4px 16px rgba(0,0,0,0.12)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // executa já na carga
  }

  /* ================================================
     3. LINK ATIVO NA NAVBAR — marca o link da página atual
     ================================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.style.color = 'var(--accent-color)';
    }
  });

  /* ================================================
     4. FADE-IN AO SCROLL — Intersection Observer
     ================================================ */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    // Adiciona .will-fade antes de observar — esconde o elemento só após
    // confirmar que o JS está rodando. Se JS falhar, conteúdo permanece visível.
    fadeEls.forEach(el => el.classList.add('will-fade'));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* ================================================
     5. FILTRO DE PROJETOS — botões .ftab
     ================================================ */
  const ftabs = document.querySelectorAll('.ftab');

  if (ftabs.length) {
    ftabs.forEach(btn => {
      btn.addEventListener('click', () => {
        // marca ativo
        ftabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filtro = btn.textContent.trim().toLowerCase();
        const cards  = document.querySelectorAll('.proj-card, .portfolio-item');

        cards.forEach(card => {
          const cat = (card.dataset.cat || '').toLowerCase();
          const show = filtro === 'todos' || cat === filtro;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ================================================
     6. FORMULÁRIO DE CONTATO — validação + feedback
     ================================================ */
  const form = document.getElementById('contato-form') || document.querySelector('.form-modern');

  if (form) {

    // Máscara de telefone (campo com id="telefone", se existir)
    const telInput = form.querySelector('#telefone');
    if (telInput) {
      telInput.addEventListener('input', () => {
        let v = telInput.value.replace(/\D/g, '').slice(0, 11);
        if (v.length >= 7) {
          v = `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3,7)}-${v.slice(7)}`;
        } else if (v.length >= 3) {
          v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
          v = `(${v}`;
        }
        telInput.value = v;
      });
    }

    // Valida um campo individual; retorna true se válido
    function validateField(field) {
      const group = field.closest('.form-group');
      let ok = true;

      if (field.required && !field.value.trim()) ok = false;

      if (field.type === 'email' && field.value.trim()) {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      }

      if (group) group.classList.toggle('has-error', !ok);
      field.classList.toggle('input-error', !ok);
      return ok;
    }

    // Validação em tempo real ao sair do campo ou digitar
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur',  () => validateField(field));
      field.addEventListener('input', () => validateField(field));
    });

    // Envio
    const btnSubmit   = form.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('form-success');
    const btnNovo     = document.getElementById('btn-novo-contato');
    const originalLabel = btnSubmit ? btnSubmit.innerHTML : '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Valida todos os campos obrigatórios
      const fields   = [...form.querySelectorAll('input[required], select[required], textarea[required]')];
      const allValid = fields.map(f => validateField(f)).every(Boolean);
      if (!allValid) return;

      // Estado de carregamento
      if (btnSubmit) {
        btnSubmit.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
        btnSubmit.disabled   = true;
      }

      // Simula requisição — substitua por fetch() real ao integrar backend
      setTimeout(() => {
        form.reset();

        // Se existir tela de sucesso dedicada, usa ela
        if (formSuccess) {
          form.style.display        = 'none';
          formSuccess.style.display = 'flex';
        } else if (btnSubmit) {
          // Fallback: feedback no próprio botão
          btnSubmit.innerHTML       = '<i class="fa-solid fa-check"></i> Mensagem enviada!';
          btnSubmit.style.background = '#38a169';
          setTimeout(() => {
            btnSubmit.innerHTML       = originalLabel;
            btnSubmit.style.background = '';
            btnSubmit.disabled        = false;
          }, 3000);
        }
      }, 1500);
    });

    // Botão "enviar outra mensagem"
    if (btnNovo) {
      btnNovo.addEventListener('click', () => {
        form.reset();
        form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
        form.querySelectorAll('input, select, textarea').forEach(f => f.classList.remove('input-error'));
        if (btnSubmit) {
          btnSubmit.innerHTML  = originalLabel;
          btnSubmit.disabled   = false;
          btnSubmit.style.background = '';
        }
        if (formSuccess) formSuccess.style.display = 'none';
        form.style.display = '';
      });
    }

  }

});
