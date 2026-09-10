/* =====================================================================
   NR-23 - PERFIS DECLARATIVOS DAS TABELAS DE INSPECAO (v2)
   ---------------------------------------------------------------------
   Cada "tipo de tabela" e descrito por um perfil. Formulario e
   Dashboard leem este arquivo e adaptam a interface automaticamente.

   roles disponiveis:
     id      -> identificador do item (edita, mono)
     text    -> texto livre
     number  -> numero
     date    -> data (dd/mm/aaaa); maintenance=true exibe selo VENCIDO
     check   -> dropdown C / N/C / N/A
     obs     -> observacao (textarea + lista de notas rapidas)
   ===================================================================== */

var NR23_PROFILES = [
  {
    id: 'extintores',
    docCode: 'RG 007',
    sheet: 'Cont. extintores',
    headerRow: 7,
    dataStartRow: 8,
    title: 'Inspeção de Extintores',
    subtitle: 'Checklist de conformidade de equipamentos de combate a incêndio — Base 2026',
    item: 'extintor',
    itemPlural: 'extintores',
    filters: ['setor', 'tipo', 'capacidade'],
    chartBy: ['setor', 'tipo', 'capacidade'],
    maintenanceDates: ['manutencao2nivel', 'manutencao3nivel'],
    columns: [
      { key: 'quantidade', label: 'Quantidade', role: 'number', col: 1 },
      { key: 'nidextintores', label: 'Nº ID-Extintores', role: 'id', col: 2 },
      { key: 'local', label: 'Local', role: 'text', col: 3 },
      { key: 'setor', label: 'Setor', role: 'text', col: 4 },
      { key: 'numerodocilindro', label: 'Número do Cilindro', role: 'number', col: 5 },
      { key: 'tipo', label: 'Tipo', role: 'text', col: 6 },
      { key: 'capacidade', label: 'Capacidade', role: 'text', col: 7 },
      { key: 'manutencao2nivel', label: 'Manutenção 2º nível', role: 'date', maintenance: true, col: 8 },
      { key: 'manutencao3nivel', label: 'Manutenção 3º nível', role: 'date', maintenance: true, col: 9 },
      { key: 'acesso', label: 'Acesso', role: 'check', col: 10 },
      { key: 'placadesinalizacao', label: 'Placa de sinalização', role: 'check', col: 11 },
      { key: 'sinalizacaodepiso', label: 'Sinalização de piso', role: 'check', col: 12 },
      { key: 'lacre', label: 'Lacre', role: 'check', col: 13 },
      { key: 'manometro', label: 'Manômetro', role: 'check', col: 14 },
      { key: 'mangueira', label: 'Mangueira', role: 'check', col: 15 },
      { key: 'seloinmetro', label: 'Selo INMETRO', role: 'check', col: 16 },
      { key: 'selogarantia', label: 'Selo GARANTIA', role: 'check', col: 17 },
      { key: 'pinturaextintor', label: 'Pintura Extintor', role: 'check', col: 18 },
      { key: 'gatilho', label: 'Gatilho', role: 'check', col: 19 },
      { key: 'observacao', label: 'Observação', role: 'obs', col: 20 }
    ],
    obsOptions: [
      'Extintor sem sinalização visível',
      'Placa de sinalização danificada ou ausente',
      'Sinalização de piso apagada/ausente',
      'Lacre rompido ou ausente',
      'Manômetro fora da faixa de pressão adequada',
      'Mangueira ressecada, rachada ou danificada',
      'Selo do INMETRO ausente ou ilegível',
      'Selo de garantia vencido ou ausente',
      'Pintura descascada / corrosão aparente no cilindro',
      'Gatilho travado ou danificado',
      'Extintor com acesso obstruído',
      'Extintor fora do suporte/pendurado incorretamente',
      'Suporte de fixação danificado',
      'Data de validade da carga vencida',
      'Necessita recarga imediata',
      'Necessita substituição do equipamento',
      'Necessita manutenção de 2º nível',
      'Necessita manutenção de 3º nível',
      'Extintor removido/realocado do local original',
      'Sem observações - item conforme'
    ]
  },

  {
    id: 'alarme',
    docCode: 'RG 002',
    sheet: 'ACIONADORES',
    headerRow: 10,
    dataStartRow: 11,
    title: 'Controle de Alarme de Incêndio',
    subtitle: 'Inspeção dos acionadores manuais do sistema de alarme',
    item: 'acionador',
    itemPlural: 'acionadores',
    filters: ['localizacao'],
    chartBy: ['localizacao'],
    columns: [
      { key: 'numeroacionador', label: 'Nº Acionador', role: 'id', col: 1 },
      { key: 'localizacao', label: 'Localização', role: 'text', col: 2 },
      { key: 'identificacao', label: 'Identificação', role: 'check', col: 3 },
      { key: 'sinalizacao', label: 'Sinalização', role: 'check', col: 4 },
      { key: 'iluminacao', label: 'Iluminação', role: 'check', col: 5 },
      { key: 'caixaacionadora', label: 'Caixa acionadora', role: 'check', col: 6 },
      { key: 'testefuncion', label: 'Teste Funcion.', role: 'check', col: 7 },
      { key: 'alarmegeral', label: 'Alarme geral', role: 'check', col: 8 },
      { key: 'naoconformidades', label: 'Não Conformidades', role: 'obs', col: 13 }
    ],
    obsOptions: [
      'Acionador com acesso obstruído',
      'Sinalização ausente ou danificada',
      'Iluminação inadequada no local',
      'Caixa acionadora danificada ou aberta',
      'Alarme geral não disparou no teste',
      'Teste funcional reprovado',
      'Sem observações - item conforme'
    ]
  },

  {
    id: 'hidrantes',
    docCode: 'RG 006',
    sheet: 'Cont. Hidrantes',
    headerRow: 9,
    dataStartRow: 11,
    title: 'Controle de Hidrantes',
    subtitle: 'Inspeção do sistema preventivo fixo de combate a incêndio',
    item: 'hidrante',
    itemPlural: 'hidrantes',
    filters: ['setor'],
    chartBy: ['setor'],
    columns: [
      { key: 'numeroordem', label: 'Nº Ordem', role: 'id', col: 1 },
      { key: 'setor', label: 'Setor', role: 'text', col: 2 },
      { key: 'numerohidrante', label: 'Número do Hidrante', role: 'id', col: 3 },
      { key: 'localizacao', label: 'Localização', role: 'text', col: 4 },
      { key: 'acesso', label: 'Acesso', role: 'check', col: 5 },
      { key: 'sinalizacaopiso', label: 'Sinalização de piso', role: 'check', col: 6 },
      { key: 'identificacao', label: 'Identificação', role: 'check', col: 7 },
      { key: 'vazamento', label: 'Vazamento', role: 'check', col: 8 },
      { key: 'esguichos', label: 'Esguichos', role: 'check', col: 9 },
      { key: 'chavestorz', label: 'Chave storz', role: 'check', col: 10 },
      { key: 'mangueiras', label: 'Mangueiras', role: 'check', col: 11 },
      { key: 'registros', label: 'Registros', role: 'check', col: 12 },
      { key: 'verifhidraulico', label: 'Verif. Sist. Hidraulico', role: 'check', col: 13 },
      { key: 'naoconformidades', label: 'Não Conformidades', role: 'obs', col: 14 }
    ],
    obsOptions: [
      'Hidrante com acesso obstruído',
      'Sinalização de piso apagada/ausente',
      'Identificação ausente ou danificada',
      'Vazamento na tubulação ou registro',
      'Esguichos ausentes ou danificados',
      'Chave storz ausente',
      'Mangueiras ressecadas ou danificadas',
      'Registros com funcionamento irregular',
      'Verificação do sistema hidráulico reprovada',
      'Sem observações - item conforme'
    ]
  },

  {
    id: 'chuveiro_lavaolhos',
    docCode: 'RG 009',
    sheet: '2026',
    headerRow: 6,
    dataStartRow: 7,
    title: 'Chuveiro e Lava-Olhos',
    subtitle: 'Inspeções semanais de chuveiros de emergência e lava-olhos',
    item: 'registro',
    itemPlural: 'registros',
    filters: ['responsavel'],
    chartBy: ['responsavel'],
    columns: [
      { key: 'numeroordem', label: 'Nº Ordem', role: 'id', col: 1 },
      { key: 'data', label: 'Data', role: 'date', col: 2 },
      { key: 'horario', label: 'Horário', role: 'text', col: 4 },
      { key: 'tubulacaosemvazamento', label: 'A tubulação está livre de vazamento?', role: 'check', col: 5 },
      { key: 'funcionaadequadamente', label: 'O chuveiro e o lava-olhos funcionam adequadamente?', role: 'check', col: 6 },
      { key: 'livresdesujidade', label: 'O chuveiro e a bacia do lava-olhos encontram-se livres de sujidade?', role: 'check', col: 7 },
      { key: 'valvulasabertas', label: 'As válvulas permanecem abertas sem necessidade de uso das mãos?', role: 'check', col: 8 },
      { key: 'placasinalizacao', label: 'Há placa de sinalização fixada junto ao equipamento?', role: 'check', col: 9 },
      { key: 'caminhodesobstruido', label: 'O caminho até o equipamento encontra-se desobstruído?', role: 'check', col: 10 },
      { key: 'responsavel', label: 'Responsável pela inspeção', role: 'text', col: 11 }
    ],
    obsOptions: [
      'Tubulação com vazamento identificado',
      'Chuveiro/lava-olhos não funcionam adequadamente',
      'Sujidade no chuveiro ou bacia do lava-olhos',
      'Válvulas não permanecem abertas sozinhas',
      'Placa de sinalização ausente',
      'Caminho até o equipamento obstruído',
      'Sem observações - item conforme'
    ]
  },

  {
    id: 'iluminacao_emergencia',
    docCode: 'RG 009',
    sheet: 'ILUMINAÇÃO',
    headerRow: 11,
    dataStartRow: 12,
    title: 'Iluminação de Emergência',
    subtitle: 'Inspeção do sistema de iluminação de emergência — Itajaí',
    item: 'ponto',
    itemPlural: 'pontos',
    filters: ['tipo'],
    chartBy: ['tipo', 'localizacao'],
    columns: [
      { key: 'identificacao', label: 'Identificação', role: 'id', col: 2 },
      { key: 'localizacao', label: 'Localização', role: 'text', col: 3 },
      { key: 'tipo', label: 'Tipo', role: 'text', col: 4 },
      { key: 'testefuncion', label: 'Teste Funcion.', role: 'check', col: 8 },
      { key: 'observacoes', label: 'Observações', role: 'obs', col: 9 }
    ],
    obsOptions: [
      'Luminária não acionou no teste',
      'Led queimado ou falha no acionamento',
      'Iluminação de balizamento apagada',
      'Sinalização da saída ausente',
      'Ponto de luz com acesso obstruído',
      'Sem observações - item conforme'
    ]
  },

  {
    id: 'kit_emergencia',
    docCode: 'BRIGADA',
    sheet: 'Planilha1',
    headerRow: 7,
    dataStartRow: 8,
    title: 'Kit de Emergência (Brigada)',
    subtitle: 'Controle mensal dos materiais dos kits de primeiros socorros — 2026',
    item: 'item',
    itemPlural: 'itens',
    filters: [],
    chartBy: [],
    columns: [
      { key: 'item', label: 'Item', role: 'id', col: 1 },
      { key: 'descricao', label: 'Descrição', role: 'text', col: 2 },
      { key: 'qtde', label: 'QTDE', role: 'text', col: 3 },
      { key: 'jan', label: 'Janeiro', role: 'check', col: 5 },
      { key: 'fev', label: 'Fevereiro', role: 'check', col: 8 },
      { key: 'mar', label: 'Março', role: 'check', col: 11 },
      { key: 'abr', label: 'Abril', role: 'check', col: 19 },
      { key: 'mai', label: 'Maio', role: 'check', col: 22 },
      { key: 'jun', label: 'Junho', role: 'check', col: 25 },
      { key: 'jul', label: 'Julho', role: 'check', col: 32 },
      { key: 'ago', label: 'Agosto', role: 'check', col: 35 },
      { key: 'set', label: 'Setembro', role: 'check', col: 38 },
      { key: 'out', label: 'Outubro', role: 'check', col: 45 },
      { key: 'nov', label: 'Novembro', role: 'check', col: 48 },
      { key: 'dez', label: 'Dezembro', role: 'check', col: 51 }
    ],
    obsOptions: [
      'Item utilizado, a repor',
      'Item vencido, a repor',
      'Quantidade inferior ao previsto',
      'Item danificado ou faltante',
      'Sem observações - item conforme'
    ]
  }
];

/* =====================================================================
   HELPERS COMPARTILHADOS (formulario + dashboard)
   ===================================================================== */

function NH(x) {
  return String(x == null ? '' : x)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function cleanStr(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/[\r\n\t]+/g, ' ').trim();
}

function getProfile(id) {
  for (var i = 0; i < NR23_PROFILES.length; i++) {
    if (NR23_PROFILES[i].id === id) return NR23_PROFILES[i];
  }
  return NR23_PROFILES[0];
}

function checkColumns(p) {
  var out = [];
  for (var i = 0; i < p.columns.length; i++) {
    if (p.columns[i].role === 'check') out.push(p.columns[i]);
  }
  return out;
}

function obsColumns(p) {
  var out = [];
  for (var i = 0; i < p.columns.length; i++) {
    if (p.columns[i].role === 'obs') out.push(p.columns[i]);
  }
  return out;
}

function normCheck(v) {
  var s = cleanStr(v).toUpperCase();
  if (!s) return '';
  var n = s.replace(/[^A-Z0-9]/g, '');
  if (n.indexOf('CONFORME') !== -1) return 'NC';
  if (n.indexOf('APLICA') !== -1) return 'NA';
  if (n === 'NC') return 'NC';
  if (n === 'NA') return 'NA';
  if (s === 'OK' || s === 'SIM' || s === 'S' || n === 'C') return 'C';
  return '';
}

function dateVal(v) {
  if (v === null || v === undefined || v === '') return null;
  if (v instanceof Date) return v;
  if (typeof v === 'number' && isFinite(v) && v >= 20000 && v <= 80000) {
    var d = new Date(Date.UTC(1899, 11, 30) + v * 86400000);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  var s = cleanStr(v);
  if (/^\d{5}(?:\.\d+)?$/.test(s)) {
    var n = Number(s);
    if (isFinite(n) && n >= 20000 && n <= 80000) {
      var dd = new Date(Date.UTC(1899, 11, 30) + n * 86400000);
      return new Date(dd.getUTCFullYear(), dd.getUTCMonth(), dd.getUTCDate());
    }
  }
  var m = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  var iso = s.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
  var d2 = new Date(s);
  return isNaN(d2) ? null : d2;
}

function fmtDate(v) {
  var d = dateVal(v);
  if (!d) return cleanStr(v);
  var dd = String(d.getDate()).padStart(2, '0');
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  return dd + '/' + mm + '/' + d.getFullYear();
}

function daysUntil(v) {
  var d = dateVal(v);
  if (!d) return null;
  var t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - t.getTime()) / 86400000);
}

function maintLabel(v) {
  var d = daysUntil(v);
  if (d === null) return 'Sem data';
  if (d < 0) return 'Vencida';
  if (d <= 30) return 'Até 30 dias';
  if (d <= 90) return '31–90 dias';
  return '> 90 dias';
}

function statusInfo(row, p) {
  var checks = checkColumns(p);
  var vals = [];
  checks.forEach(function (c) {
    var v = normCheck(row[c.key]);
    vals.push(v);
  });
  var filled = vals.filter(function (v) { return v !== ''; }).length;
  var complete = checks.length > 0 && filled === checks.length;
  var hasNC = vals.indexOf('NC') !== -1;
  var hasNA = vals.indexOf('NA') !== -1;
  var onlyNA = hasNA && !hasNC && vals.every(function (v) { return v === '' || v === 'NA'; });
  var allC = vals.length > 0 && !hasNC && !hasNA && vals.every(function (v) { return v === 'C'; }) && filled > 0;
  var status = 'P';
  if (hasNC) status = 'NC';
  else if (allC) status = 'C';
  else if (onlyNA) status = 'NA';
  else if (filled > 0) status = 'P';
  return { c: allC ? 1 : 0, nc: hasNC ? 1 : 0, na: onlyNA ? 1 : 0, pend: (!complete && !hasNC && !allC && !onlyNA) ? 1 : 0, filled: filled, complete: complete };
}

function statusLabel(st) {
  if (st === 'C') return 'Conforme';
  if (st === 'NC') return 'N/C';
  if (st === 'NA') return 'N/A';
  return 'Pendente';
}

function profileItems(p, rows) {
  return { total: rows.length, checked: 0, complete: 0, c: 0, nc: 0, na: 0, pend: 0 };
}

function sumStatus(rows, p) {
  var out = { total: rows.length, checked: 0, complete: 0, c: 0, nc: 0, na: 0, pend: 0 };
  rows.forEach(function (r) {
    var s = statusInfo(r, p);
    out.checked += s.filled > 0 ? 1 : 0;
    out.complete += s.complete ? 1 : 0;
    out.c += s.c;
    out.nc += s.nc;
    out.na += s.na;
    out.pend += s.pend;
  });
  return out;
}

function escHtml(x) {
  return String(x == null ? '' : x).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}