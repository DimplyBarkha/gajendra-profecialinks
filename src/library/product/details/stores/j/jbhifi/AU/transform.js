
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.shippingDimensions = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.specifications = [{ text }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.description = [{ text }];
      }

      if ((!row.listPrice || !row.listPrice.length) && row.price) {
        row.listPrice = row.price;
      }

    }
  }

  // Clean up data
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

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
