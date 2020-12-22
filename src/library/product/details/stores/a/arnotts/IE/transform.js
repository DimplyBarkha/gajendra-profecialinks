/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
        row.alternateImages.forEach(alternateImages => {
          alternateImages.text = alternateImages.text.replace('prodgrid_recommend', 'detail_zoom').trim();
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(nameExtended => {
          if (row.brandText && row.color) {
            nameExtended.text = row.brandText[0].text + ' - ' + nameExtended.text + ' - ' + row.color[0].text;
          }
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(weightNet => {
          weightNet.text = weightNet.text.replace('Weight', '').replace(': ', '').trim();
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(manufacturerDescription => {
          manufacturerDescription.text = cleanUp(manufacturerDescription.text.replace(/\n/g, '').trim());
        });
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
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text == '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(variantInformation => {
          variantInformation.text = variantInformation.text.replace('You have selected:', '').trim();
        });
      }
      if (row.quantity) {
        let text = '';
        row.quantity.forEach(item => {
          text += `${item.text} | `;
        });
        row.quantity = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.featureBullets) {
        let text = '';
        row.featureBullets.forEach(item => {
          text += `${item.text} || `;
        });
        row.featureBullets = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text.replace('=', '')} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantId) {
        row.variantId.forEach(variantId => {
          if (variantId.text.includes('pid=')) {
            variantId.text = variantId.text.split('pid=')[1];
            if (variantId.text.includes('&dwvar')) {
              variantId.text = variantId.text.split('&dwvar')[0];
            }
          }
        });
      }
      if (!row.inTheBoxText && row.inTheBoxTextFallBack) {
        row.inTheBoxText = row.inTheBoxTextFallBack;
      }
      if (row.inTheBoxUrlSecond) {
        row.inTheBoxUrlSecond.forEach(img => {
          img.text = img.src;
        });
        if (row.inTheBoxUrl) {
          row.inTheBoxUrl = row.inTheBoxUrl.concat(row.inTheBoxUrlSecond);
        } else {
          row.inTheBoxUrl = row.inTheBoxUrlSecond;
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = cleanUp(el.text);
  }))));
  return data;
};

module.exports = { transform };
