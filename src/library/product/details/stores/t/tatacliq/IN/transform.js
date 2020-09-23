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
          ship = item.text.replace(/\n/g, ':');
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

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
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

      if (row.weightNet && row.weightNetUnits) {
        row.weightNet = [{
          text: `${row.weightNet[0].text} ${row.weightNetUnits[0].text}`,
        }];
      }

      if (row.specifications2) {
        let text = '';
        row.specifications2.forEach(item => {
          text += `${item.text} || `;
        });
        row.specifications2 = [
          {
            text: text,
          },
        ];
      }

      if (row.specifications) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += `${row.specificationsLabel[i].text} : ${row.specifications[i].text} || `;
        }
        row.specifications = [{
          text: text.slice(0, -4),
        }];
      } else if (row.specifications2) {
        row.specifications = [{
          text: row.specifications2[0].text.slice(0, -4),
        }];
        delete row.specifications2;
      }

      if (row.specifications && row.specifications2) {
        row.specifications = [{
          text: `${row.specifications2[0].text}${row.specifications[0].text}`,
        }];
      }

      if (!row.mpc && row.mpc2) {
        row.mpc = [{
          text: row.mpc2[0].text,
        }];
      }

      if (!row.countryOfOrigin && row.countryOfOrigin2) {
        row.countryOfOrigin = [{
          text: row.countryOfOrigin2[0].text,
        }];
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (!item.text.includes('http')) {
            item.text = `https:${item.text}`;
          }
        });
      }

      if (row.promotion) {
        row.promotion = [{
          text: `${row.promotion[0].text}% off`,
        }];
      } else if (row.promotionAddText) {
        row.promotion = [{
          text: `${row.promotionAddText[0].text}`,
        }];
        delete row.promotionAddText;
      }

      if (row.promotionAddText && row.promotion) {
        row.promotion = [{
          text: `${row.promotion[0].text} ${row.promotionAddText[0].text}`,
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
