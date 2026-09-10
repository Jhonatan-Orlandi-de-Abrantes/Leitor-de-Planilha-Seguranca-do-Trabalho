RG 007 - GESTAO DE INSPECAO DE EXTINTORES
===========================================

O QUE E ESTE PROJETO
--------------------
Sistema para inspecao de extintores do RG 007. O formulario preenche
as informacoes de cada extintor (local, setor, tipo, capacidade e o
checklist de 10 itens: C / N/A / N/C) e o dashboard mostra os dados
em tempo real com contadores, graficos e filtros.

Os dados ficam na planilha Google Sheets e o "trafego" entre form,
dashboard e planilha e feito por um Web App do Google Apps Script
(pasta "Google Apps Script", arquivo Code.gs). O formulario e o
dashboard podem ser publicados de graca no Netlify.

ARQUIVOS .HTML
--------------
1) RG_007_Formulario_Inspecao_Extintores.html (raiz)
   - O FORMULARIO de inspecao (base com ~314 extintores ja embutida).
   - Preenche/edita extintores, monta o checklist e as observacoes.
   - Salva/carrega na planilha via Web App (URL configurada no campo
     "URL do Web App", guardada no navegador - mesma fonte que o
     dashboard usa).
   - Exporta o relatorio em XLSX e PDF.
   - Tem confirmacao antes de salvar/carregar/excluir e aviso amarelo
     de alteracoes pendentes.

2) Dashboard Extintores/Dashboard.html
   - O DASHBOARD gerencial (nao precisa preencher).
   - Le a MESMA fonte que o formulario (URL do Web App).
   - Mostra contadores, graficos (setor, tipo, status da inspecao,
     manutencao), filtros e a tabela "Base de extintores" com paginacao.
   - Atualiza automaticamente a cada ~3 s.
   - Util para gestores acompanharem conformidade e manutencoes.
     * "?" ao lado da "Fonte": para atualizar/alterar o arquivo do
       dashboard, substitua a fonte no formulario.

OUTROS
------
- Google Apps Script/Code.gs  : backend do Web App (le/grava a planilha).
- Dashboard Extintores/dados.json + *.ps1 + *.bat : versao antiga local
  (leitura do Excel via PowerShell) - nao e mais usada na solucao nova.