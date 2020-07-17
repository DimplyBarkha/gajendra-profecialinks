/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text += `${item.text.replace('US40_.jpg', '')}`;
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace('sur', '').trim().replace(',', '.');
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text < 2) {
            variantCount.text = 1;
          }
        });
      }
      if (row.price) {
        row.price.forEach(price => {
          price.text = price.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityText => {
          availabilityText.text = availabilityText.text.trim();
        });
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          item.text = `${item.text.replace(/([\<img].*[\"\>])/g, ' ').trim()}  `;
          text += `${item.text.replace(/\n \n/g, ' ').trim()}  `;
        });
        row.manufacturerDescription = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(manufacturerImages => {
          if (manufacturerImages.text.includes('grey-pixel.gif')) {
            manufacturerImages.text = '';
          } else {
            manufacturerImages.text = manufacturerImages.text.replace('._AC_US40_', '');
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(alternateImages => {
          alternateImages.text = alternateImages.text.replace('._AC_US40_', '');
        });
      }
      if (row.brandText) {
        row.brandText.forEach(brandText => {
          brandText.text = brandText.text.replace('Marque :', '').trim();
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
