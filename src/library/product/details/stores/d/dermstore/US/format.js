
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      if (row.listPrice) {
        row.listPrice[0].text += ' $';
      }
      if (row.description) {
        row.description.forEach(itemDescription => {
          itemDescription.text = itemDescription.text.replace('Brand details', '').replace(/\s+$/, '');
        });
      }
      if (row.price) {
        row.price.forEach(priceItem => {
          priceItem.text = priceItem.text.replace('$', '');
        });
      }
      if (row.nameExtended) {
        const brandText = row.brandText[0].text;
        row.nameExtended.forEach(nameExtendedItem => {
          nameExtendedItem.text = nameExtendedItem.text.includes(brandText) ? nameExtendedItem.text : brandText + ' ' + nameExtendedItem.text;
        });
      }
      if (row.quantity) {
        row.quantity.forEach(quantityItem => {
          quantityItem.text = quantityItem.text.replace('(', '').replace(')', '');
        });
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    if (typeof el.text !== 'undefined') {
      el.text = clean(el.text);
    }
  }))));
  return data;
};

module.exports = { transform };
