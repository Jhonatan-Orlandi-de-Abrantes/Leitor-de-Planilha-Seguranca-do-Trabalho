/* =====================================================================
   NR-23 - WEB APP (Google Apps Script) generico para multiplas tabelas
   Copiar TODO este arquivo em: Extensoes > Apps Script
   Implantar como Aplicativo da web ("Executar como: Eu",
   "Quem tem acesso: Qualquer pessoa") e usar a URL /exec.

   Endpoints:
     GET  .../exec?tipo=<id-do-perfil>  -> le a aba e devolve JSON
     POST .../exec  (body {tipo, rows}) -> grava o checklist na planilha
   ===================================================================== */

var TZ = 'America/Sao_Paulo';
var CACHE_KEY_BASE = 'nr23_last_';

var PROFILES = [
  {
    id: 'extintores', sheet: 'Cont. extintores', headerRow: 7, dataStartRow: 8,
    columns: [
      { key: 'quantidade', label: 'Quantidade', role: 'number', col: 1 },
      { key: 'nidextintores', label: 'N\u00ba ID-Extintores', role: 'id', col: 2 },
      { key: 'local', label: 'Local', role: 'text', col: 3 },
      { key: 'setor', label: 'Setor', role: 'text', col: 4 },
      { key: 'numerodocilindro', label: 'N\u00famero do Cilindro', role: 'number', col: 5 },
      { key: 'tipo', label: 'Tipo', role: 'text', col: 6 },
      { key: 'capacidade', label: 'Capacidade', role: 'text', col: 7 },
      { key: 'manutencao2nivel', label: 'Manuten\u00e7\u00e3o 2\u00ba n\u00edvel', role: 'date', col: 8 },
      { key: 'manutencao3nivel', label: 'Manuten\u00e7\u00e3o 3\u00ba n\u00edvel', role: 'date', col: 9 },
      { key: 'acesso', label: 'Acesso', role: 'check', col: 10 },
      { key: 'placadesinalizacao', label: 'Placa de sinaliza\u00e7\u00e3o', role: 'check', col: 11 },
      { key: 'sinalizacaodepiso', label: 'Sinaliza\u00e7\u00e3o de piso', role: 'check', col: 12 },
      { key: 'lacre', label: 'Lacre', role: 'check', col: 13 },
      { key: 'manometro', label: 'Man\u00f4metro', role: 'check', col: 14 },
      { key: 'mangueira', label: 'Mangueira', role: 'check', col: 15 },
      { key: 'seloinmetro', label: 'Selo INMETRO', role: 'check', col: 16 },
      { key: 'selogarantia', label: 'Selo GARANTIA', role: 'check', col: 17 },
      { key: 'pinturaextintor', label: 'Pintura Extintor', role: 'check', col: 18 },
      { key: 'gatilho', label: 'Gatilho', role: 'check', col: 19 },
      { key: 'observacao', label: 'Observa\u00e7\u00e3o', role: 'obs', col: 20 }
    ]
  },
  {
    id: 'alarme', sheet: 'ACIONADORES', headerRow: 10, dataStartRow: 11,
    columns: [
      { key: 'numeroacionador', label: 'N\u00ba Acionador', role: 'id', col: 1 },
      { key: 'localizacao', label: 'Localiza\u00e7\u00e3o', role: 'text', col: 2 },
      { key: 'identificacao', label: 'Identifica\u00e7\u00e3o', role: 'check', col: 3 },
      { key: 'sinalizacao', label: 'Sinaliza\u00e7\u00e3o', role: 'check', col: 4 },
      { key: 'iluminacao', label: 'Ilumina\u00e7\u00e3o', role: 'check', col: 5 },
      { key: 'caixaacionadora', label: 'Caixa acionadora', role: 'check', col: 6 },
      { key: 'testefuncion', label: 'Teste Funcion.', role: 'check', col: 7 },
      { key: 'alarmegeral', label: 'Alarme geral', role: 'check', col: 8 },
      { key: 'naoconformidades', label: 'N\u00e3o Conformidades', role: 'obs', col: 13 }
    ]
  },
  {
    id: 'hidrantes', sheet: 'Cont. Hidrantes', headerRow: 9, dataStartRow: 11,
    columns: [
      { key: 'numeroordem', label: 'N\u00ba Ordem', role: 'id', col: 1 },
      { key: 'setor', label: 'Setor', role: 'text', col: 2 },
      { key: 'numerohidrante', label: 'N\u00famero do Hidrante', role: 'id', col: 3 },
      { key: 'localizacao', label: 'Localiza\u00e7\u00e3o', role: 'text', col: 4 },
      { key: 'acesso', label: 'Acesso', role: 'check', col: 5 },
      { key: 'sinalizacaopiso', label: 'Sinaliza\u00e7\u00e3o de piso', role: 'check', col: 6 },
      { key: 'identificacao', label: 'Identifica\u00e7\u00e3o', role: 'check', col: 7 },
      { key: 'vazamento', label: 'Vazamento', role: 'check', col: 8 },
      { key: 'esguichos', label: 'Esguichos', role: 'check', col: 9 },
      { key: 'chavestorz', label: 'Chave storz', role: 'check', col: 10 },
      { key: 'mangueiras', label: 'Mangueiras', role: 'check', col: 11 },
      { key: 'registros', label: 'Registros', role: 'check', col: 12 },
      { key: 'verifhidraulico', label: 'Verif. Sist. Hidraulico', role: 'check', col: 13 },
      { key: 'naoconformidades', label: 'N\u00e3o Conformidades', role: 'obs', col: 14 }
    ]
  },
  {
    id: 'chuveiro_lavaolhos', sheet: '2026', headerRow: 6, dataStartRow: 7,
    columns: [
      { key: 'numeroordem', label: 'N\u00ba Ordem', role: 'id', col: 1 },
      { key: 'data', label: 'Data', role: 'date', col: 2 },
      { key: 'horario', label: 'Hor\u00e1rio', role: 'text', col: 4 },
      { key: 'tubulacaosemvazamento', label: 'A tubula\u00e7\u00e3o est\u00e1 livre de vazamento?', role: 'check', col: 5 },
      { key: 'funcionaadequadamente', label: 'O chuveiro e o lava-olhos funcionam adequadamente?', role: 'check', col: 6 },
      { key: 'livresdesujidade', label: 'O chuveiro e a bacia do lava-olhos encontram-se livres de sujidade?', role: 'check', col: 7 },
      { key: 'valvulasabertas', label: 'As v\u00e1lvulas permanecem abertas sem necessidade de uso das m\u00e3os?', role: 'check', col: 8 },
      { key: 'placasinalizacao', label: 'H\u00e1 placa de sinaliza\u00e7\u00e3o fixada junto ao equipamento?', role: 'check', col: 9 },
      { key: 'caminhodesobstruido', label: 'O caminho at\u00e9 o equipamento encontra-se desobstru\u00eddo?', role: 'check', col: 10 },
      { key: 'responsavel', label: 'Respons\u00e1vel pela inspe\u00e7\u00e3o', role: 'text', col: 11 }
    ]
  },
  {
    id: 'iluminacao_emergencia', sheet: 'ILUMINA\u00c7\u00c3O', headerRow: 11, dataStartRow: 12,
    columns: [
      { key: 'identificacao', label: 'Identifica\u00e7\u00e3o', role: 'id', col: 2 },
      { key: 'localizacao', label: 'Localiza\u00e7\u00e3o', role: 'text', col: 3 },
      { key: 'tipo', label: 'Tipo', role: 'text', col: 4 },
      { key: 'testefuncion', label: 'Teste Funcion.', role: 'check', col: 8 },
      { key: 'observacoes', label: 'Observa\u00e7\u00f5es', role: 'obs', col: 9 }
    ]
  },
  {
    id: 'kit_emergencia', sheet: 'Planilha1', headerRow: 7, dataStartRow: 8,
    columns: [
      { key: 'item', label: 'Item', role: 'id', col: 1 },
      { key: 'descricao', label: 'Descri\u00e7\u00e3o', role: 'text', col: 2 },
      { key: 'qtde', label: 'QTDE', role: 'text', col: 3 },
      { key: 'jan', label: 'Janeiro', role: 'check', col: 5 },
      { key: 'fev', label: 'Fevereiro', role: 'check', col: 8 },
      { key: 'mar', label: 'Mar\u00e7o', role: 'check', col: 11 },
      { key: 'abr', label: 'Abril', role: 'check', col: 19 },
      { key: 'mai', label: 'Maio', role: 'check', col: 22 },
      { key: 'jun', label: 'Junho', role: 'check', col: 25 },
      { key: 'jul', label: 'Julho', role: 'check', col: 32 },
      { key: 'ago', label: 'Agosto', role: 'check', col: 35 },
      { key: 'set', label: 'Setembro', role: 'check', col: 38 },
      { key: 'out', label: 'Outubro', role: 'check', col: 45 },
      { key: 'nov', label: 'Novembro', role: 'check', col: 48 },
      { key: 'dez', label: 'Dezembro', role: 'check', col: 51 }
    ]
  }
];

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

function getProfile(id) {
  for (var i = 0; i < PROFILES.length; i++) {
    if (PROFILES[i].id === id) return PROFILES[i];
  }
  return PROFILES[0];
}

function getSheet(p) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Script nao vinculado. Crie-o via Extensoes > Apps Script dentro da planilha.');
  var sheet = ss.getSheetByName(p.sheet);
  if (!sheet) throw new Error('Aba nao encontrada: ' + p.sheet);
  return sheet;
}

function buildColMap(p, sheet, headerRow, lastCol) {
  var map = {};
  var headerVals = sheet.getRange(headerRow, 1, 1, lastCol).getValues()[0];
  for (var i = 0; i < p.columns.length; i++) {
    var col = p.columns[i].col || 0;
    if (col >= 1 && col <= lastCol) map[p.columns[i].key] = col;
  }
  for (var c = 1; c <= lastCol; c++) {
    var hn = normalizeHeader(headerVals[c - 1]);
    if (!hn) continue;
    for (var j = 0; j < p.columns.length; j++) {
      if (nhLabel(p.columns[j]) === hn) {
        map[p.columns[j].key] = c;
        break;
      }
    }
  }
  return map;
}

function nhLabel(col) {
  return normalizeHeader(col.label);
}

function cellClean(v, role, colKey) {
  var s = clean(v);
  if (role === 'date' && s) return normDate(v);
  return s;
}

/* ----------------------- GET / LEITURA ----------------------- */

function doGet(e) {
  var tipo = (e && e.parameter && e.parameter.tipo) || '';
  var force = (e && e.parameter && e.parameter.force) === '1';
  var p = getProfile(tipo);

  var cache = CacheService.getScriptCache();
  if (!force) {
    var hit = cache.get(CACHE_KEY_BASE + p.id);
    if (hit) {
      try { return json_(JSON.parse(hit)); } catch (x) {}
    }
  }

  try {
    var sheet = getSheet(p);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var colMap = buildColMap(p, sheet, p.headerRow, lastCol);

    var rows = [];
    if (lastRow >= p.dataStartRow) {
      var grid = sheet.getRange(p.dataStartRow, 1, lastRow - p.dataStartRow + 1, lastCol).getValues();
      for (var r = 0; r < grid.length; r++) {
        var o = {};
        var any = false;
        for (var i = 0; i < p.columns.length; i++) {
          var colDef = p.columns[i];
          var idx = colMap[colDef.key];
          if (!idx) continue;
          var cs = cellClean(grid[r][idx - 1], colDef.role, colDef.key);
          o[colDef.key] = cs;
          if (cs !== '') any = true;
        }
        if (!any) continue;
        rows.push(o);
        if (rows.length >= 2000) break;
      }
    }

    var file = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
    var result = {
      ok: true,
      updated_at: fmtDateTime(new Date()),
      source_file: file.getName(),
      source_last_write: fmtDateTime(file.getLastUpdated()),
      source_signature: String(file.getLastUpdated().getTime()),
      tipo: p.id,
      sheet: p.sheet,
      header_row: p.headerRow,
      row_count: rows.length,
      profile: p,
      rows: rows,
      error: ''
    };

    try { cache.put(CACHE_KEY_BASE + p.id, JSON.stringify(result), 1); } catch (cx) {}
    return json_(result);
  } catch (err) {
    var old = null;
    try {
      var cachedAny = cache.get(CACHE_KEY_BASE + p.id);
      if (cachedAny) old = JSON.parse(cachedAny);
    } catch (x) {}
    if (!old) {
      try {
        var prop = PropertiesService.getScriptProperties().getProperty(CACHE_KEY_BASE + p.id);
        if (prop) old = JSON.parse(prop);
      } catch (y) {}
    }
    var now = fmtDateTime(new Date());
    if (old) {
      try {
        old.ok = false;
        old.updated_at = now;
        old.error = String(err.message || err);
        return json_(old);
      } catch (z) {}
    }
    return json_({
      ok: false,
      updated_at: now,
      source_file: '',
      source_signature: 'err',
      tipo: p.id,
      sheet: '',
      header_row: 0,
      row_count: 0,
      profile: {},
      rows: [],
      error: String(err.message || err)
    });
  }
}

/* ----------------------- POST / GRAVACAO ----------------------- */

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) || '';
    if (!body) throw new Error('Corpo vazio.');
    var data = JSON.parse(body);
    var tipo = data.tipo || '';
    var p = getProfile(tipo);
    var rowsIn = (data && Array.isArray(data.rows)) ? data.rows : [];
    if (!rowsIn.length) throw new Error('Nenhuma linha recebida.');

    var sheet = getSheet(p);
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    var colMap = buildColMap(p, sheet, p.headerRow, lastCol);

    var valuesGrid = [];
    for (var i = 0; i < rowsIn.length; i++) {
      var row = rowsIn[i];
      var rowVals = new Array(lastCol).fill('');
      for (var c = 0; c < p.columns.length; c++) {
        var colDef = p.columns[c];
        var idx = colMap[colDef.key];
        if (!idx || idx > lastCol) continue;
        rowVals[idx - 1] = saveCell(row[colDef.key], colDef);
      }
      valuesGrid.push(rowVals);
    }
    var N = valuesGrid.length;
    var D = p.dataStartRow;
    var M = Math.max(0, lastRow - D + 1);

    if (N) sheet.getRange(D, 1, N, lastCol).setValues(valuesGrid);

    if (M > N) sheet.deleteRows(D + N, M - N);

    if (N > M && M > 0) {
      try {
        sheet.getRange(D, 1, 1, lastCol)
          .copyTo(sheet.getRange(D + M, 1, N - M, lastCol), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
        sheet.getRange(D, 1, 1, lastCol)
          .copyTo(sheet.getRange(D + M, 1, N - M, lastCol), SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
      } catch (fx) {}
    }

    return json_({ ok: true, tipo: p.id, message: rowsIn.length + ' registro(s) salvos na planilha.' });
  } catch (e2) {
    return json_({ ok: false, error: String(e2.message || e2) });
  }
}

function saveCell(v, colDef) {
  var s;
  if (typeof v === 'string') s = v.trim(); else s = v;
  if (s === '' || s === null || s === undefined) return '';
  if (colDef.role === 'date' && typeof s === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    var parts = s.split('/').map(Number);
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  if (typeof s === 'number' && isFinite(s)) return s;
  if (typeof s === 'string' && colDef.role === 'number' && /^-?\d+$/.test(s)) return Number(s);
  return String(s);
}