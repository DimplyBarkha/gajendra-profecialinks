/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');

  const regexp = '(?:([\\d\\.]+)\\s?(\\w+))';
  function getSplitValue (inputStr, count) {
    if (inputStr) {
      const result = inputStr.match(regexp);
      return result[count];
    }
  }
  for (const { group } of data) {
    for (const row of group) {
      try {
        for (const i in row) { console.log(i + ' are rows'); }
        const variantIdsJSON = row.variantId[0].text.match(/(SizeVarId":")(.){11}/g);
        const variantIdsString = JSON.stringify(variantIdsJSON);
        const variantIdsArr = variantIdsString.split('SizeVarId');
        const variantValues = [];
        row.variantId = [];
        for (const i in variantIdsArr) {
          if (variantIdsArr[i].substring(5, 16).length != 0) {
            const tempObj = { text: variantIdsArr[i].substring(5, 16) };
            row.variantId.push(tempObj);
          }
        }
        let bulletCount = 0;
        for (const i in row.description) {
          if (row.description[i].text.includes('>')) { bulletCount++; }
        }
        console.log(bulletCount + ' number of bullets ');
        row.sku[0].text = row.sku[0].text.replace(/(.+)(sku": ")(.+)(", "gtin)(.+)/g, '$3');

        row.gtin[0].text = row.gtin[0].text.replace(/(.+)(gtin13": ")(.+)(", "url)(.+)(image":)(.+)/g, '$3');
        row.availabilityText[0].text = row.availabilityText[0].text.replace(/(.+)(availability": ")(.+)(, "seller")(.+)/g, '$3');
        if (row.availabilityText[0].text.includes('InStock')) row.availabilityText[0].text = 'In Stock';
        else row.availabilityText[0].text = 'Out Of Stock';
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
