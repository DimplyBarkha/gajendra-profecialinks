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
        row.alternateImages.forEach(alternateImages => {
          alternateImages.text = alternateImages.text.replace('/75/', '/Lightbox/');
        });
      }
      if (row.warranty) {
        let text = '';
        row.warranty.forEach(warranty => {
          text = warranty.text;
        });
        row.warranty = [{
          text: cleanUp(text),
        }];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(manufacturerDescription => {
          text = manufacturerDescription.text.replace(/\n/g, '');
        });
        row.manufacturerDescription = [{
          text: cleanUp(text),
        }];
      }
      if (row.manufacturer) {
        row.manufacturer.shift();
        row.manufacturer.forEach(manufacturer => {
          manufacturer.text = manufacturer.text.replace(": '", '');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace('.', ',');
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(shippingInfo => {
          shippingInfo.text = cleanUp(shippingInfo.text);
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text === '1') {
            variantCount.text = '0';
          }
        });
      }
      if (row.variantAsins) {
        if (!(row.variantAsins.length > 1)) {
          row.firstVariant.shift();
        }
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text.replace('/', '')} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.variants) {
        if (row.variants.length == 1) {
          row.variants.shift();
        } else {
          let text = '';
          row.variants.forEach(item => {
            text += `${item.text.replace('/', '')} | `;
          });
          row.variants = [
            {
              text: cleanUp(text.slice(0, -3)),
            },
          ];
        }
      }
      if (row.variantUrl) {
        row.variantUrl.forEach(variantUrl => {
          if (!(variantUrl.text.includes('https'))) {
            variantUrl.text = `https://www.eprice.it${variantUrl.text}`;
          }
        });
      }
      if (row.variantId) {
        row.variantId.forEach(variantId => {
          variantId.text = variantId.text.replace('/', '');
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
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text += `Colore: ${item.text.replace('Colore', '')} | `;
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
