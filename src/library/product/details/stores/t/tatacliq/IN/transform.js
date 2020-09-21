/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
        let ship = '';
        row.shippingDimensions.forEach(item => {
          ship = item.text.replace(/\n/g, ':')
          item.text = ship;
        });
      }

      if (row.image) {
        row.image = [{
          text: row.image[0].text.replace(/437Wx649H/g, '1348Wx2000H'),
        }];
      }

      if (row.alternateImages) {
        for (let i = 0; i < row.alternateImages.length; i++) {
          row.alternateImages[i].text = row.alternateImages[i].text.replace(/97Wx144H/g, '1348Wx2000H');
        }
      }

      if (row.descriptionBulletsInfo) {
        let text = '';
        row.descriptionBulletsInfo.forEach(item => {
          text += ` || ${item.text}`;
        });
        if (row.description) {
          row.description = [{
            text: `${row.description[0].text} ${text.trim()}`,
          }];
        } else {
          row.description = [{
            text: text.trim(),
          }];
        }
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text} `;
        });
        row.manufacturerDescription = [{
          text: text.trim(),
        }];
      }

      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text += `${item.text} x `;
        });
        text = text.slice(0, -3);
        if (row.shippingDimensionsUnits) {
          text = `${text} ${row.shippingDimensionsUnits[0].text}`;
        }
        row.shippingDimensions = [{
          text: text,
        }];
      }

      if (row.weightNet && row.weightNetUnits) {
        row.weightNet = [{
          text: `${row.weightNet[0].text} ${row.weightNetUnits[0].text}`,
        }];
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