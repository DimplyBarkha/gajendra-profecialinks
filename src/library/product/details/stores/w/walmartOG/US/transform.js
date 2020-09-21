/* eslint-disable no-useless-escape */
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
        if (row.description) {
          row.description = [
            {
              text: row.description[0].text.trim(),
            },
          ];
        }

        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }

        if (row.ingredientsList) {
          row.ingredientsList.forEach(item => {
            if (item.text.match('&nbsp;')) {
              item.text = item.text.replace(/(&nbsp;)/g, ' ').trim();
            }
            if (item.text.match('<br>')) {
              item.text = item.text.replace(/(<br>)/g, ' ').trim();
            }
          });
        }

        if (row.image && row.image[0] && row.image[0].text.length > 1) {
          if (!row.image[0].text.includes('http')) {
            row.image[0].text = 'https:' + row.image[0].text;
          }
        }

        if (row.quantity && row.quantity[0] && row.quantity[0].text && row.quantity[0].text.length > 1) {
          let quantityText = row.quantity[0].text;
          const count = (quantityText.match(/[bB]ar[s]?/g) || []).length;
          if (count > 1) {
            quantityText = quantityText.replace(/[bB]ar?/, '');
          }
          let quantityRe = /(?:([\d\.]+\s{1})([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[gG]allon|[wW]ipe[s]?).?)$|(?:\s{0}([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|qt|[gG]allon|[wW]ipe[s]?).?\s?[\&\-\w\s]+)$/;
          let quantity = quantityRe.exec(quantityText);

          if (quantity == null) {
            const quantityReWithNoSpace = /(?:([\d\.]+\s*)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[gG]allon|[wW]ipe[s]?).?)$|(?:\s{0}([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|qt|[gG]allon|[wW]ipe[s]?).?\s?[\&\-\w\s]+)$/;
            quantity = quantityReWithNoSpace.exec(quantityText);
          }

          if (quantity && quantity[0] && quantity[0].length >= 22) {
            quantityRe = /(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[gG]allon|[wW]ipe[s]?).?)$|(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|qt|[gG]allon|[wW]ipe[s]?).?\s)/;
            quantity = quantityRe.exec(quantityText);
          }

          if (((quantityText.match(/[\,]/gi) || []).length > 1) && (quantityText.match(/[pP]ack/gi) || quantityText.match(/[cC]ount/gi))) {
            if (!((quantity !== null && quantity[0].includes(',')))) {
              quantityRe = /(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]\s?([bB]ottles)?[\,]?|[fF][lL][\.]?\s?[oO][zZ][\.]?\s?([cC]ans|[bB]ottles)[\,]?\s?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]ack|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[gG]allon|[wW]ipe[s]?).?)$|(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]\s?([bB]ottles)?[\,]?|[fF][lL][\.]?\s?[oO][zZ][\.]?\s?([cC]ans|[bB]ottles)[\,]|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ack|qt|[gG]allon|[wW]ipe[s]?).?\s)\d+ (pack|[cC]ount)/;
              quantity = quantityRe.exec(quantityText);
            }
          }

          if (quantity == null && row.quantity[0].text.includes('(Pack of')) {
            quantityRe = /(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|[pP]ods|qt|[gG]allon|[wW]ipe[s]?).?)$|(?:\s?([\d\.]+\s?)([bB]ar[s]?|[cC]ount|[cC]t|[lL]|[fF][lL][\.]?\s?[oO][zZ][\.]?|FO|[mM][lL]|[oO][zZ][\.]?|pc|[pP]int|[iI]ce|[pP]ops|qt|[gG]allon|[wW]ipe[s]?).?\s(\(Pack of \d+\)))/;
            quantity = quantityRe.exec(quantityText);
            row.quantity[0].text = quantity[0].trim();
          }

          const unecessaryStrings = /[Cc]anister|[\d\.]+\s[Cc]harcoal/;

          if (quantity && quantity[0] && unecessaryStrings.test(quantity[0])) {
            quantity[0] = quantity[0].replace(unecessaryStrings, '');
          }

          if (quantity && quantity[0] && !quantity[0].includes('(Pack of')) {
            quantity[0] = quantity[0].replace(/[{()}]/g, '');
            row.quantity[0].text = quantity[0].trim();
          }

          if (quantity == null) {
            row.quantity[0].text = '';
          }
        }

        if (row.servingSize && row.servingSize[0] && row.servingSize[0].text) {
          row.servingSize[0].text = row.servingSize[0].text.trim();
        }

        if (row.servingSizeUom && row.servingSizeUom[0] && row.servingSizeUom[0].text) {
          row.servingSizeUom[0].text = row.servingSizeUom[0].text.trim();
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
