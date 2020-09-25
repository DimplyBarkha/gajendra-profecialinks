/**
 *@param {ImportIO.Group[]} data
 *@returns {ImportIO.Group[]}
 *  */

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
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/[\r\n]+/g, ':').replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.weightGross) {
        let text = '';
        row.weightGross.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.weightGross = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.weightNet = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.shippingDimensions) {
        let text = '';
        let count = 0;
        row.shippingDimensions.forEach(item => {
          if (count % 2 === 0) {
            text += `${item.text.replace(/\n \n/g, '')} : `;
          } else {
            text += `${item.text.replace(/\n \n/g, '')} || `;
          }
          count++;
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.alternateImages) {
        const newAlternateImages = row.alternateImages.map(item => {
          if (item.text.includes('75.jpg')) {
            return {
              text: `${item.text.replace('/75/', '/640/').replace('75.jpg', '640.jpg')}`,
            };
          } else {
            return {
              text: `${item.text}`,
            };
          }
        });
        row.alternateImages = newAlternateImages;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};
module.exports = { transform };
