/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
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
  // for (const { group } of data) {
  //   for (const row of group) {
  //     if (row.totalFatPerServing) {
  //       const text = row.totalFatPerServing[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$1.$3');
  //       row.totalFatPerServing = [{ text }];
  //     }
  //     if (row.totalCarbPerServing) {
  //       const text = row.totalCarbPerServing[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$1.$3');
  //       row.totalCarbPerServing = [{ text }];
  //     }
  //     if (row.totalCarbPerServing) {
  //       const text = row.totalCarbPerServing[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$1.$3');
  //       row.totalCarbPerServing = [{ text }];
  //     }
  //     if (row.dietaryFibrePerServing) {
  //       const text = row.totalFatPerServing[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$1.$3');
  //       row.dietaryFibrePerServing = [{ text }];
  //     }
  //     if (row.totalSugarsPerServing) {
  //       const text = row.totalSugarsPerServing[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$1.$3');
  //       row.totalSugarsPerServing = [{ text }];
  //     }
  //     if (row.proteinPerServing) {
  //       const text = row.proteinPerServing[0].text.replace(/(<|)(\d+)([.,]|)(\d+|)(\w+|)/g, '$2.$4');
  //       row.proteinPerServing = [{ text }];
  //     }
  //     if (row.saltPerServing) {
  //       const text = row.saltPerServing[0].text.replace(/(<|)(\d+)([.,]|)(\d+|)(\w+|)/g, '$2.$4');
  //       row.saltPerServing = [{ text }];
  //     }
  //     if (row.saturatedFatPerServing) {
  //       const text = row.saturatedFatPerServing[0].text.replace(/(<|)(\d+)([.,]|)(\d+|)(\w+|)/g, '$2.$4');
  //       row.saturatedFatPerServing = [{ text }];
  //     }
  //     if (row.totalFatPerServingUom) {
  //       const text = row.totalFatPerServingUom[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$4');
  //       row.totalFatPerServingUom = [{ text }];
  //     }
  //     if (row.totalCarbPerServingUom) {
  //       const text = row.totalCarbPerServingUom[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$4');
  //       row.totalCarbPerServingUom = [{ text }];
  //     }
  //     if (row.dietaryFibrePerServingUom) {
  //       const text = row.dietaryFibrePerServingUom[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$4');
  //       row.totalFatPerServingUom = [{ text }];
  //     }
  //     if (row.totalFatPerServingUom) {
  //       const text = row.totalFatPerServingUom[0].text.replace(/(\d+)([.,])(\d+)(\w+|)/g, '$4');
  //       row.totalFatPerServingUom = [{ text }];
  //     }
  //   }
  // }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
