
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.nameExtended && row.variantInfo) {
        row.nameExtended = [{ text: `${row.nameExtended[0].text} - ${row.variantInfo[0].text}` }];
      }

      if (row.price) {
        row.price[0].text = row.price[0].text.replace('.', ',');
      }

      if (row.manufacturer) {
        const manufacturer = row.manufacturer[0].text;
        row.manufacturer[0].text = manufacturer.replace('Name:', '');
      }

      if (row.availabilityText) {
        const availabilityText = row.availabilityText[0].text;
        if (availabilityText.includes('InStock')) {
          row.availabilityText[0].text = 'In stock';
        } else {
          row.availabilityText[0].text = 'Out of stock';
        }
      }

      if (row.quantity) {
        const quantity = row.quantity[0].text;
        row.quantity[0].text = quantity.replace(',', '.');
      }

      if (row.warnings) {
        if (row.warnings.length > 1) {
          let warningStr = '';
          for (let i = 0; i < row.warnings.length; i++) {
            warningStr += `${row.warnings[i].text} `;
          }
          row.warnings = [{ text: warningStr }];
        }
      }

      // if (row.additionalDescBulletInfo) {
      //   row.additionalDescBulletInfo[0].text = `|| ${row.additionalDescBulletInfo[0].text}`;
      // }
    }
  }

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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
