/**
 * Divine Name Handling Utility
 * Accurately translates or preserves the original divine name (Jehovah / Jehova) based on user preference
 * across English (KJV), Tagalog (Ang Dating Biblia 1905), and Cebuano (Bugna 1917).
 */

/**
 * Transforms English text based on the divine name toggle.
 * When ON: displays "Jehovah" / "JEHOVAH".
 * When OFF: replaces "Jehovah" with "LORD" with correct English grammar.
 */
export function transformEnglishDivineName(text: string, useOriginalDivineName: boolean = false): string {
  if (!text) return text;

  if (useOriginalDivineName) {
    // When ON: ensure authentic original "Jehovah" representation
    return text;
  }

  let s = text;

  // 1. Compound memorial names
  s = s.replace(/\bJehovah[–—-]jireh\b/gi, 'LORD-jireh');
  s = s.replace(/\bJehovah[–—-]nissi\b/gi, 'LORD-nissi');
  s = s.replace(/\bJehovah[–—-]shalom\b/gi, 'LORD-shalom');
  s = s.replace(/\bJehovah[–—-]shammah\b/gi, 'LORD-shammah');
  s = s.replace(/\bJehovah[–—-]tsidkenu\b/gi, 'LORD-tsidkenu');

  // 2. Specific verse appositions and English double titles (preventing "the Lord LORD")
  // e.g. Isaiah 12:2 & Isaiah 26:4: "the Lord JEHOVAH" -> "the LORD GOD"
  s = s.replace(/\bthe\s+Lord\s+JEHOVAH\b/g, 'the LORD GOD');
  s = s.replace(/\bthe\s+Lord\s+Jehovah\b/g, 'the LORD GOD');
  s = s.replace(/\bThe\s+Lord\s+JEHOVAH\b/g, 'The LORD GOD');
  s = s.replace(/\bThe\s+Lord\s+Jehovah\b/g, 'The LORD GOD');
  s = s.replace(/\bLord\s+JEHOVAH\b/g, 'the LORD GOD');
  s = s.replace(/\bLord\s+Jehovah\b/g, 'the LORD GOD');

  // 3. Name construction (Exodus 6:3 & Psalms 83:18)
  // "by my name Jehovah" -> "by my name the LORD" (English requires definite article before title LORD)
  s = s.replace(/\bby\s+my\s+name\s+Jehovah\b/gi, 'by my name the LORD');
  s = s.replace(/\bwhose\s+name\s+alone\s+is,\s+Jehovah\s+art\b/gi, 'whose name alone is the LORD, art');
  s = s.replace(/\bwhose\s+name\s+alone\s+is,?\s+JEHOVAH\b/gi, 'whose name alone is the LORD');
  s = s.replace(/\bwhose\s+name\s+alone\s+is,?\s+Jehovah\b/gi, 'whose name alone is the LORD');

  // 4. KJV text artifacts & marginal notes cleanup
  s = s.replace(/I am the:\s*Lord Lord:\s*or,\s*Jehovah/gi, 'I am the LORD');
  s = s.replace(/The\.\s*Lord Lord:\s*or,\s*Jehovah/gi, 'The LORD');
  s = s.replace(/THE\.\s*OUR RIGHTEOUSNESS Lord\s*…:\s*Heb\.\s*Jehovah[–—-]tsidkenu Lord/gi, 'THE LORD OUR RIGHTEOUSNESS');
  s = s.replace(/The\.\s*our righteousness Lord\s*…:\s*Heb\.\s*Jehovah[–—-]tsidkenu Lord/gi, 'The LORD our righteousness');
  s = s.replace(/Lord is:\s*or,\s*Jehovah,?\s*etc/gi, 'the LORD is his name');
  s = s.replace(/Lord:\s*or,\s*Jehovah/gi, 'LORD');
  s = s.replace(/Lord\s*…:\s*Heb\.\s*Jehovah[–—-]shammah/gi, 'The LORD is there');
  s = s.replace(/Lord\s*…:\s*Heb\.\s*Jehovah[–—-]tsidkenu/gi, 'The LORD our righteousness');

  // 5. General case-sensitive replacements
  s = s.replace(/\bJEHOVAH\b/g, 'LORD');
  s = s.replace(/\bJehovah\b/g, 'LORD');
  s = s.replace(/\bjehovah\b/g, 'lord');

  return s;
}

/**
 * Transforms Cebuano text based on the divine name toggle.
 * When ON: displays original "Jehova", "si Jehova", "ni Jehova", "kang Jehova", and "si Jehova nga Dios".
 * When OFF: replaces with "Ginoo" with correct grammatical articles:
 *   "si Jehova" / "si Ginoo" -> "ang Ginoo"
 *   "ni Jehova" / "ni Ginoo" -> "sa Ginoo"
 *   "kang Jehova" / "kang Ginoo" -> "sa Ginoo"
 *   "si Jehova nga Dios" / "si Ginoo nga Dios" -> "ang Ginoo nga Dios"
 *   "ni Jehova nga Dios" / "ni Ginoo nga Dios" -> "sa Ginoo nga Dios"
 *   "kang Jehova nga Dios" / "kang Ginoo nga Dios" -> "sa Ginoo nga Dios"
 */
export function transformCebuanoDivineName(text: string, useOriginalDivineName: boolean = false): string {
  if (!text) return text;
  let s = text;

  if (useOriginalDivineName) {
    // When ON: restore and preserve original Cebuano Bugna "Jehova" with personal articles
    // 1. Appositions with "nga Dios"
    s = s.replace(/\b[Aa]ng\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'A' ? 'Si Jehova nga Dios' : 'si Jehova nga Dios'));
    s = s.replace(/\b[Ss]i\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'S' ? 'Si Jehova nga Dios' : 'si Jehova nga Dios'));
    s = s.replace(/\bANG\s+GINOO\s+NGA\s+DIOS\b/g, 'SI JEHOVA NGA DIOS');
    s = s.replace(/\bSI\s+GINOO\s+NGA\s+DIOS\b/g, 'SI JEHOVA NGA DIOS');

    s = s.replace(/\b[Nn]i\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'N' ? 'Ni Jehova nga Dios' : 'ni Jehova nga Dios'));
    s = s.replace(/\b[Kk]ang\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'K' ? 'Kang Jehova nga Dios' : 'kang Jehova nga Dios'));

    // 2. Personal articles with Ginoo (remnants from previous replacements)
    s = s.replace(/\b[Ss]i\s+Ginoo\b/g, (m) => (m[0] === 'S' ? 'Si Jehova' : 'si Jehova'));
    s = s.replace(/\bSI\s+GINOO\b/g, 'SI JEHOVA');
    s = s.replace(/\b[Nn]i\s+Ginoo\b/g, (m) => (m[0] === 'N' ? 'Ni Jehova' : 'ni Jehova'));
    s = s.replace(/\bNI\s+GINOO\b/g, 'NI JEHOVA');
    s = s.replace(/\b[Kk]ang\s+Ginoo\b/g, (m) => (m[0] === 'K' ? 'Kang Jehova' : 'kang Jehova'));
    s = s.replace(/\bKANG\s+GINOO\b/g, 'KANG JEHOVA');

    // 3. Compound names
    s = s.replace(/\bGinoo[–—-]jireh\b/gi, 'Jehova-jireh');
    s = s.replace(/\bGinoo[–—-]nissi\b/gi, 'Jehova-nissi');
    s = s.replace(/\bGinoo[–—-]salom\b/gi, 'Jehova-salom');
    s = s.replace(/\bGinoo[–—-]shalom\b/gi, 'Jehova-shalom');

    return s;
  }

  // When OFF: replace "Jehova" with "Ginoo" and apply strict Cebuano grammatical article corrections

  // 1. Appositions with "nga Dios":
  // "si Jehova nga Dios" / "si Ginoo nga Dios" MUST become "ang Ginoo nga Dios" (never "si Ginoo nga Dios")
  s = s.replace(/\b[Ss]i\s+Jehovah?\s+nga\s+Dios\b/g, (m) => (m[0] === 'S' ? 'Ang Ginoo nga Dios' : 'ang Ginoo nga Dios'));
  s = s.replace(/\b[Ss]i\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'S' ? 'Ang Ginoo nga Dios' : 'ang Ginoo nga Dios'));
  s = s.replace(/\bSI\s+JEHOVAH?\s+NGA\s+DIOS\b/g, 'ANG GINOO NGA DIOS');
  s = s.replace(/\bSI\s+GINOO\s+NGA\s+DIOS\b/g, 'ANG GINOO NGA DIOS');

  // "ni Jehova nga Dios" / "ni Ginoo nga Dios" -> "sa Ginoo nga Dios"
  s = s.replace(/\b[Nn]i\s+Jehovah?\s+nga\s+Dios\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo nga Dios' : 'sa Ginoo nga Dios'));
  s = s.replace(/\b[Nn]i\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo nga Dios' : 'sa Ginoo nga Dios'));
  s = s.replace(/\bNI\s+JEHOVAH?\s+NGA\s+DIOS\b/g, 'SA GINOO NGA DIOS');
  s = s.replace(/\bNI\s+GINOO\s+NGA\s+DIOS\b/g, 'SA GINOO NGA DIOS');

  // "kang Jehova nga Dios" / "kang Ginoo nga Dios" -> "sa Ginoo nga Dios"
  s = s.replace(/\b[Kk]ang\s+Jehovah?\s+nga\s+Dios\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo nga Dios' : 'sa Ginoo nga Dios'));
  s = s.replace(/\b[Kk]ang\s+Ginoo\s+nga\s+Dios\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo nga Dios' : 'sa Ginoo nga Dios'));
  s = s.replace(/\bKANG\s+JEHOVAH?\s+NGA\s+DIOS\b/g, 'SA GINOO NGA DIOS');
  s = s.replace(/\bKANG\s+GINOO\s+NGA\s+DIOS\b/g, 'SA GINOO NGA DIOS');

  // 2. Prepositional & Case markers before Jehova / Ginoo:
  // "si Jehova" / "si Ginoo" -> "ang Ginoo"
  s = s.replace(/\b[Ss]i\s+Jehovah?\b/g, (m) => (m[0] === 'S' ? 'Ang Ginoo' : 'ang Ginoo'));
  s = s.replace(/\b[Ss]i\s+Ginoo\b/g, (m) => (m[0] === 'S' ? 'Ang Ginoo' : 'ang Ginoo'));
  s = s.replace(/\bSI\s+JEHOVAH?\b/g, 'ANG GINOO');
  s = s.replace(/\bSI\s+GINOO\b/g, 'ANG GINOO');

  // "ni Jehova" / "ni Ginoo" -> "sa Ginoo"
  s = s.replace(/\b[Nn]i\s+Jehovah?\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\b[Nn]i\s+Ginoo\b/g, (m) => (m[0] === 'N' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\bNI\s+JEHOVAH?\b/g, 'SA GINOO');
  s = s.replace(/\bNI\s+GINOO\b/g, 'SA GINOO');

  // "kang Jehova" / "kang Ginoo" -> "sa Ginoo"
  s = s.replace(/\b[Kk]ang\s+Jehovah?\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\b[Kk]ang\s+Ginoo\b/g, (m) => (m[0] === 'K' ? 'Sa Ginoo' : 'sa Ginoo'));
  s = s.replace(/\bKANG\s+JEHOVAH?\b/g, 'SA GINOO');
  s = s.replace(/\bKANG\s+GINOO\b/g, 'SA GINOO');

  // 3. Compound memorial names
  s = s.replace(/\bJehovah?[–—-]jireh\b/gi, 'Ginoo-jireh');
  s = s.replace(/\bJehovah?[–—-]nissi\b/gi, 'Ginoo-nissi');
  s = s.replace(/\bJehovah?[–—-]salom\b/gi, 'Ginoo-salom');
  s = s.replace(/\bJehovah?[–—-]shalom\b/gi, 'Ginoo-shalom');

  // 4. Standalone name replacements
  s = s.replace(/\bJEHOVAH?\b/g, 'GINOO');
  s = s.replace(/\bJehovah?\b/g, 'Ginoo');

  // 5. Adonai YHWH duplicates: "Ginoong Ginoo" -> "Ginoong Dios"
  s = s.replace(/\b([Aa]ng|[Ss]a|[Oo]h|[Oo])\s+[Gg]inoong\s+[Gg]inoo\b/g, (m, p1) => `${p1} Ginoong Dios`);
  s = s.replace(/\b[Gg]inoong\s+[Gg]inoo\b/g, (m) => (m[0] === 'G' ? 'Ginoong Dios' : 'ginoong Dios'));

  return s;
}

/**
 * Transforms Tagalog (Ang Dating Biblia 1905) text based on the divine name toggle.
 * When ON: displays original "Jehova", "si Jehova", "ni Jehova", "kay Jehova", "Jehova-jireh", etc.
 * When OFF: replaces with "Panginoon" with correct Tagalog grammatical markers and appositions:
 *   "si Jehova" -> "ang Panginoon" (e.g. "Ako'y si Jehova" -> "Ako'y ang Panginoon")
 *   "ni Jehova" -> "ng Panginoon" (e.g. "pinabayaan ako ni Jehova" -> "pinabayaan ako ng Panginoon")
 *   "kay Jehova" -> "sa Panginoon" (e.g. "kay Jehova na Panginoon" -> "sa Panginoong Dios")
 *   "ang Panginoon si Jehova" -> "ang Panginoong Dios"
 *   "Panginoong Jehova" -> "Panginoong Dios"
 *   "Panginoon na Jehova" -> "Panginoong Dios"
 *   "Si Jehova, na Panginoon" -> "Ang Panginoong Dios"
 */
export function transformTagalogDivineName(text: string, useOriginalDivineName: boolean = false): string {
  if (!text) return text;

  if (useOriginalDivineName) {
    // When ON: retain and display the authentic 1905 Tagalog words
    return text;
  }

  let s = text;

  // 1. Compounds & Appositives (prevent awkward "Panginoon na Panginoon" or "Panginoon si Panginoon")
  s = s.replace(/\bang\s+Panginoon\s+si\s+Jehova\b/gi, 'ang Panginoong Dios');
  s = s.replace(/\bPanginoong\s+Jehova\b/gi, 'Panginoong Dios');
  s = s.replace(/\bPanginoon\s+na\s+Jehova\b/gi, 'Panginoong Dios');
  s = s.replace(/\b[Ss]i\s+Jehova,\s+na\s+Panginoon\b/g, (m) => (m[0] === 'S' ? 'Ang Panginoong Dios' : 'ang Panginoong Dios'));
  s = s.replace(/\b[Kk]ay\s+Jehova\s+na\s+Panginoon\b/g, (m) => (m[0] === 'K' ? 'Sa Panginoong Dios' : 'sa Panginoong Dios'));

  // 2. Memorial altar & place names
  s = s.replace(/\bJehova[–—-]jireh\b/gi, 'Panginoon-jireh');
  s = s.replace(/\bJehova[–—-]salom\b/gi, 'Panginoon-salom');
  s = s.replace(/\bJehova[–—-]shalom\b/gi, 'Panginoon-shalom');
  s = s.replace(/\bJehovanissi\b/gi, 'Panginoon-nissi');
  s = s.replace(/\bJehova[–—-]nissi\b/gi, 'Panginoon-nissi');

  // 3. Personal article adjustments:
  // "si Jehova" -> "ang Panginoon" (e.g. "Ako'y si Jehova" -> "Ako'y ang Panginoon")
  s = s.replace(/\b[Ss]i\s+Jehova\b/g, (m) => (m[0] === 'S' ? 'Ang Panginoon' : 'ang Panginoon'));
  s = s.replace(/\bSI\s+JEHOVA\b/g, 'ANG PANGINOON');

  // "ni Jehova" -> "ng Panginoon" (e.g. "Pinabayaan ako ni Jehova" -> "Pinabayaan ako ng Panginoon")
  s = s.replace(/\b[Nn]i\s+Jehova\b/g, (m) => (m[0] === 'N' ? 'Ng Panginoon' : 'ng Panginoon'));
  s = s.replace(/\bNI\s+JEHOVA\b/g, 'NG PANGINOON');

  // "kay Jehova" -> "sa Panginoon" (e.g. "kay Jehova" -> "sa Panginoon")
  s = s.replace(/\b[Kk]ay\s+Jehova\b/g, (m) => (m[0] === 'K' ? 'Sa Panginoon' : 'sa Panginoon'));
  s = s.replace(/\bKAY\s+JEHOVA\b/g, 'SA PANGINOON');

  // 4. Standalone occurrences
  s = s.replace(/\bJEHOVA\b/g, 'PANGINOON');
  s = s.replace(/\bJehova\b/g, 'Panginoon');

  return s;
}

/**
 * Master verse formatter applying the divine name setting across all translations.
 */
export function formatVerseText(
  text: string | undefined,
  language: 'cebuano' | 'english' | 'tagalog',
  useOriginalDivineName: boolean = false
): string {
  if (!text) return '';

  if (language === 'cebuano') {
    return transformCebuanoDivineName(text, useOriginalDivineName);
  }
  if (language === 'english') {
    return transformEnglishDivineName(text, useOriginalDivineName);
  }
  if (language === 'tagalog') {
    return transformTagalogDivineName(text, useOriginalDivineName);
  }

  return text;
}

