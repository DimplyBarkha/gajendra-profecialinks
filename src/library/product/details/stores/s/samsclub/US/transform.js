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
      if (row.brandText) {
        row.brandText.forEach(brandText => {
          brandText.text = brandText.text.replace('by', '').trim();
        });
      }
      if (row.sku) {
        row.sku.forEach(sku => {
          if (sku.text.includes('#')) {
            sku.text = sku.text.split('#')[1].trim();
          }
        });
      }
      if (row.category) {
        row.category.forEach(category => {
          category.text = category.text.replace('All Departments', '').trim();
        });
      }
      if (row.descriptionBottom) {
        let text = '';
        row.descriptionBottom.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, ':')}`;
        });
        let description = [];
        if (row.description) {
          description = row.description;
        }
        description = [text, ...description.map(({ text }) => text)];
        row.description = [
          {
            text: cleanUp(description.join(' | ')),
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text} | `;
        });
        row.manufacturerDescription = [
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
