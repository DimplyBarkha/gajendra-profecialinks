/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += text ? ` || ${item.text}` : item.text;
        });
        row.promotion = [
          {
            text: text,
          },
        ];
      }

      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = Math.round(Number(item.text) * 10 / 2) / 10;
        });
        row.aggregateRating = [
          {
            text: text,
          },
        ];
      }
      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach(item => {
          let val = item.text.match('http');
          if (!val) {
            val = item.text.match('200w');
            if (val) {
              text = item.text.replace(/^(.+)\s200w/g, 'https:$1');
            } else {
              text = item.text.replace(/(.+)/g, 'https:$1');
            }
            const arr = text.split(',');
            text = arr[0];
            item.text = text;
          }
        });
      }

      if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
        const images = Array.from(new Set(row.inTheBoxUrl.map(elm => elm.text.trim())));
        row.inTheBoxUrl = images.map(text => ({ text }));
      }

      if (row.inTheBoxText && row.inTheBoxText[0]) {
        row.inTheBoxText.forEach(item => { item = item.text.replace('-', ''); });
      }
      if (row.coupon) {
        let text = '';
        row.coupon.forEach(item => {
          text += text ? ` || ${item.text}` : item.text;
        });
        row.coupon = [{ text }];
      }

      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '-1') item.text = '0';
        });
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullets.join(' || ') }];
      }
      // if (row.category && row.category.length) {
      //   row.category = row.category.slice(1);
      //   row.category.pop();
      // }
      /* if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = item.text.replace(/Prev|Next|Show More|Show Less/g, '').trim();
        });
        row.manufacturerDescription = [{ text }];
      } */
      if (row.manufacturerDescription && row.manufacturerDescription[0]) {
        const regexIgnoreText = /(Prev|Next|Show More|Show Less)/g;
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        text = text.replace(/<(style|script|noscript)\b[^<]*(?:(?!<\/(style|script|noscript)>)<[^<]*)*<\/(style|script|noscript)>/g, '').replace(/(<([^>]+)>)/ig, '').replace(regexIgnoreText, '').trim();
        row.manufacturerDescription = [{ text: decode(text) }];
      }
      if (row.manufacturerImages) {
        const images = Array.from(new Set(row.manufacturerImages.map(elm => elm.text.trim())));
        row.manufacturerImages = images.map(text => ({ text }));
      }

      // if (row.alternateImages && row.alternateImages.length) {
      //   row.alternateImages = row.alternateImages.slice(1);
      // }
    }
  }
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    // .replace(/"\s{1,}/g, '"')
    // .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
