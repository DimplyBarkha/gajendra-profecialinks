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
          text += `${item.text.replace('Amazon.com:', '').replace(': Prime Pantry', '')}`;
        });
        row.nameExtended = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text += `${item.text.replace('Amazon.com:', '').replace(': Prime Pantry', '')}`;
        });
        row.name = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.description || row.descriptionBottom) {
        let text = '';
        const description = row.description;
        description && description.forEach(item => {
          text += ` || ${item.text.replace(/\n \n/g, '')}`;
        });
        text = text.trim();
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
        row.description = [
          {
            text: cleanUp(descriptionBottom.join(text ? ' | ' : '')),
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
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          if (item.text.includes('ounces')) {
            const text = item.text.replace(/(.+)\s(\d+)\.?(\d+)?\s*ounce[s]?/, '$1').replace(';', '');
            row.shippingDimensions = [
              {
                text: text.trim(),
              },
            ];
          } else if (item.text.includes('pounds')) {
            const text = item.text.replace(/(.+)\s(\d+)\.?(\d+)?\s*pound[s]?/, '$1').replace(';', '');
            row.shippingDimensions = [
              {
                text: text.trim(),
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
      if (row.packSize) {
        const item = row.packSize.length > 1 ? row.packSize[1] : row.packSize[0];
        console.log('itrm---->', item);
        if (/.*?(\d+)-Pack.*/i.test(item.text)) {
          item.text = item.text.replace(/.*?(\d+)-Pack.*/i, '$1');
        } else if (/.*pack of\s*(\d+).*/i.test(item.text)) {
          item.text = item.text.replace(/.*pack of\s*(\d+).*/i, '$1');
        } else if (/.*?(\d+)-Count.*/i.test(item.text)) {
          item.text = item.text.replace(/.*?(\d+)-Count.*/i, '$1');
        } else if (/.*(\d+)\s*Count.*/.test(item.text)) {
          item.text = item.text.replace(/.*?(\d+)\s*[Cc]{1}ount.*/, '$1');
        } else {
          item.text = '';
        }
        row.packSize = [item];
      }
      if (row.promotion) {
        row.promotion.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
