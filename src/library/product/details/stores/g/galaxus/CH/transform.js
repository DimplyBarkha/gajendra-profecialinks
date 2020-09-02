/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
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
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text == '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text += `${item.text} | `;
        });
        row.shippingDimensions = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text} || `;
        });
        row.specifications = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantInformation = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
