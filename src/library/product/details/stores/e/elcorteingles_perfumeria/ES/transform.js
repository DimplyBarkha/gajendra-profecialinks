
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
      if (row.allergyAdvice) {
        const text = row.allergyAdvice.map(elm => elm.text.trim()).join(',');
        row.allergyAdvice = [{ text }];
      }
      if (!row.variantId) {
        if (row.sku) {
          row.variantId = row.sku;
        }
      }
      if (!row.directions && row.directionsFromPTag) {
        let directionsInfo = row.directionsFromPTag[0].text;
        directionsInfo = directionsInfo.replace('Modo de empleo:', '');
        directionsInfo = directionsInfo.replace('Modo de uso:', '');
        row.directions = [{ text: directionsInfo.trim() }];
      }

      if (!row.quantity && row.quantityFromSingleVariant) {
        row.quantity = row.quantityFromSingleVariant;
      }

      if (!row.quantity && row.variantInformation && row.isSizeDropDownPresent) {
        row.quantity = row.variantInformation;
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
