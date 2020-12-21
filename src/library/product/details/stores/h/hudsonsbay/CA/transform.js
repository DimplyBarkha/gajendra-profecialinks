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
      if (row.nameExtended) {
        row.nameExtended.forEach(nameExtended => {
          if (row.brandText && row.color) {
            nameExtended.text = row.brandText[0].text + ' - ' + nameExtended.text + ' - ' + row.color[0].text.replace('Colour:', '').trim();
          }
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = item.text.replace(/\n/, '').replace(/\n \n/, '').replace(/\n/g, ' || ').trim();
        });
        row.description = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.variantId) {
        if (row.variantId.length > 1) {
          row.variantId.shift();
        }
      }
      if (row.variantUrl) {
        if (row.variantUrl.length > 1) {
          row.variantUrl.shift();
        }
      }
      if (row.category) {
        if (row.category[0].text.includes('Home')) {
          row.category.shift();
        }
      }
      if (row.quantity) {
        row.quantity.forEach(quantity => {
          quantity.text = quantity.text.replace('Product dimensions:', '').trim();
        });
      }
      if (row.color) {
        row.color.forEach(color => {
          color.text = color.text.replace('Colour:', '').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(specifications => {
          specifications.text = specifications.text.replace(/\n/g, '||').trim();
        });
      }
      if (row.variantAsins) {
        let text = '';
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
        row.variants.forEach(item => {
          text += `${item.text} | `;
        });
        row.variants = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
        row.firstVariant = row.gtin;
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += `${item.text}`;
        });
        row.promotion = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text}`;
        });
        row.additionalDescBulletInfo = [
          {
            text: cleanUp(text),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
