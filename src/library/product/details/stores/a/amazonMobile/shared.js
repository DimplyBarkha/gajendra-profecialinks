/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
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
          text += `${item.text.replace('Amazon.com:', '')}`;
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
          text += `${item.text.replace('Amazon.com:', '')}`;
        });
        row.name = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, '')}`;
        });
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
        row.description = [
          {
            text: cleanUp(descriptionBottom.join(' | ')),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = `${item.text.replace('._AC_US40_', '')}`;
        });
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text.replace(/\r\n|\r|\n/g, ' ')
            .replace(/&amp;nbsp;/g, ' ')
            .replace(/&amp;#160/g, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .replace(/"\s{1,}/g, '"')
            .replace(/\s{1,}"/g, '"')
            .replace(/Read more/g, '')
            .replace(/View larger/g, '')
            .replace(/^ +| +$|( )+/g, ' ').trim()} `;
        });
        row.manufacturerDescription = [
          {
            text: text.replace(/<img.{1,300}">/g, '').trim(),
          },
        ];
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
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = `${item.text.replace(',', '')}`;
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          if (!item.text.includes('Brand')) {
            item.text = `Brand: ${item.text}`;
          }
        });
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          if (item.text.includes('ounces')) {
            row.shippingDimensions = [
              {
                text: item.text.replace(/(.+)(\d).?(\d.)\s*ounce[s]?/, '$1'),
              },
            ];
          }
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '0') {
            row.variantCount = [
              {
                text: '1',
              },
            ];
          }
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
