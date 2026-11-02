// Mapa da sola em SVG. Coordenadas do pé DIREITO visto por baixo (dedão à esquerda,
// viewBox 0 0 200 470); o pé esquerdo é o espelho. Zonas do mapa clássico da reflexologia.
(function () {
  const SOLA = "M38 150 C30 195 58 245 70 292 C78 332 54 370 57 410 C60 450 90 463 106 463 C136 463 153 440 151 400 C149 350 160 300 168 250 C176 205 183 176 177 150 C172 128 150 118 130 122 C105 118 70 112 52 118 C38 124 34 138 38 150 Z";
  const DEDOS = [[60, 82, 26, 37], [99, 92, 13, 23], [124, 99, 12, 20], [147, 110, 11, 17], [166, 127, 10, 14]];

  // n = número na legenda; pes = em quais pés aparece; s = formas; m = posição do número
  const ZONAS = {
    cabeca:   { n: 1,  nome: "Cabeça e cérebro", cor: "#E9A3C0", pes: "DE", s: '<ellipse cx="60" cy="70" rx="23" ry="25"/>', m: [60, 64] },
    seios:    { n: 2,  nome: "Seios da face", cor: "#F4C9DA", pes: "DE", s: '<circle cx="99" cy="73" r="9"/><circle cx="124" cy="82" r="8"/><circle cx="147" cy="95" r="7"/><circle cx="166" cy="114" r="6"/>', m: [124, 82] },
    nuca:     { n: 3,  nome: "Nuca e pescoço", cor: "#F1B37A", pes: "DE", s: '<rect x="33" y="96" width="54" height="20" rx="6"/>', m: [60, 106] },
    olhos:    { n: 4,  nome: "Olhos", cor: "#C7B4E6", pes: "DE", s: '<ellipse cx="111" cy="112" rx="17" ry="7"/>', m: [111, 112] },
    ouvidos:  { n: 5,  nome: "Ouvidos", cor: "#B2A0DA", pes: "DE", s: '<ellipse cx="156" cy="126" rx="14" ry="7"/>', m: [156, 126] },
    tireoide: { n: 6,  nome: "Garganta e tireoide", cor: "#97D1C1", pes: "DE", s: '<ellipse cx="60" cy="133" rx="20" ry="10"/>', m: [60, 133] },
    pulmoes:  { n: 7,  nome: "Pulmões e peito", cor: "#A6D5EA", pes: "DE", s: '<ellipse cx="112" cy="155" rx="62" ry="27"/>', m: [134, 150] },
    ombro:    { n: 8,  nome: "Ombro", cor: "#FFCFAE", pes: "DE", s: '<ellipse cx="171" cy="152" rx="10" ry="17"/>', m: [170, 152] },
    coracao:  { n: 9,  nome: "Coração (pé esquerdo)", cor: "#F28F86", pes: "E", s: '<ellipse cx="80" cy="164" rx="18" ry="13"/>', m: [80, 164] },
    plexo:    { n: 10, nome: "Plexo solar (sono e tensão)", cor: "#F7C948", pes: "DE", s: '<circle cx="100" cy="193" r="11"/>', m: [100, 193] },
    figado:   { n: 11, nome: "Fígado (pé direito)", cor: "#C3889A", pes: "D", s: '<ellipse cx="136" cy="226" rx="40" ry="23"/>', m: [146, 220] },
    vesicula: { n: 12, nome: "Vesícula (pé direito)", cor: "#7FA79B", pes: "D", s: '<circle cx="126" cy="243" r="8"/>', m: [126, 243] },
    estomago: { n: 13, nome: "Estômago", cor: "#F4B860", pes: "DE", s: { D: '<ellipse cx="74" cy="222" rx="17" ry="19"/>', E: '<ellipse cx="82" cy="222" rx="30" ry="22"/>' }, m: { D: [72, 222], E: [80, 220] } },
    pancreas: { n: 14, nome: "Pâncreas", cor: "#E9D8A6", pes: "DE", s: '<ellipse cx="98" cy="252" rx="32" ry="7"/>', m: { D: [92, 253], E: [100, 252] } },
    baco:     { n: 15, nome: "Baço (pé esquerdo)", cor: "#A898B0", pes: "E", s: '<ellipse cx="149" cy="226" rx="14" ry="22"/>', m: [150, 226] },
    rins:     { n: 16, nome: "Rins e suprarrenais", cor: "#78B6BF", pes: "DE", s: '<ellipse cx="100" cy="283" rx="11" ry="15"/><circle cx="100" cy="264" r="5"/>', m: [100, 285] },
    bexiga:   { n: 17, nome: "Bexiga", cor: "#B3DDCB", pes: "DE", s: '<ellipse cx="80" cy="348" rx="13" ry="10"/>', m: [80, 348] },
    intestino:{ n: 18, nome: "Intestinos", cor: "#F3C4BC", pes: "DE", s: '<rect x="70" y="300" width="88" height="46" rx="16"/>', m: [126, 323] },
    pelve:    { n: 19, nome: "Pelve e nervo ciático", cor: "#CDB2DA", pes: "DE", s: '<ellipse cx="104" cy="414" rx="47" ry="42"/><rect x="58" y="384" width="92" height="9" rx="4" opacity=".55" fill="#9C7AB0"/>', m: [104, 418] },
    coluna:   { n: 20, nome: "Coluna (borda de dentro)", cor: "#C9963B", pes: "DE", linha: "M45 112 C42 145 42 175 49 207 C57 245 72 268 77 296 C81 326 68 352 64 395 C62 425 68 440 78 452", m: [70, 266] },
    joelho:   { n: 21, nome: "Joelho e quadril", cor: "#E7B7A0", pes: "DE", s: '<ellipse cx="150" cy="390" rx="8" ry="19"/>', m: [149, 390] },
  };

  const pega = (v, pe) => (v && typeof v === "object" && !Array.isArray(v) ? v[pe] : v);
  let uid = 0;

  // pe: "D" ou "E"; destaque: lista de zonas (vazia = todas coloridas);
  // numeros: mostra os números; extra: SVG nas coordenadas do pé direito (é espelhado junto)
  function pe(opts) {
    const o = Object.assign({ pe: "D", destaque: [], numeros: true, extra: "", largura: "100%", rotulo: true }, opts);
    const id = "s" + (++uid);
    const esp = o.pe === "E";
    const tudo = o.destaque.length === 0;
    let formas = "", nums = "";
    for (const [k, z] of Object.entries(ZONAS)) {
      if (!z.pes.includes(o.pe)) continue;
      const ativo = tudo || o.destaque.includes(k);
      const cor = ativo ? z.cor : "#EFE6E2";
      if (z.linha) {
        formas += `<path d="${z.linha}" fill="none" stroke="${ativo ? z.cor : "#E3D6D0"}" stroke-width="${ativo ? 7 : 5}" stroke-linecap="round" stroke-dasharray="${ativo ? "1 9" : "none"}" opacity="${ativo ? 1 : .8}"/>`;
      } else {
        formas += `<g fill="${cor}" opacity="${ativo ? .95 : .9}">${pega(z.s, o.pe)}</g>`;
      }
      if (o.numeros && ativo) {
        let [x, y] = pega(z.m, o.pe);
        if (esp) x = 200 - x;
        nums += `<g><circle cx="${x}" cy="${y}" r="7.5" fill="#fff" stroke="#3E0D22" stroke-width="1.2"/><text x="${x}" y="${y + 3.1}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="8.4" fill="#3E0D22">${z.n}</text></g>`;
      }
    }
    const dedos = DEDOS.map(([cx, cy, rx, ry]) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`).join("");
    const contorno = `<path d="${SOLA}"/>${dedos}`;
    const t = esp ? 'transform="translate(200 0) scale(-1 1)"' : "";
    const rot = o.rotulo ? `<text x="100" y="${o.pe === "D" ? 492 : 492}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="13" letter-spacing="2" fill="#5B1631">${esp ? "PÉ ESQUERDO" : "PÉ DIREITO"}</text>` : "";
    return `<svg viewBox="0 0 200 ${o.rotulo ? 500 : 470}" style="width:${o.largura};display:block" xmlns="http://www.w3.org/2000/svg">
      <defs><clipPath id="${id}"><path d="${SOLA}"/>${dedos}</clipPath>
      <radialGradient id="${id}g" cx="50%" cy="45%" r="65%"><stop offset="0" stop-color="#FCE9DF"/><stop offset="1" stop-color="#F2CDBB"/></radialGradient></defs>
      <g ${t}>
        <g fill="url(#${id}g)" stroke="#C99A86" stroke-width="2">${contorno}</g>
        <g clip-path="url(#${id})">${formas}</g>
        <g fill="none" stroke="#B9846F" stroke-width="1.6">${contorno}</g>${o.extra}
      </g>${nums}${rot}</svg>`;
  }

  // Setas e marcas prontas para os protocolos (coordenadas do pé direito)
  const SETA = (d, cor = "#3E0D22") => `<path d="${d}" fill="none" stroke="${cor}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#ponta)"/>`;
  const PONTA = '<defs><marker id="ponta" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#3E0D22"/></marker></defs>';
  const ALVO = (x, y, r = 13) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#3E0D22" stroke-width="2.4" stroke-dasharray="4 3"/>`;

  window.MAPA = { pe, ZONAS, SETA, PONTA, ALVO };
})();
