/* Fairytopia — inclinação 3D interativa nas imagens */
(function () {
  const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temPonteiro = window.matchMedia('(pointer: fine)').matches;
  if (calmo || !temPonteiro) return;

  function ligarInclinacao(zona, alvo, intensidade) {
    zona.addEventListener('pointerenter', () => zona.classList.add('tocando'));
    zona.addEventListener('pointermove', (e) => {
      const r = zona.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      alvo.style.transform =
        `rotateX(${(-y * intensidade).toFixed(2)}deg) rotateY(${(x * intensidade).toFixed(2)}deg) scale(1.04)`;
    });
    zona.addEventListener('pointerleave', () => {
      zona.classList.remove('tocando');
      alvo.style.transform = '';
    });
  }

  const poster = document.querySelector('.poster');
  if (poster) ligarInclinacao(poster, poster.querySelector('img'), 14);

  document.querySelectorAll('.galeria li').forEach((li) => {
    ligarInclinacao(li, li.querySelector('img'), 10);
  });
})();

/* Fairytopia — certificado de fã, exibido como página dentro do site */
(function () {
  const form = document.getElementById('form-recado');
  if (!form) return;
  const aviso = form.querySelector('.recado-ok');

  const pagina = document.getElementById('pagina-certificado');
  const campoNome = document.getElementById('cert-nome');
  const campoData = document.getElementById('cert-data');
  const tituloOriginal = document.title;

  function abrirCertificado(nome) {
    const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    campoNome.textContent = nome;
    campoData.textContent = 'Emitido em ' + hoje;

    pagina.hidden = false;
    document.body.style.overflow = 'hidden';
    document.title = 'Certificado de Fã Fairytopia — ' + nome;
    history.pushState({ certificado: true }, '', '#certificado');
    pagina.querySelector('.cert-voltar').focus();
  }

  function fecharCertificado() {
    pagina.hidden = true;
    document.body.style.overflow = '';
    document.title = tituloOriginal;
    if (location.hash === '#certificado') history.back();
  }

  pagina.querySelector('.cert-voltar').addEventListener('click', (e) => {
    e.preventDefault();
    fecharCertificado();
  });
  pagina.querySelector('.cert-imprimir').addEventListener('click', () => window.print());
  window.addEventListener('popstate', () => {
    if (!pagina.hidden) fecharCertificado();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !pagina.hidden) fecharCertificado();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();

    if (!nome || !email.includes('@')) {
      aviso.textContent = 'Preencha o nome e um e-mail válido para gerar o certificado.';
      aviso.style.color = 'var(--neon)';
      aviso.hidden = false;
      return;
    }

    aviso.textContent = 'Certificado gerado! ✿';
    aviso.style.color = 'var(--orvalho)';
    aviso.hidden = false;
    abrirCertificado(nome);
    form.reset();
  });
})();