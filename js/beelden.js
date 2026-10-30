// Vlakke illustraties in de huisstijl van Het leercollectief, voor de kop van
// een module. Zelf getekend, dus zonder rechten van anderen. Een module zonder
// eigen tekening krijgt die van haar spoor.
//
// Kleuren: groen #126425, mint #c2e3cc / #ccefd5, perzik #fcc89b, geel
// #fbf59b, lichtblauw #bfe3ed, inkt #2b3038 en het lichtje #ffcf3a.

const teken = (inhoud, label) =>
  `<svg viewBox="0 0 240 160" role="img" aria-label="${label}">${inhoud}</svg>`;

// Het lichtje: de AI-assistent, zoals op de voorpagina en in Leerlichtjes.
const lichtje = (x, y, r = 9) =>
  `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="#ffcf3a" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffcf3a"/><circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .35}" fill="#fffbe6"/>`;

// De zachte schaduw waarop elke tekening staat.
const schaduw = '<ellipse cx="120" cy="150" rx="104" ry="7" fill="#000" opacity=".06"/>';

// Een klein schoolgebouw, voor tekeningen waarin meer dan één school meedoet.
const huisje = (x, y, kleur) =>
  `<rect x="${x}" y="${y + 10}" width="28" height="20" rx="2" fill="${kleur}"/><path d="M${x - 3} ${y + 11}l17-12 17 12" stroke="#b5523b" stroke-width="5" fill="none" stroke-linejoin="round"/><rect x="${x + 10}" y="${y + 18}" width="8" height="12" fill="#126425"/>`;

const SPOOR = {
  ai: teken(`
    <ellipse cx="120" cy="148" rx="100" ry="7" fill="#000" opacity=".06"/>
    <rect x="34" y="24" width="150" height="96" rx="10" fill="#126425"/>
    <rect x="42" y="32" width="134" height="80" rx="4" fill="#2f7d45"/>
    <path d="M56 52h60M56 64h80M56 76h46" stroke="#ccefd5" stroke-width="5" stroke-linecap="round"/>
    <rect x="96" y="120" width="26" height="22" fill="#9c6f45"/>
    <rect x="140" y="70" width="70" height="40" rx="12" fill="#fff"/>
    <path d="M158 110l-6 14 18-14z" fill="#fff"/>
    <path d="M152 84h46M152 96h30" stroke="#bfe3ed" stroke-width="5" stroke-linecap="round"/>
    ${lichtje(206, 40)}`, 'Een schoolbord en een tekstballon'),
  vibe: teken(`
    <ellipse cx="120" cy="148" rx="100" ry="7" fill="#000" opacity=".06"/>
    <rect x="30" y="22" width="180" height="116" rx="12" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M30 34a12 12 0 0 1 12-12h156a12 12 0 0 1 12 12v10H30z" fill="#fcc89b"/>
    <circle cx="46" cy="33" r="4" fill="#fff"/><circle cx="58" cy="33" r="4" fill="#fff"/><circle cx="70" cy="33" r="4" fill="#fff"/>
    <rect x="46" y="56" width="70" height="40" rx="8" fill="#bfe3ed"/>
    <rect x="124" y="56" width="70" height="18" rx="6" fill="#ccefd5"/>
    <rect x="124" y="78" width="50" height="18" rx="6" fill="#fbf59b"/>
    <rect x="46" y="104" width="148" height="20" rx="10" fill="#126425"/>
    <path d="M70 114h60" stroke="#ccefd5" stroke-width="4" stroke-linecap="round"/>
    ${lichtje(196, 112, 7)}`, 'Een webpagina die zich opbouwt'),
  beleid: teken(`
    <ellipse cx="120" cy="148" rx="100" ry="7" fill="#000" opacity=".06"/>
    <rect x="62" y="16" width="100" height="126" rx="8" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M78 40h68M78 54h68M78 68h50M78 82h68M78 96h40" stroke="#c2e3cc" stroke-width="6" stroke-linecap="round"/>
    <circle cx="160" cy="112" r="26" fill="#126425"/>
    <path d="M148 112l8 8 16-17" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${lichtje(52, 36)}`, 'Een document met een groen vinkje'),
};

const MODULE = {
  // Een laptop met een gesprek, een zwaaiende hand en het lichtje.
  kennismaking: teken(`
    <ellipse cx="120" cy="150" rx="104" ry="7" fill="#000" opacity=".06"/>
    <rect x="44" y="26" width="152" height="100" rx="10" fill="#2b3038"/>
    <rect x="52" y="34" width="136" height="84" rx="4" fill="#fff"/>
    <rect x="62" y="44" width="74" height="18" rx="9" fill="#ccefd5"/>
    <path d="M70 53h56" stroke="#126425" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <rect x="102" y="68" width="76" height="18" rx="9" fill="#bfe3ed"/>
    <path d="M110 77h58" stroke="#124a5e" stroke-width="3.4" stroke-linecap="round" opacity=".5"/>
    <rect x="62" y="92" width="58" height="18" rx="9" fill="#ccefd5"/>
    <path d="M70 101h40" stroke="#126425" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
    <path d="M28 128h184l-10 14H38z" fill="#9aa3a8"/>
    <path d="M104 128h32l-3 5h-26z" fill="#7d868b"/>
    <g transform="translate(26 70) rotate(-14)">
      <rect x="-2" y="20" width="22" height="22" rx="9" fill="#fcc89b"/>
      <rect x="-1" y="2" width="5" height="22" rx="2.5" fill="#fcc89b"/>
      <rect x="5" y="-1" width="5" height="24" rx="2.5" fill="#fcc89b"/>
      <rect x="11" y="0" width="5" height="23" rx="2.5" fill="#fcc89b"/>
      <rect x="17" y="4" width="4.6" height="20" rx="2.3" fill="#fcc89b"/>
      <rect x="-9" y="24" width="12" height="5" rx="2.5" fill="#fcc89b" transform="rotate(-35 -3 26)"/>
    </g>
    <path d="M14 58q-4 6 0 12M8 54q-7 10 0 20" stroke="#f08a3c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${lichtje(204, 26)}`, 'Een laptop met een gesprek, een zwaaiende hand en het lichtje'),

  // ── spoor C: het kader ──
  'beleid-kader': teken(`
    ${schaduw}
    <circle cx="112" cy="82" r="56" fill="#fff" stroke="#c2e3cc" stroke-width="8"/>
    <circle cx="112" cy="82" r="40" fill="#ccefd5"/>
    <path d="M112 44l12 38h-24z" fill="#126425"/>
    <path d="M112 120l-12-38h24z" fill="#fcc89b"/>
    <circle cx="112" cy="82" r="6" fill="#fff"/>
    <path d="M112 22v8M112 134v8M52 82h8M164 82h8" stroke="#126425" stroke-width="4" stroke-linecap="round"/>
    ${lichtje(196, 38)}`, 'Een kompas'),
  'beleid-wet': teken(`
    ${schaduw}
    <path d="M30 34h70a10 10 0 0 1 10 10v92a10 10 0 0 0-10-10H30z" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M190 34h-70a10 10 0 0 0-10 10v92a10 10 0 0 1 10-10h70z" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <text x="68" y="96" font-size="54" text-anchor="middle" font-family="Georgia, serif" font-weight="700" fill="#126425">§</text>
    <path d="M126 58h48M126 72h48M126 86h34M126 100h44" stroke="#c2e3cc" stroke-width="6" stroke-linecap="round"/>
    <rect x="150" y="10" width="72" height="34" rx="12" fill="#fbf59b"/>
    <path d="M166 44l-4 10 14-10z" fill="#fbf59b"/>
    <path d="M162 23h46M162 32h30" stroke="#5b4f00" stroke-width="4" stroke-linecap="round" opacity=".55"/>`, 'Een wetboek met een paragraafteken en een tekstballon'),
  'beleid-school': teken(`
    ${schaduw}
    <rect x="22" y="58" width="116" height="80" rx="4" fill="#fcc89b"/>
    <path d="M16 62l64-40 64 40" stroke="#b5523b" stroke-width="10" fill="none" stroke-linejoin="round"/>
    <rect x="70" y="102" width="20" height="36" fill="#126425"/>
    <rect x="34" y="78" width="22" height="18" fill="#bfe3ed"/><rect x="104" y="78" width="22" height="18" fill="#bfe3ed"/>
    <path d="M80 22V4" stroke="#4d4d4d" stroke-width="3"/><path d="M80 4h20l-5 6 5 6H80z" fill="#126425"/>
    <rect x="150" y="40" width="72" height="98" rx="8" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <rect x="172" y="32" width="28" height="14" rx="5" fill="#9aa3a8"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M162 66l5 5 9-10M162 92l5 5 9-10M162 118l5 5 9-10" stroke="#126425" stroke-width="3.5"/>
      <path d="M184 68h26M184 94h26M184 120h18" stroke="#c2e3cc" stroke-width="5"/>
    </g>`, 'Een school met een vlag en een lijst met afspraken'),
  'beleid-zelfbouw': teken(`
    ${schaduw}
    <rect x="18" y="30" width="116" height="80" rx="8" fill="#2b3038"/>
    <rect x="25" y="37" width="102" height="66" rx="3" fill="#fff"/>
    <rect x="25" y="37" width="102" height="13" fill="#ccefd5"/>
    <rect x="94" y="40" width="29" height="7" rx="3.5" fill="#fbf59b"/>
    <g>
      <rect x="34" y="80" width="10" height="16" rx="2" fill="#86c494"/>
      <rect x="49" y="66" width="10" height="30" rx="2" fill="#126425"/>
      <rect x="64" y="84" width="10" height="12" rx="2" fill="#86c494"/>
      <rect x="79" y="73" width="10" height="23" rx="2" fill="#86c494"/>
    </g>
    <path d="M98 62h20M98 73h15M98 84h20" stroke="#d6d6d6" stroke-width="4" stroke-linecap="round"/>
    <rect x="66" y="110" width="20" height="16" fill="#9aa3a8"/>
    <rect x="50" y="126" width="52" height="6" rx="3" fill="#9aa3a8"/>
    <path d="M138 70c20 0 22-26 42-26M138 70h42M138 70c20 0 22 26 42 26" stroke="#126425" stroke-width="3" fill="none" stroke-dasharray="1 7" stroke-linecap="round"/>
    ${huisje(186, 24, '#fcc89b')}${huisje(186, 60, '#bfe3ed')}${huisje(186, 96, '#c2e3cc')}
    ${lichtje(126, 30, 7)}`, 'Een zelfgebouwde planner op een scherm, verbonden met drie scholen'),

  // ── spoor A: AI in de klas ──
  prompten: teken(`
    ${schaduw}
    <rect x="22" y="40" width="130" height="92" rx="14" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    ${[0, 1, 2, 3].map((i) => {
      const x = 46 + i * 28, y = 60 + (i % 2) * 22;
      return `<path d="M${x} 56v64" stroke="#e2e2e2" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y + 20}" r="10" fill="${['#126425', '#5fa9c9', '#f08a3c', '#e9c53a'][i]}"/>`;
    }).join('')}
    <circle cx="190" cy="70" r="36" fill="#fff" stroke="#f6c8c4" stroke-width="8"/>
    <circle cx="190" cy="70" r="20" fill="#fff" stroke="#d9534f" stroke-width="8"/>
    <circle cx="190" cy="70" r="6" fill="#d9534f"/>
    <path d="M150 110l38-38" stroke="#4d4d4d" stroke-width="4" stroke-linecap="round"/>
    <path d="M150 110l2-12 10 10z" fill="#4d4d4d"/>`, 'Vier schuifknoppen en een roos'),
  lesvoorbereiding: teken(`
    ${schaduw}
    <rect x="24" y="100" width="56" height="38" rx="6" fill="#ccefd5"/>
    <rect x="86" y="74" width="56" height="64" rx="6" fill="#bfe3ed"/>
    <rect x="148" y="46" width="56" height="92" rx="6" fill="#fcc89b"/>
    <text x="52" y="126" font-size="20" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#126425">1</text>
    <text x="114" y="112" font-size="20" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#124a5e">2</text>
    <text x="176" y="98" font-size="20" text-anchor="middle" font-family="Poppins, sans-serif" font-weight="700" fill="#7a3a05">3</text>
    <path d="M30 34h44a6 6 0 0 1 6 6v40H36a6 6 0 0 1-6-6z" fill="#5fa9c9"/>
    <path d="M38 46h30M38 56h30M38 66h20" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    ${lichtje(176, 26)}`, 'Drie trappen voor drie niveaus en een lesboek'),
  'toetsen-feedback': teken(`
    ${schaduw}
    <rect x="30" y="18" width="104" height="124" rx="8" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M44 44l5 5 9-10M44 74l5 5 9-10" stroke="#126425" stroke-width="3.5"/>
      <path d="M45 99l10 10M55 99l-10 10" stroke="#d9534f" stroke-width="3.5"/>
      <path d="M68 46h50M68 76h50M68 106h40" stroke="#e2e2e2" stroke-width="6"/>
    </g>
    <rect x="128" y="62" width="92" height="56" rx="16" fill="#ccefd5"/>
    <path d="M146 118l-6 16 22-16z" fill="#ccefd5"/>
    <path d="M174 102c-12-8-18-14-18-20a7 7 0 0 1 18-4 7 7 0 0 1 18 4c0 6-6 12-18 20z" fill="#126425"/>`, 'Een toets met vinkjes en een tekstballon met een hartje'),
  administratie: teken(`
    ${schaduw}
    <rect x="22" y="48" width="118" height="80" rx="8" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M24 52l57 42 57-42" stroke="#fcc89b" stroke-width="6" fill="none" stroke-linejoin="round"/>
    <rect x="150" y="30" width="72" height="80" rx="8" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M150 38a8 8 0 0 1 8-8h56a8 8 0 0 1 8 8v12h-72z" fill="#d9534f"/>
    <g fill="#c2e3cc">${[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${158 + c * 15}" y="${58 + r * 15}" width="10" height="10" rx="2"/>`).join('')).join('')}</g>
    <rect x="173" y="73" width="10" height="10" rx="2" fill="#126425"/>
    ${lichtje(120, 34, 8)}`, 'Een envelop en een kalender'),
  'veilig-en-ethisch': teken(`
    ${schaduw}
    <path d="M120 14l60 22v38c0 38-26 60-60 72-34-12-60-34-60-72V36z" fill="#126425"/>
    <path d="M120 28l46 17v29c0 30-20 48-46 58-26-10-46-28-46-58V45z" fill="#ccefd5"/>
    <rect x="100" y="70" width="40" height="32" rx="6" fill="#126425"/>
    <path d="M108 70v-8a12 12 0 0 1 24 0v8" stroke="#126425" stroke-width="6" fill="none"/>
    <circle cx="120" cy="84" r="5" fill="#ccefd5"/>
    ${lichtje(196, 40)}`, 'Een schild met een slotje'),
  leerlingencursus: teken(`
    ${schaduw}
    <rect x="30" y="38" width="80" height="100" rx="22" fill="#4e9a63"/>
    <rect x="44" y="26" width="52" height="20" rx="10" fill="none" stroke="#2f7d45" stroke-width="7"/>
    <rect x="42" y="72" width="56" height="40" rx="10" fill="#2f7d45"/>
    <rect x="128" y="22" width="80" height="116" rx="12" fill="#2b3038"/>
    <rect x="134" y="30" width="68" height="98" rx="6" fill="#fff"/>
    <rect x="140" y="38" width="56" height="10" rx="5" fill="#126425"/>
    <path d="M142 62h48M142 74h48M142 86h32" stroke="#c2e3cc" stroke-width="5" stroke-linecap="round"/>
    <rect x="140" y="98" width="40" height="16" rx="8" fill="#fbf59b"/>
    ${lichtje(208, 22, 8)}`, 'Een boekentas en een gsm met de leerlingencursus'),
  casussen: teken(`
    ${schaduw}
    <path d="M120 22v104" stroke="#9c6f45" stroke-width="7" stroke-linecap="round"/>
    <path d="M88 138h64" stroke="#9c6f45" stroke-width="9" stroke-linecap="round"/>
    <path d="M44 44h152" stroke="#9c6f45" stroke-width="6" stroke-linecap="round"/>
    <circle cx="120" cy="30" r="9" fill="#ffcf3a"/>
    <path d="M44 44l-20 46h40zM196 44l-20 46h40z" fill="none" stroke="#9c6f45" stroke-width="2.5"/>
    <path d="M20 90a24 9 0 0 0 48 0z" fill="#ccefd5"/>
    <path d="M172 90a24 9 0 0 0 48 0z" fill="#f6c8c4"/>
    <path d="M34 78l7 7 12-13" stroke="#126425" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M188 72l14 14M202 72l-14 14" stroke="#a3242b" stroke-width="5" stroke-linecap="round"/>`, 'Een weegschaal met een vinkje en een kruisje'),

  // ── spoor B: vibe coden ──
  'vibe-start': teken(`
    ${schaduw}
    <path d="M30 60h34a10 10 0 1 1 20 0h34v34a10 10 0 1 0 0 20v34H30z" fill="#fcc89b" transform="translate(0 -14)"/>
    <path d="M118 46h34a10 10 0 1 1 20 0h34v86H118v-30a10 10 0 1 0 0-20z" fill="#bfe3ed"/>
    <path d="M62 90h24M74 78v24" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    <path d="M148 80l-12 10 12 10M176 80l12 10-12 10" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${lichtje(120, 22)}`, 'Twee puzzelstukken die in elkaar passen'),
  'vibe-bouwen': teken(`
    ${schaduw}
    <rect x="26" y="20" width="150" height="112" rx="10" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M26 30a10 10 0 0 1 10-10h130a10 10 0 0 1 10 10v8H26z" fill="#fcc89b"/>
    <rect x="40" y="50" width="56" height="32" rx="6" fill="#bfe3ed"/>
    <rect x="104" y="50" width="58" height="14" rx="5" fill="#ccefd5"/>
    <rect x="104" y="68" width="40" height="14" rx="5" fill="#fbf59b"/>
    <rect x="40" y="92" width="122" height="26" rx="13" fill="#126425"/>
    <g transform="translate(182 70) rotate(35)">
      <rect x="-5" y="0" width="10" height="64" rx="4" fill="#9c6f45"/>
      <rect x="-20" y="-14" width="40" height="18" rx="5" fill="#4d4d4d"/>
    </g>`, 'Een webpagina in opbouw en een hamer'),
  'vibe-delen': teken(`
    ${schaduw}
    <rect x="18" y="40" width="112" height="76" rx="8" fill="#2b3038"/>
    <rect x="24" y="46" width="100" height="62" rx="3" fill="#fff"/>
    <path d="M8 118h132l-8 10H16z" fill="#9aa3a8"/>
    <rect x="34" y="56" width="50" height="22" rx="5" fill="#bfe3ed"/><rect x="34" y="84" width="80" height="14" rx="7" fill="#126425"/>
    <rect x="176" y="46" width="48" height="86" rx="10" fill="#2b3038"/>
    <rect x="181" y="54" width="38" height="66" rx="4" fill="#fff"/>
    <rect x="186" y="62" width="28" height="14" rx="4" fill="#bfe3ed"/><rect x="186" y="96" width="28" height="10" rx="5" fill="#126425"/>
    <g transform="translate(153 82) rotate(-40)" fill="none" stroke="#f08a3c" stroke-width="6">
      <rect x="-25" y="-9" width="28" height="18" rx="9"/>
      <rect x="-3" y="-9" width="28" height="18" rx="9"/>
    </g>`, 'Een laptop en een gsm, verbonden door een link'),
  'vibe-data': teken(`
    ${schaduw}
    <ellipse cx="70" cy="40" rx="42" ry="14" fill="#5fa9c9"/>
    <path d="M28 40v76a42 14 0 0 0 84 0V40a42 14 0 0 1-84 0z" fill="#bfe3ed"/>
    <path d="M28 66a42 14 0 0 0 84 0M28 92a42 14 0 0 0 84 0" stroke="#5fa9c9" stroke-width="4" fill="none"/>
    <rect x="52" y="96" width="36" height="28" rx="6" fill="#126425"/>
    <path d="M60 96v-7a10 10 0 0 1 20 0v7" stroke="#126425" stroke-width="5" fill="none"/>
    <g stroke="#9aa3a8" stroke-width="5" fill="none" stroke-linecap="round"><path d="M150 32v96M150 64q0 18 40 18v46"/></g>
    <g fill="#fff" stroke-width="5">
      <circle cx="150" cy="32" r="10" stroke="#126425"/><circle cx="150" cy="80" r="10" stroke="#126425"/><circle cx="150" cy="128" r="10" stroke="#126425"/>
      <circle cx="190" cy="104" r="10" stroke="#f08a3c"/>
    </g>`, 'Een database met een slotje en versies als vertakking'),
  'vibe-ai': teken(`
    ${schaduw}
    <rect x="30" y="20" width="160" height="116" rx="12" fill="#fff" stroke="#e2e2e2" stroke-width="2"/>
    <path d="M30 32a12 12 0 0 1 12-12h136a12 12 0 0 1 12 12v8H30z" fill="#fcc89b"/>
    <rect x="44" y="54" width="70" height="12" rx="6" fill="#e2e2e2"/>
    <rect x="44" y="74" width="54" height="12" rx="6" fill="#e2e2e2"/>
    <rect x="44" y="100" width="70" height="22" rx="11" fill="#126425"/>
    <circle cx="152" cy="84" r="34" fill="#fff6d6"/>
    ${lichtje(152, 84, 14)}
    <path d="M196 30l3 9 9 3-9 3-3 9-3-9-9-3 9-3zM212 70l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#ffcf3a"/>`, 'Een eigen app met het lichtje erin'),
  'vibe-voorbeeld': teken(`
    ${schaduw}
    <path d="M40 120c30 0 20-50 60-50s30-40 70-40" stroke="#86c494" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="2 14"/>
    <circle cx="36" cy="120" r="18" fill="#fbf59b"/>
    <path d="M30 116a6 6 0 1 1 12 0c0 4-3 5-3 8h-6c0-3-3-4-3-8z" fill="#e0b23c"/>
    <circle cx="100" cy="72" r="14" fill="#bfe3ed"/>
    <path d="M94 72l4 4 8-9" stroke="#124a5e" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="160" y="10" width="64" height="44" rx="5" fill="#126425"/>
    <rect x="166" y="16" width="52" height="32" rx="3" fill="#2f7d45"/>
    <path d="M172 26h30M172 36h22" stroke="#ccefd5" stroke-width="4" stroke-linecap="round"/>
    <rect x="186" y="54" width="12" height="14" fill="#9c6f45"/>
    ${lichtje(208, 118)}`, 'Een weg van een idee naar een schoolbord'),
};

export function moduleBeeld(module) {
  return MODULE[module.id] || SPOOR[module.spoor] || SPOOR.ai;
}

// Kleine iconen voor de snelkoppelingen op het overzicht, in plaats van emoji:
// die zien er op elk toestel anders uit.
const icoon = (inhoud) => `<svg viewBox="0 0 24 24" aria-hidden="true">${inhoud}</svg>`;
export const ICOON = {
  begin: icoon('<path d="M6 3v18" stroke="#126425" stroke-width="2" stroke-linecap="round"/><path d="M7 4h11l-3 4 3 4H7z" fill="#126425"/>'),
  prompts: icoon('<path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" fill="#126425"/><path d="M7 9h10M7 12h6" stroke="#ccefd5" stroke-width="1.8" stroke-linecap="round"/>'),
  sessie: icoon('<path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 0 0 4v4H4z" fill="#126425"/>'),
  leerlingen: icoon('<rect x="5" y="7" width="14" height="14" rx="4" fill="#126425"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="#126425" stroke-width="1.8" fill="none"/><rect x="8" y="12" width="8" height="5" rx="1.5" fill="#ccefd5"/>'),
  gids: icoon('<circle cx="12" cy="12" r="9" fill="none" stroke="#126425" stroke-width="2"/><path d="M12 5l2.5 7h-5z" fill="#126425"/><path d="M12 19l-2.5-7h5z" fill="#86c494"/>'),
  huis: icoon('<path d="M5.5 10.5V20h5v-5.5h3V20h5v-9.5L12 5z" fill="#126425"/><path d="M3 11.5L12 4l9 7.5" stroke="#126425" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
  start: icoon('<path d="M12 21v-8" stroke="#126425" stroke-width="2.2" stroke-linecap="round"/><path d="M12 14c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z" fill="#126425"/><path d="M12 12.5c0-3.2-2.4-5.2-5.6-5.2 0 3.2 2.4 5.2 5.6 5.2z" fill="#86c494"/>'),
  lichtje: icoon('<circle cx="12" cy="10" r="6.5" fill="#ffcf3a"/><circle cx="10" cy="8" r="2" fill="#fff4c2"/><path d="M9.5 18.5h5M10.5 21h3" stroke="#126425" stroke-width="2" stroke-linecap="round"/>'),
  verder: icoon('<circle cx="12" cy="12" r="10" fill="#126425"/><path d="M10 7.5l5 4.5-5 4.5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
};
