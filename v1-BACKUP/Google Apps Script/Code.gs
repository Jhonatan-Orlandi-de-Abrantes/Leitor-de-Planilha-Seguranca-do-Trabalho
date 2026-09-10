  /******************************************************************************
  * RG 007 - WEB APP (Google Apps Script) - vinculado a planilha
  *
  * CRIACAO:
  *   1. Abra a planilha no Google Sheets (a que replica o Excel com
  *      cabecalho na linha 7 e dados a partir da linha 8).
  *   2. Menu: Extensoes > Apps Script
  *   3. Apague o conteudo padrao e cole este arquivo inteiro.
  *   4. Implante: Implantar > Nova implantacao > Aplicativo da web
  *      - Executar como: "Eu"
  *      - Quem tem acesso: "Qualquer pessoa"
  *   5. Copie a URL gerada (formato https://script.google.com/macros/s/.../exec)
  *
  * CAMPO CONFIGURAVEL:
  *   SHEET_NAME / HEADER_ROW / FIRST_DATA_ROW devem refletir a estrutura
  *   da base. Se sua planilha tiver 314 extintores, HEADER_ROW = 7 e
  *   FIRST_DATA_ROW = 8 (igual ao Excel original).
  *
  * doGet  -> le a aba e devolve JSON no formato do dados.json (Dashboard).
  * doPost -> grava o checklist enviado pelo formulario na planilha.
  ******************************************************************************/

  var SHEET_NAME     = 'Cont. extintores';
  var HEADER_ROW     = 7;
  var FIRST_DATA_ROW = 8;
  var TZ             = 'America/Sao_Paulo';
  var CACHE_KEY      = 'rg007_last_rows';

  /* Posicao canonica das colunas (ordem fixa do RG 007). Fallback usado
     quando o cabecalho da planilha estiver ausente/danificado, garantindo
     que colunas como Local, Tipo, Capacidade etc. sejam sempre salvas. */
  var COL_POS = {
    quantidade: 1, nidextintores: 2, local: 3, setor: 4,
    numerodocilindro: 5, tipo: 6, capacidade: 7,
    manutencao2nivel: 8, manutencao3nivel: 9,
    acesso: 10, placadesinalizacao: 11, sinalizacaodepiso: 12, lacre: 13,
    manometro: 14, mangueira: 15, seloinmetro: 16, selogarantia: 17,
    pinturaextintor: 18, gatilho: 19, observacao: 20
  };

  /* Nome canonico por coluna (para o doGet quando o cabecalho estiver vazio) */
  var CANON_LABEL = [null, 'Quantidade', 'N\u00ba ID-Extintores', 'Local', 'Setor',
    'N\u00famero do Cilindro', 'Tipo', 'Capacidade', 'Manuten\u00e7\u00e3o 2\u00ba n\u00edvel',
    'Manuten\u00e7\u00e3o 3\u00ba n\u00edvel', 'Acesso', 'Placa de sinaliza\u00e7\u00e3o',
    'Sinaliza\u00e7\u00e3o de piso', 'Lacre', 'Man\u00f4metro', 'Mangueira', 'Selo INMETRO',
    'Selo GARANTIA', 'Pintura Extintor', 'Gatilho', 'Observa\u00e7\u00e3o'];

  /* ----------------------- UTILITARIOS ----------------------- */

  function clean(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[\r\n\t]+/g, ' ').trim();
  }

  function normalizeHeader(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function fmtDate(d) {
    return Utilities.formatDate(d, TZ, 'dd/MM/yyyy');
  }

  function fmtDateTime(d) {
    return Utilities.formatDate(d, TZ, 'dd/MM/yyyy HH:mm:ss');
  }

  /* Normaliza um valor de data para "dd/MM/yyyy" independente do tipo salvo */
  function normDate(v) {
    if (v instanceof Date) return fmtDate(v);
    if (typeof v === 'number' && isFinite(v) && v >= 20000 && v <= 80000) {
      var ms = (v - 25569) * 86400000;
      return fmtDate(new Date(ms));
    }
    var s = String(v == null ? '' : v).trim();
    var m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
    if (m) return m[3] + '/' + m[2] + '/' + m[1];
    var i = s.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
    if (i) return i[3] + '/' + i[2] + '/' + i[1];
    return s;
  }

  function json_(obj) {
    return ContentService
      .createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function getSheet_() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Script nao vinculado. Crie-o via Extensoes > Apps Script dentro da planilha.');
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Aba nao encontrada: ' + SHEET_NAME);
    return sheet;
  }

  /* ----------------------- GET / LEITURA ----------------------- */

  function doGet() {
    try {
      var sheet = getSheet_();
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();

      var headers = {};
      var headerVals = sheet.getRange(HEADER_ROW, 1, 1, lastCol).getValues()[0];
      for (var c = 1; c <= lastCol; c++) {
        var h = clean(headerVals[c - 1]);
        if (h) headers[c] = h;
      }

      var rows = [];
      for (var r = FIRST_DATA_ROW; r <= lastRow; r++) {
        var vals = sheet.getRange(r, 1, 1, lastCol).getValues()[0];
        var id  = clean(vals[1]);
        var loc = clean(vals[2]);
        var set = clean(vals[3]);
        if (!id && !loc && !set) continue;
        var o = {};
        for (var c = 1; c <= lastCol; c++) {
          var h = clean(headerVals[c - 1]);
          if (!h) h = (CANON_LABEL[c] || '').trim();
          if (!h) continue;
          var isDate = (c === 8 || c === 9) || /manut/i.test(normalizeHeader(h));
          o[h] = isDate ? normDate(vals[c - 1]) : clean(vals[c - 1]);
        }
        rows.push(o);
      }

      var file = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
      var result = {
        ok: true,
        updated_at: fmtDateTime(new Date()),
        source_file: file.getName(),
        source_last_write: fmtDateTime(file.getLastUpdated()),
        source_signature: String(file.getLastUpdated().getTime()),
        sheet: SHEET_NAME,
        header_row: HEADER_ROW,
        row_count: rows.length,
        rows: rows,
        error: ''
      };

      PropertiesService.getScriptProperties().setProperty(CACHE_KEY, JSON.stringify(result));
      return json_(result);
    } catch (e) {
      var old = PropertiesService.getScriptProperties().getProperty(CACHE_KEY);
      var now = fmtDateTime(new Date());
      if (old) {
        try {
          var cached = JSON.parse(old);
          cached.ok = false;
          cached.updated_at = now;
          cached.error = String(e.message || e);
          return json_(cached);
        } catch (x) {}
      }
      return json_({
        ok: false,
        updated_at: now,
        source_file: '',
        source_signature: 'err',
        sheet: SHEET_NAME,
        header_row: HEADER_ROW,
        row_count: 0,
        rows: [],
        error: String(e.message || e)
      });
    }
  }

  /* ----------------------- POST / GRAVACAO ----------------------- */

function doPost(e) {
    try {
      var body = (e && e.postData && e.postData.contents) || '';
      if (!body) throw new Error('Corpo vazio.');
      var data = JSON.parse(body);
      var rowsIn = (data && Array.isArray(data.rows)) ? data.rows : [];
      if (!rowsIn.length) throw new Error('Nenhuma linha recebida.');

      var sheet = getSheet_();
      var lastRow = sheet.getLastRow();
      var lastCol = sheet.getLastColumn();

      /* Mapa de colunas: cabeçalho normalizado -> indice da coluna */
      var headers = {};
      var headerVals = sheet.getRange(HEADER_ROW, 1, 1, lastCol).getValues()[0];
      for (var c = 1; c <= lastCol; c++) {
        var h = normalizeHeader(headerVals[c - 1]);
        if (h) headers[h] = c;
      }

      /* --- IDs enviados pelo formulario --- */
      var submitted = {};
      for (var i = 0; i < rowsIn.length; i++) {
        var key = normalizeHeader(clean(rowsIn[i]['N\u00ba ID-Extintores']));
        if (key !== '') submitted[key] = true;
      }

      /* --- Area atual de dados e nova grade na ordem do formulario --- */
      var D = FIRST_DATA_ROW;
      var M = Math.max(0, lastRow - FIRST_DATA_ROW + 1);

      var valuesGrid = [];

      function cellValue_(v, nk) {
        var s;
        if (typeof v === 'string') s = v.trim(); else s = v;
        if (s === '' || s === null || s === undefined) return '';
        var isDateCol = /manut/.test(nk);
        if (typeof s === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
          if (isDateCol) { var p = s.split('/').map(Number); return new Date(p[2], p[1] - 1, p[0]); }
          return s;
        }
        if (typeof s === 'number' && isFinite(s)) return s;
        if (typeof s === 'string' &&
            (nk === 'quantidade' || nk === 'nidextintores' || nk === 'numerodocilindro') &&
            /^\d+$/.test(s)) return Number(s);
        return String(s);
      }

      for (var i = 0; i < rowsIn.length; i++) {
        var row = rowsIn[i];
        var rowVals = new Array(lastCol).fill('');
        for (var kk in row) {
          var nk = normalizeHeader(kk);
          var cIdx = headers[nk];
          if (!cIdx && COL_POS[nk]) cIdx = COL_POS[nk];
          if (!cIdx || cIdx > lastCol) continue;
          rowVals[cIdx - 1] = cellValue_(row[kk], nk);
        }
        valuesGrid.push(rowVals);
      }
      var N = valuesGrid.length;

      /* --- Conta linhas atuais fora do formulario (somente para a mensagem) --- */
      var deletedCount = 0;
      if (M > 0) {
        var blockVals = sheet.getRange(D, 1, M, lastCol).getValues();
        for (var b = 0; b < blockVals.length; b++) {
          var vv = clean(blockVals[b][1]);
          if (vv && !submitted[normalizeHeader(vv)]) deletedCount++;
        }
      }

      /* --- 1) Reescreve os valores NA ORDEM DO FORMULARIO, sobrescrevendo no lugar (NAO apaga antes) --- */
      if (valuesGrid.length) {
        sheet.getRange(D, 1, valuesGrid.length, lastCol).setValues(valuesGrid);
      }

      /* --- 2) Linhas antigas excedentes no fim (inclui linhas excluidas no formulario e a linha solta ~417): apaga em LOTE --- */
      if (M > N) {
        sheet.deleteRows(D + N, M - N);
      }

      /* --- 3) Linhas novas alem do bloco atual: copia formato e validacao de uma linha existente --- */
      if (N > M && M > 0) {
        try {
          sheet.getRange(D, 1, 1, lastCol)
            .copyTo(sheet.getRange(D + M, 1, N - M, lastCol), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
          sheet.getRange(D, 1, 1, lastCol)
            .copyTo(sheet.getRange(D + M, 1, N - M, lastCol), SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
        } catch (fx) {}
      }

      /* --- 4) Altura uniforme em toda a regiao reescrita (se houver linha-modelo) --- */
      if (M > 0 && N > 0) {
        try {
          var tplRow = D + Math.min(N, M) - 1;
          sheet.setRowHeights(D, N, sheet.getRowHeight(tplRow));
        } catch (fz) {}
      }

      return json_({ ok: true, message: rowsIn.length + ' extintores salvos na planilha'
        + (deletedCount ? (' e ' + deletedCount + ' excluídos') : '') + '.' });
    } catch (e2) {
      return json_({ ok: false, error: String(e2.message || e2) });
    }
  }