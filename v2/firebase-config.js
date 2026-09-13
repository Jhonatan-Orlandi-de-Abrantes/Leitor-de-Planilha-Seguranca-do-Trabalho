/* =====================================================================
   NR-23 - CONFIGURACAO DO FIREBASE
   ---------------------------------------------------------------------
   COMO PREENCHER (sem precisar de conhecimentos tecnicos):
   1. Acesse https://console.firebase.google.com e crie um projeto
      (ou abra o projeto que voce ja criou).
   2. No menu, clique em "Visao geral do projeto" -> adicione um
      "Aplicativo da web" (icone </>).
   3. Ele mostrara um bloco parecido com este:

          const firebaseConfig = {
            apiKey: "AIza...",
            authDomain: "...firebaseapp.com",
            projectId: "...",
            storageBucket: "...",
            messagingSenderId: "...",
            appId: "..."
          };

      Copie os valores e cole abaixo.
   4. No menu, va em "Authentication" (Autenticacao) -> "Sign-in method"
      e ATIVE:
        - Google
        - E-mail/Senha
   5. Em "Authentication" -> "Authorized domains", adicione o endereco
      onde as paginas .html ficarao hospedadas (ex.: nome-do-site.web.app
      ou seu dominio proprio).
   6. IMPORTANTE: o Google bloqueia popups de autenticacao vindo de
      arquivos locais (file://). Para o login funcionar, publique as
      paginas em um endereco https (o mais simples: Firebase Hosting).
   ===================================================================== */

window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAhlQgy2A-n-XEcp44pbksAj1Zf-o7Q1Fk',
  authDomain: 'leitor-de-planilha-tst.firebaseapp.com',
  projectId: 'leitor-de-planilha-tst',
  storageBucket: 'leitor-de-planilha-tst.firebasestorage.app',
  messagingSenderId: '686983156363',
  appId: '1:686983156363:web:2b88594dd5a6e3da22fa8e',
  measurementId: 'G-Z70G1KHZXY'
};

/* =====================================================================
   E-MAILS BLOQUEADOS
   ----------------------------------------------------------------
   Estes e-mails NUNCA conseguem entrar no sistema. Mesmo se alguem
   fizer login com Google ou e-mail/senha usando um destes enderecos,
   o acesso e negado e o usuario e deslogado imediatamente.
   Escreva um endereco por linha. A comparacao ignora maiusculas e
   minusculas (ex.: usario@email.com e identico a USUARIO@EMAIL.COM).
   ===================================================================== */
window.FIREBASE_BLOCKED_EMAILS = [
  'emailbloqueado@exemplo.com.br'
];

/* =====================================================================
   DOMINIOS PERMITIDOS (opcao EXTRA de seguranca)
   ----------------------------------------------------------------
   Se deixar a lista vazia [], qualquer e-mail autorizado pelo Firebase
   entra. Se preencher com dominios, apenas e-mails destes dominios
   conseguem entrar. Exemplos:
     ['amctextil.com.br', 'gmail.com']
   ===================================================================== */
window.FIREBASE_ALLOWED_DOMAINS = [];