/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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

  for (const { group } of data) {
    for (const row of group) {
      try {
        console.log('description!!!');
        console.log(row.description);
        if (row.description) {
          row.description.forEach(item => {
            if (item.text.match('\\n')) {
              item.text = item.text.replace(/\s\n/g, '||').trim();
            }
          });
        }
        console.log(row.description);
        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }

        if (row.quantity && row.quantity[0].text.length > 1) {
          const quantityText = row.quantity[0].text;
          let quantityRe = /(?:([\d\.]+\s{1})([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[pP]ops|qt|[wW]ipe[s]?).?)$|(?:\s{0}([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[pP]ops|qt|[wW]ipe[s]?).?\s?[\&\-\w\s]+)$/;
          let quantity = quantityRe.exec(quantityText);

          if (quantity == null) {
            const quantityReWithNoSpace = /(?:([\d\.]+\s*)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[pP]ops|qt|[wW]ipe[s]?).?)$|(?:\s{0}([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[pP]ops|qt|[wW]ipe[s]?).?\s?[\&\-\w\s]+)$/;
            quantity = quantityReWithNoSpace.exec(quantityText);
          }

          if (quantity && quantity[0] && quantity[0].length >= 22) {
            quantityRe = /(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[pP]ops|qt|[wW]ipe[s]?).?)$|(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[pP]ops|qt|[wW]ipe[s]?).?\s)/;
            quantity = quantityRe.exec(quantityText);
          }
          if (quantity[0]) {
            quantity[0] = quantity[0].replace(/[{()}]/g, '');
            row.quantity[0].text = quantity[0].trim();
          }
        }

        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
