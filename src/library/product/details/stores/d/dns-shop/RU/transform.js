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
        if (row.alternateImages.length > 0) {
          row.secondaryImageTotal = [
            {
              text: row.alternateImages.length - 1,
            },
          ];
        }
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text} `;
        });
        row.description = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text += `${item.text}`;
        });
        row.shippingDimensions = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text}`;
        });
        row.manufacturerDescription = [
          {
            text: cleanUp(text),
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
      if (row.shippingWeight) {
        let text = '';
        row.shippingWeight.forEach(item => {
          text = item.text;
        });
        row.shippingWeight = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text = item.text.replace('Характеристики ', '');
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text = item.text.replace('Характеристики ', '');
        });
        row.name = [
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
