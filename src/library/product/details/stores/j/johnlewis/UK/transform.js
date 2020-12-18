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
        row.alternateImages.shift();
      }
      if (row.category) {
        if (row.category[0].text.includes('Homepage')) {
          row.category.shift();
        }
      }
      if (row.specifications) {
        row.specifications.forEach(specifications => {
          specifications.text = specifications.text.replace(/ \n \n/g, ':').replace(/\n \n/g, ' || ').replace(/\n/g, '').trim();
        });
      }
      if(row.inTheBoxText) {
        row.inTheBoxText.forEach(inTheBoxText => {
          // inTheBoxText.text = inTheBoxText.text.replace(/ \n \n/g, ',').replace(/ \n \n/g, ' || ').replace(/\n/g, '').trim();
          inTheBoxText.text = inTheBoxText.text.replace(/[\,]/g, ' || ');
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text == '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.color) {
        let text = '';
        row.color.forEach(color => {
          text += `${color.text} | `;
        });
        row.color = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.quantity) {
        row.quantity.forEach(quantity => {
          quantity.text = quantity.text.replace(' \n \n', '|').replace(/This size is \w+/g, '').trim();
        });
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          if (item.text.includes('size')) {
            text += `Size: ${item.text.replace('This is the current selected colour', '').trim()} | `;
          } else {
            text += `Color: ${item.text.replace('This is the current selected colour', '').trim()} | `;
          }
        });
        row.variantInformation = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variantId) {
        if (row.variantId.length > 1) {
          row.variantId.shift();
        }
      }
      if (row.variantUrl) {
        if (row.variantUrl.length > 1) {
          row.variantUrl.shift();
        } else {
          row.variantUrl.forEach(variantUrl => {
            variantUrl.text = variantUrl.text.replace('https://www.johnlewis.com', '');
          });
        }
      }
      if (row.variantAsins) {
        let text = '';
        if (row.variantAsins.length > 1) {
          row.firstVariant = row.variantId;
        }
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variants) {
        let text = '';
        if (row.variants.length > 1) {
          row.firstVariant = row.variantId;
        }
        row.variants.forEach(item => {
          text += `${item.text} | `;
        });
        row.variants = [
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
        if (row.additionalDescBulletInfo.length == 1) {
          if (row.additionalDescBulletInfo[0].text.includes('Click here')) {
            row.additionalDescBulletInfo[0].text = '';
          }
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
