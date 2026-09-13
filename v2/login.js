/* =====================================================================
   NR-23 - LOGIN OBRIGATORIO (Firebase Authentication)
   ---------------------------------------------------------------------
   Dependencias (carregar ANTES deste arquivo, na pagina HTML):
     1) https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js
     2) https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js
     3) firebase-config.js

   Comportamento:
     - Exibe uma tela de bloqueio (authOverlay) cobrindo TODO o site.
       Ela so some quando o usuario fizer login (Google ou e-mail/senha).
     - Se o usuario deslogar, a tela de bloqueio volta e o site fica
       inutilizavel ate um novo login.
     - Bloqueia e-mails de FIREBASE_BLOCKED_EMAILS (firebase-config.js).
     - Restringe por dominio se FIREBASE_ALLOWED_DOMAINS estiver cheio.
     - API publica usada pelas paginas:
         getAuthUser() -> { uid, email, name } do usuario logado (ou null)
         requireAuth(fn) -> executa fn() assim que o usuario estiver logado
   ===================================================================== */

(function () {
  'use strict';

  var AUTH_USER = null;
  var waiters = [];
  var createMode = false;
  var auth = null;

  function $(id) { return document.getElementById(id); }

  function normalizeEmail(e) {
    return String(e || '').trim().toLowerCase();
  }

  function hasConfig() {
    return !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey &&
      String(window.FIREBASE_CONFIG.apiKey).indexOf('COLE_AQUI') === -1);
  }

  function showOverlay() {
    var t = $('authOverlay');
    if (t) t.style.display = 'flex';
  }
  function hideOverlay() {
    var t = $('authOverlay');
    if (t) t.style.display = 'none';
  }

  function msg(text, kind) {
    var el = $('authMsg');
    if (!el) return;
    el.className = 'auth-msg show ' + (kind === 'ok' ? 'ok' : 'err');
    el.innerHTML = text;
  }
  function clearMsg() {
    var el = $('authMsg');
    if (el) { el.className = 'auth-msg'; el.innerHTML = ''; }
  }

  function blockedEmail(email) {
    var e = normalizeEmail(email);
    var list = (window.FIREBASE_BLOCKED_EMAILS || []);
    for (var i = 0; i < list.length; i++) {
      if (normalizeEmail(list[i]) === e) return true;
    }
    return false;
  }

  function domainAllowed(email) {
    var list = (window.FIREBASE_ALLOWED_DOMAINS || []);
    if (!list.length) return true;
    var at = normalizeEmail(email).indexOf('@');
    if (at === -1) return false;
    var dom = normalizeEmail(email).slice(at + 1);
    for (var i = 0; i < list.length; i++) {
      if (normalizeEmail(list[i]) === dom) return true;
    }
    return false;
  }

  function setBusy(on) {
    ['btnGoogle', 'btnEmailLogin', 'btnToggleMode'].forEach(function (id) {
      var el = $(id);
      if (el) el.disabled = on;
    });
  }

  function handleAuthError(err) {
    var c = err && err.code ? String(err.code) : '';
    var map = {
      'auth/popup-closed-by-user': 'Janela do Google fechada antes de concluir. Tente novamente.',
      'auth/unauthorized-domain': 'Dominio nao autorizado no Firebase. Adicione este endereco em Autenticacao -> Autorizar dominios.',
      'auth/cancelled-popup-request': 'A janela do Google foi cancelada. Tente novamente.',
      'auth/invalid-email': 'E-mail invalido. Confira o endereco digitado.',
      'auth/user-disabled': 'Esta conta esta desativada. Fale com o administrador.',
      'auth/user-not-found': 'Nao existe conta com este e-mail.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/email-already-in-use': 'Ja existe uma conta com este e-mail.',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
      'auth/operation-not-allowed': 'Provedor nao habilitado no Firebase. Ative em Autenticacao -> Metodos de acesso.',
      'auth/network-request-failed': 'Falha de rede. Verifique sua conexao.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
    };
    msg(map[c] || (err && err.message ? err.message : 'Erro de autenticacao.'), 'err');
  }

  function resolveUser(user) {
    AUTH_USER = {
      uid: user.uid || '',
      email: normalizeEmail(user.email),
      name: user.displayName || user.email || ''
    };
    hideOverlay();
    renderChip(AUTH_USER);
    var pend = waiters;
    waiters = [];
    pend.forEach(function (fn) {
      try { fn(); } catch (e) { console.error(e); }
    });
    $('authPass').value = '';
  }

  function dropUser() {
    AUTH_USER = null;
    renderChip(null);
    showOverlay();
  }

  function renderChip(u) {
    var chip = $('authChip'), nameEl = $('ucName');
    if (!chip) return;
    if (u) {
      if (nameEl) nameEl.textContent = u.name || u.email;
      chip.hidden = false;
    } else {
      chip.hidden = true;
    }
  }

  function signOut() {
    if (auth) { try { auth.signOut(); } catch (e) {} }
  }

  function tryGoogle() {
    if (!auth) return;
    setBusy(true);
    clearMsg();
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(function () { setBusy(false); })
      .catch(function (err) {
        setBusy(false);
        handleAuthError(err);
      });
  }

  function submitEmail() {
    var emailEl = $('authEmail'), passEl = $('authPass');
    var email = normalizeEmail(emailEl.value);
    var pass = passEl.value;
    clearMsg();
    if (!email) { msg('Informe o e-mail.', 'err'); emailEl.focus(); return; }
    if (!pass) { msg('Informe a senha.', 'err'); passEl.focus(); return; }
    if (!auth) { msg('Firebase ainda nao foi iniciado.', 'err'); return; }
    setBusy(true);
    var p = createMode
      ? auth.createUserWithEmailAndPassword(email, pass)
      : auth.signInWithEmailAndPassword(email, pass);
    p.then(function () { setBusy(false); })
      .catch(function (err) {
        setBusy(false);
        handleAuthError(err);
      });
  }

  function toggleMode() {
    createMode = !createMode;
    var bt = $('btnEmailLogin'), sw = $('btnToggleMode'), sub = $('authSub');
    if (createMode) {
      if (bt) bt.textContent = 'Criar conta';
      if (sw) sw.textContent = 'Ja tenho conta - entrar';
      if (sub) sub.textContent = 'Crie uma conta com e-mail e senha para acessar o painel.';
    } else {
      if (bt) bt.textContent = 'Entrar';
      if (sw) sw.textContent = 'Nao tem conta? Criar conta';
      if (sub) sub.textContent = 'Faça login para acessar o painel de inspecoes.';
    }
    clearMsg();
  }

  function bindEvents() {
    var g = $('btnGoogle');
    if (g) g.addEventListener('click', tryGoogle);
    var s = $('btnEmailLogin');
    if (s) s.addEventListener('click', submitEmail);
    var t = $('btnToggleMode');
    if (t) t.addEventListener('click', toggleMode);
    ['authEmail', 'authPass'].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener('keydown', function (e2) { if (e2.key === 'Enter') submitEmail(); });
    });
    var lo = $('btnLogout');
    if (lo) lo.addEventListener('click', signOut);
  }

  function boot() {
    bindEvents();
    showOverlay();

    if (!hasConfig()) {
      msg('Login ainda nao configurado. Cole suas credenciais do Firebase em <b>firebase-config.js</b> (campos <b>apiKey</b>, <b>authDomain</b>, etc.).', 'err');
      setBusy(true);
      return;
    }

    if (typeof firebase === 'undefined') {
      msg('A biblioteca do Firebase nao carregou. Verifique a conexao com a internet ou a tag de script do Firebase.', 'err');
      setBusy(true);
      return;
    }

    try {
      if (!firebase.apps.length) firebase.initializeApp(window.FIREBASE_CONFIG);
      auth = firebase.auth();
      auth.languageCode = 'pt-BR';

      auth.onAuthStateChanged(function (user) {
        if (user) {
          var email = normalizeEmail(user.email);
          if (blockedEmail(email)) {
            msg('Acesso negado: este e-mail esta <b>BLOQUEADO</b>. Contate o administrador.', 'err');
            try { auth.signOut(); } catch (e) {}
            return;
          }
          if (!domainAllowed(email)) {
            msg('Acesso negado: o dominio deste e-mail nao esta autorizado.', 'err');
            try { auth.signOut(); } catch (e) {}
            return;
          }
          resolveUser(user);
        } else {
          dropUser();
        }
      });
    } catch (err) {
      msg('Erro ao iniciar o Firebase: ' + (err && err.message ? err.message : err), 'err');
    }
  }

  /* ---------------- API publica ---------------- */
  window.getAuthUser = function () { return AUTH_USER; };

  window.requireAuth = function (fn) {
    if (AUTH_USER) { try { fn(); } catch (e) { console.error(e); } return; }
    waiters.push(fn);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();