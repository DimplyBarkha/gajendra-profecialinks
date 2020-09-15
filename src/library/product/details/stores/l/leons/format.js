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
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text.includes('Shipping after') ? 'In Stock.' : row.availabilityText[0].text;
      }
      if (row.notAvailable) {
        if (row.availabilityText) {
          row.availabilityText[0].text = row.notAvailable[0].text;
        } else {
          row.availabilityText = row.notAvailable;
        }
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/(.*)\n \nRead More/, '$1 | ').replace(/(.*):\n \n(.*)/g, '$1: || $2').replace(/\n \n/g, '\n').replace(/\n/g, ' || ');
        });
      }
      if (row.features) {
        row.features.forEach(item => {
          item.text = item.text.replace(/(.*)\n \nRead More/, '$1 | ').replace(/(.*):\n \n(.*)/g, '$1: || $2').replace(/\n \n/g, '\n').replace(/\n/g, ' || ');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = row.features ? (row.features[0].text + item.text).trim() : item.text.trim();
        });
      } else if (row.features) {
        row.description = row.features;
      }
      if (row.productDimensions) {
        if (row.productDimensions[0].text.includes('Package') || row.productDimensions[0].text.includes('Shipping')) {
          row.productDimensions.forEach(item => {
            item.text = item.text.replace(/([a-zA-z]+)(\d+.?\d*)\"/g, '$1: $2" | ').replace(/(.*) \|/, '$1').trim();
          });
          row.shippingDimensions = row.productDimensions;
        }
      }
      if (row.specifications) {
        const specText = row.specifications.reduce((specText = '', item) => {
          specText += item.text.includes('Dimensions') ? item.text.replace(/([a-zA-z]+)(\d+.?\d*)\"/g, '$1: $2" || ').replace(/(.*) \|/, '$1').trim() + ' || ' : item.text.replace(/\n/g, ' || ') + ' || ';
          return specText;
        }, '');

        row.specifications = [{ text: specText.replace(/( \|\| )$/, '') }];
      }
      if (row.weightNetDesck) {
        row.weightNet = row.weightNetDesck;
      }
      if (row.productOtherInformation) {
        row.productOtherInformation.forEach(item => {
          item.text = item.text.replace(/\n \n/g, '\n').replace(/\n/g, ' || ').trim();
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
