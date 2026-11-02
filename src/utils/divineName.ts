/**
 * Divine Name Handling Utility
 * Translates or preserves the original divine name (Jehovah / Jehova) based on user preference.
 */

export function transformEnglishDivineName(text: string): string {
  if (!text) return text;
  let s = text;

  // Compound names
  s = s.replace(/\bJehovah[–-]jireh\b/g, 'LORD-jireh');
  s = s.replace(/\bJehovah[–-]nissi\b/g, 'LORD-nissi');
  s = s.replace(/\bJehovah[–-]shalom\b/g, 'LORD-shalom');
  s = s.replace(/\bJehovah[–-]shammah\b/g, 'LORD-shammah');
  s = s.replace(/\bJehovah[–-]tsidkenu\b/g, 'LORD-tsidkenu');

  // Specific verse cleanups
  s = s.replace(/\bthe Lord Jehovah\b/g, 'the LORD');
  s = s.replace(/\bLord Jehovah\b/g, 'the LORD');
  s = s.replace(/\bwhose name alone is, Jehovah art\b/g, 'whose name alone is the LORD, art');
  s = s.replace(/I am the: Lord Lord: or, Jehovah/g, 'I am the LORD');
  s = s.replace(/The\. Lord Lord: or, Jehovah/g, 'The LORD');
  s = s.replace(/THE\. OUR RIGHTEOUSNESS Lord …: Heb\. Jehovah–tsidkenu Lord/g, 'THE LORD OUR RIGHTEOUSNESS');
  s = s.replace(/The\. our righteousness Lord …: Heb\. Jehovah–tsidkenu Lord/g, 'The LORD our righteousness');
  s = s.replace(/Lord is: or, Jehovah, etc/g, 'the LORD is his name');
  s = s.replace(/Lord: or, Jehovah/g, 'LORD');
  s = s.replace(/Lord …: Heb\. Jehovah–shammah/g, 'The LORD is there');
  s = s.replace(/Lord …: Heb\. Jehovah–tsidkenu/g, 'The LORD our righteousness');

  // General Jehovah replacements
  s = s.replace(/\bJEHOVAH\b/g, 'LORD');
  s = s.replace(/\bJehovah\b/g, 'LORD');
  s = s.replace(/\bjehovah\b/g, 'lord');

  return s;
}

export function transformCebuanoDivineName(text: string): string {
  if (!text) return text;
  let s = text;

  // Special grammar constructions: "si Jehova nga Dios" -> "Ginoo nga Dios"
  s = s.replace(/\b[Ss]i\s+Jehovah?\s+nga\s+Dios\b/g, 'Ginoo nga Dios');
  s = s.replace(/\bSI\s+JEHOVAH?\s+NGA\s+DIOS\b/g, 'GINOO NGA DIOS');
  s = s.replace(/\b[Nn]i\s+Jehovah?\s+nga\s+Dios\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo nga Dios' : 'sa Ginoo nga Dios'));
  s = s.replace(/\b[Kk]ang\s+Jehovah?\s+nga\s+Dios\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo nga Dios' : 'sa Ginoo nga Dios'));

  // Prepositional markers before Jehova -> Ginoo
  s = s.replace(/\b[Ss]i\s+Jehovah?\b/g, (m) => (m[0] === 'S' ? 'Ang Ginoo' : 'ang Ginoo'));
  s = s.replace(/\b[Nn]i\s+Jehovah?\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\b[Kk]ang\s+Jehovah?\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo' : 'sa Ginoo'));

  // General replacements
  s = s.replace(/\bJEHOVAH?\b/g, 'GINOO');
  s = s.replace(/\bJehovah?\b/g, 'Ginoo');

  // Adonai YHWH duplicates: Ginoong Ginoo -> Ginoong Dios
  s = s.replace(/\b([Aa]ng|[Ss]a|[Oo]h|[Oo])\s+[Gg]inoong\s+[Gg]inoo\b/g, (m, p1) => `${p1} Ginoong Dios`);
  s = s.replace(/\b[Gg]inoong\s+[Gg]inoo\b/g, (m) => (m[0] === 'G' ? 'Ginoong Dios' : 'ginoong Dios'));

  // Fix grammatical markers before Ginoo
  s = s.replace(/\bSi\s+Ginoo\b/g, 'Ang Ginoo');
  s = s.replace(/\bsi\s+Ginoo\b/g, 'ang Ginoo');
  s = s.replace(/\bSI\s+GINOO\b/g, 'ANG GINOO');

  s = s.replace(/\bNi\s+Ginoo\b/g, 'Sa Ginoo');
  s = s.replace(/\bni\s+Ginoo\b/g, 'sa Ginoo');
  s = s.replace(/\bNI\s+GINOO\b/g, 'SA GINOO');

  s = s.replace(/\bKang\s+Ginoo\b/g, 'Sa Ginoo');
  s = s.replace(/\bkang\s+Ginoo\b/g, 'sa Ginoo');
  s = s.replace(/\bKANG\s+GINOO\b/g, 'SA GINOO');

  return s;
}

export function transformTagalogDivineName(text: string): string {
  if (!text) return text;
  let s = text;

  // Compounds & Appositives
  s = s.replace(/\bang\s+Panginoon\s+si\s+Jehova\b/gi, 'ang Panginoong Dios');
  s = s.replace(/\bPanginoong\s+Jehova\b/gi, 'Panginoong Dios');
  s = s.replace(/\bPanginoon\s+na\s+Jehova\b/gi, 'Panginoong Dios');
  s = s.replace(/\b[Ss]i\s+Jehova,\s+na\s+Panginoon\b/g, (m) => (m[0] === 'S' ? 'Ang Panginoong Dios' : 'ang Panginoong Dios'));
  s = s.replace(/\b[Kk]ay\s+Jehova\s+na\s+Panginoon\b/g, (m) => (m[0] === 'K' ? 'Sa Panginoong Dios' : 'sa Panginoong Dios'));

  s = s.replace(/\bJehova[–-]jireh\b/g, 'Panginoon-jireh');
  s = s.replace(/\bJehova[–-]salom\b/g, 'Panginoon-salom');

  // Markers: si Jehova -> ang Panginoon, ni Jehova -> ng Panginoon, kay Jehova -> sa Panginoon
  s = s.replace(/\bSi\s+Jehova\b/g, 'Ang Panginoon');
  s = s.replace(/\bsi\s+Jehova\b/g, 'ang Panginoon');
  s = s.replace(/\bNi\s+Jehova\b/g, 'Ng Panginoon');
  s = s.replace(/\bni\s+Jehova\b/g, 'ng Panginoon');
  s = s.replace(/\bKay\s+Jehova\b/g, 'Sa Panginoon');
  s = s.replace(/\bkay\s+Jehova\b/g, 'sa Panginoon');

  // All caps
  s = s.replace(/\bJEHOVA\b/g, 'PANGINOON');
  // General
  s = s.replace(/\bJehova\b/g, 'Panginoon');

  return s;
}

export function formatVerseText(
  text: string | undefined,
  language: 'cebuano' | 'english' | 'tagalog',
  useOriginalDivineName: boolean = false
): string {
  if (!text) return '';
  if (useOriginalDivineName) {
    return text;
  }
  if (language === 'cebuano') {
    return transformCebuanoDivineName(text);
  }
  if (language === 'english') {
    return transformEnglishDivineName(text);
  }
  if (language === 'tagalog') {
    return transformTagalogDivineName(text);
  }
  return text;
}
