/* eslint-disable camelcase */
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };

  for (const { group } of data) {
    for (const row of group) {
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.substring(item.text.indexOf('(') + 1, item.text.indexOf(')'));
        });
      }
      if (row.productOtherInformation) {
        const info = [];
        row.productOtherInformation.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.productOtherInformation = [{ text: info.join(' | '), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.variants) {
        const product_ids = [];
        row.variants.forEach(item => {
          item.text = item.text.substr(item.text.lastIndexOf('/'));
          item.text = item.text.substr(0, item.text.indexOf('.html'));
          var path_arr = item.text.split('-');
          path_arr = path_arr.reverse();
          item.text = path_arr[1] + '-' + path_arr[0];
          product_ids.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.variants = [{ text: product_ids.join(' | '), xpath: row.variants[0].xpath }];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = 'In Stock';
        });
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
