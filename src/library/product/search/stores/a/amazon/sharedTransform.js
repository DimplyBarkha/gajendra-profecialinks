/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const decode = (string) => {
    function decodeEntities (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    }
    const entityMap = {
      "'": '&apos;',
      '<': '&lt;',
      '>': '&gt;',
      ' ': '&nbsp;',
      '¡': '&iexcl;',
      '¢': '&cent;',
      '£': '&pound;',
      '¤': '&curren;',
      '¥': '&yen;',
      '¦': '&brvbar;',
      '§': '&sect;',
      '¨': '&uml;',
      '©': '&copy;',
      ª: '&ordf;',
      '«': '&laquo;',
      '¬': '&not;',
      '®': '&reg;',
      '¯': '&macr;',
      '°': '&deg;',
      '±': '&plusmn;',
      '²': '&sup2;',
      '³': '&sup3;',
      '´': '&acute;',
      µ: '&micro;',
      '¶': '&para;',
      '·': '&middot;',
      '¸': '&cedil;',
      '¹': '&sup1;',
      º: '&ordm;',
      '»': '&raquo;',
      '¼': '&frac14;',
      '½': '&frac12;',
      '¾': '&frac34;',
      '¿': '&iquest;',
      À: '&Agrave;',
      Á: '&Aacute;',
      Â: '&Acirc;',
      Ã: '&Atilde;',
      Ä: '&Auml;',
      Å: '&Aring;',
      Æ: '&AElig;',
      Ç: '&Ccedil;',
      È: '&Egrave;',
      É: '&Eacute;',
      Ê: '&Ecirc;',
      Ë: '&Euml;',
      Ì: '&Igrave;',
      Í: '&Iacute;',
      Î: '&Icirc;',
      Ï: '&Iuml;',
      Ð: '&ETH;',
      Ñ: '&Ntilde;',
      Ò: '&Ograve;',
      Ó: '&Oacute;',
      Ô: '&Ocirc;',
      Õ: '&Otilde;',
      Ö: '&Ouml;',
      '×': '&times;',
      Ø: '&Oslash;',
      Ù: '&Ugrave;',
      Ú: '&Uacute;',
      Û: '&Ucirc;',
      Ü: '&Uuml;',
      Ý: '&Yacute;',
      Þ: '&THORN;',
      ß: '&szlig;',
      à: '&agrave;',
      á: '&aacute;',
      â: '&acirc;',
      ã: '&atilde;',
      ä: '&auml;',
      å: '&aring;',
      æ: '&aelig;',
      ç: '&ccedil;',
      è: '&egrave;',
      é: '&eacute;',
      ê: '&ecirc;',
      ë: '&euml;',
      ì: '&igrave;',
      í: '&iacute;',
      î: '&icirc;',
      ï: '&iuml;',
      ð: '&eth;',
      ñ: '&ntilde;',
      ò: '&ograve;',
      ó: '&oacute;',
      ô: '&ocirc;',
      õ: '&otilde;',
      ö: '&ouml;',
      '÷': '&divide;',
      ø: '&oslash;',
      ù: '&ugrave;',
      ú: '&uacute;',
      û: '&ucirc;',
      ü: '&uuml;',
      ý: '&yacute;',
      þ: '&thorn;',
      ÿ: '&yuml;',
      Œ: '&OElig;',
      œ: '&oelig;',
      Š: '&Scaron;',
      š: '&scaron;',
      Ÿ: '&Yuml;',
      ƒ: '&fnof;',
      ˆ: '&circ;',
      '˜': '&tilde;',
      Α: '&Alpha;',
      Β: '&Beta;',
      Γ: '&Gamma;',
      Δ: '&Delta;',
      Ε: '&Epsilon;',
      Ζ: '&Zeta;',
      Η: '&Eta;',
      Θ: '&Theta;',
      Ι: '&Iota;',
      Κ: '&Kappa;',
      Λ: '&Lambda;',
      Μ: '&Mu;',
      Ν: '&Nu;',
      Ξ: '&Xi;',
      Ο: '&Omicron;',
      Π: '&Pi;',
      Ρ: '&Rho;',
      Σ: '&Sigma;',
      Τ: '&Tau;',
      Υ: '&Upsilon;',
      Φ: '&Phi;',
      Χ: '&Chi;',
      Ψ: '&Psi;',
      Ω: '&Omega;',
      α: '&alpha;',
      β: '&beta;',
      γ: '&gamma;',
      δ: '&delta;',
      ε: '&epsilon;',
      ζ: '&zeta;',
      η: '&eta;',
      θ: '&theta;',
      ι: '&iota;',
      κ: '&kappa;',
      λ: '&lambda;',
      μ: '&mu;',
      ν: '&nu;',
      ξ: '&xi;',
      ο: '&omicron;',
      π: '&pi;',
      ρ: '&rho;',
      ς: '&sigmaf;',
      σ: '&sigma;',
      τ: '&tau;',
      υ: '&upsilon;',
      φ: '&phi;',
      χ: '&chi;',
      ψ: '&psi;',
      ω: '&omega;',
      ϑ: '&thetasym;',
      ϒ: '&Upsih;',
      ϖ: '&piv;',
      '–': '&ndash;',
      '—': '&mdash;',
      '‘': '&lsquo;',
      '’': '&rsquo;',
      '‚': '&sbquo;',
      '“': '&ldquo;',
      '”': '&rdquo;',
      '„': '&bdquo;',
      '†': '&dagger;',
      '‡': '&Dagger;',
      '•': '&bull;',
      '…': '&hellip;',
      '‰': '&permil;',
      '′': '&prime;',
      '″': '&Prime;',
      '‹': '&lsaquo;',
      '›': '&rsaquo;',
      '‾': '&oline;',
      '⁄': '&frasl;',
      '€': '&euro;',
      ℑ: '&image;',
      ℜ: '&real;',
      '™': '&trade;',
      ℵ: '&alefsym;',
      '←': '&larr;',
      '↑': '&uarr;',
      '→': '&rarr;',
      '↓': '&darr;',
      '↔': '&harr;',
      '↵': '&crarr;',
      '⇐': '&lArr;',
      '⇑': '&UArr;',
      '⇒': '&rArr;',
      '⇓': '&dArr;',
      '⇔': '&hArr;',
      '∀': '&forall;',
      '∂': '&part;',
      '∃': '&exist;',
      '∅': '&empty;',
      '∇': '&nabla;',
      '∈': '&isin;',
      '∉': '&notin;',
      '∋': '&ni;',
      '∏': '&prod;',
      '∑': '&sum;',
      '−': '&minus;',
      '∗': '&lowast;',
      '√': '&radic;',
      '∝': '&prop;',
      '∞': '&infin;',
      '∠': '&ang;',
      '∧': '&and;',
      '∨': '&or;',
      '∩': '&cap;',
      '∪': '&cup;',
      '∫': '&int;',
      '∴': '&there4;',
      '∼': '&sim;',
      '≅': '&cong;',
      '≈': '&asymp;',
      '≠': '&ne;',
      '≡': '&equiv;',
      '≤': '&le;',
      '≥': '&ge;',
      '⊂': '&sub;',
      '⊃': '&sup;',
      '⊄': '&nsub;',
      '⊆': '&sube;',
      '⊇': '&supe;',
      '⊕': '&oplus;',
      '⊗': '&otimes;',
      '⊥': '&perp;',
      '⋅': '&sdot;',
      '⌈': '&lceil;',
      '⌉': '&rceil;',
      '⌊': '&lfloor;',
      '⌋': '&rfloor;',
      '⟨': '&lang;',
      '⟩': '&rang;',
      '◊': '&loz;',
      '♠': '&spades;',
      '♣': '&clubs;',
      '♥': '&hearts;',
      '♦': '&diams;',
    };
    for (var key in entityMap) {
      var entity = entityMap[key];
      var regex = new RegExp(entity, 'g');
      string = string.replace(regex, key);
    }
    string = string.replace(/&quot;/g, '"');
    string = string.replace(/&amp;/g, '&');
    return decodeEntities(string);
  };
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  let sponsRankCounter = state.sponsRankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      } else {
        sponsRankCounter = sponsRankCounter + 1;
        row.rankSponsored = [{ text: sponsRankCounter }];
      }
      row.rank = [{ text: rankCounter }];

      /* not using the function.
      const filterStringToAfterSecondIndex = (string, text) => {
        const wordSize = text.length;
        let count = 0;
        let secondIdx = null;
        for (let i = 0; i < string.length; i++) {
          if (string.slice(i, wordSize + i) === text) {
            count++;
            if (count === 2) secondIdx = i;
          }
        }
        return string.slice(secondIdx);
      }; */

      if (row.productUrl && row.productUrl[0].text) {
        const domain = row.domain[0].text;
        const url = row.productUrl[0].text;
        const splitData = url.split(domain).map(elm => elm.split('amazon-adsystem.com')).flat();
        if (splitData.length > 2) {
          row.productUrl = [{ text: 'https://www.' + domain + splitData[2] }];
        }
      }

      if (row.sponsName && !row.name) {
        row.name = [{ text: row.sponsName[0].text }];
        delete row.sponsName;
      }
      if (row.sponsThumbnail && !row.name) {
        row.thumbnail = [{ text: row.sponsThumbnail[0].text }];
        delete row.sponsThumbnail;
      }

      if (row.sponsRatingCount && !row.ratingCount) {
        let replace = ['.', '.'];
        if (row.sponsorReplace) {
          replace = row.sponsorReplace[0].text.split('|');
        }
        row.ratingCount = [{ text: row.sponsRatingCount[0].text.replace(replace[0], replace[1]) }];
        row.reviewCount = [{ text: row.sponsRatingCount[0].text.replace(replace[0], replace[1]) }];
        delete row.sponsRatingCount;
      }

      if (row.sponsAgRating && !row.aggregateRating2) {
        let replace = ['.', '.'];
        if (row.sponsorReplace) {
          replace = row.sponsorReplace[0].text.split('|');
        }
        row.aggregateRating2 = [{ text: row.sponsAgRating[0].text.replace(replace[0], replace[1]) }];
        delete row.sponsAgRating;
      }
      delete row.sponsorReplace;
      if (row.sponsThumbnail && !row.thumbnail) {
        row.thumbnail = [{ text: row.sponsThumbnail[0].text }];
      }

      const subscribe = Boolean(row.sub_and_save);
      row.subscribe = [{
        text: subscribe.toString(),
        type: 'BOOLEAN',
        value: subscribe,
      }];
      if (row.badgeType) {
        let pantry = false;
        let prime = false;
        row.badgeType.forEach(badge => {
          if (badge.text.includes('rime')) {
            prime = true;
          }
          if (badge.text.includes('antry')) {
            pantry = true;
          }
        });
        row.pantry = [{
          text: pantry.toString(),
          type: 'BOOLEAN',
          value: pantry,
        }];
        row.prime = [{
          text: prime.toString(),
          type: 'BOOLEAN',
          value: prime,
        }];
      } else {
        row.pantry = [{
          text: 'false',
          type: 'BOOLEAN',
          value: false,
        }];
        row.prime = [{
          text: 'false',
          type: 'BOOLEAN',
          value: false,
        }];
      }
      if (row.moreBuyingOptionsPrice && !row.price) {
        row.price = [{ text: row.moreBuyingOptionsPrice[0].text }];
      }
      if (row.price) {
        if (row.price.length > 1) {
          row.minPrice = [{
            text: row.price[0],
          }];
          row.maxPrice = [{
            text: row.price[1],
          }];
        }
      }
      if (row.listPrice) {
        if (row.listPrice.length > 1) {
          row.minListPrice = [{
            text: row.listPrice[0],
          }];
          row.maxListPrice = [{
            text: row.listPrice[1],
          }];
        }
      }
      if (row.name) {
        const text = row.name[0].text;
        row.name[0].text = decode(text).replace(/(<([^>]+)>)/ig, '');
      }
      delete row.sponsorReplace;
      delete row.domain;
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ sponsRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
