/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [{
          text: text.slice(0, -3),
        }];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text} `;
        });
        row.ingredientsList = [{
          text: text.trim(),
        }];
      }

      if (row.packSize) {
        if (row.packSize[0].text.match(/(\d+)\(/)) {
          row.packSize = [{
            text: row.packSize[0].text.match(/(\d+)\(/)[1],
          }];
        } else if (row.packSize[0].text.match(/(\d+)pk/)) {
          row.packSize = [{
            text: row.packSize[0].text.match(/(\d+)pk/)[1],
          }];
        } else if (row.packSize[0].text.match(/(\d+)-/)) {
          row.packSize = [{
            text: row.packSize[0].text.match(/(\d+)-/)[1],
          }];
        } else {
          row.packSize = [{
            text: '',
          }];
        }
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = el.text ? clean(el.text) : el.text;
      }));
      if (row.description) {
        row.productDescriptionLength = [{ text: row.description[0].text.length }];
        row.productDescriptionWordCount = [{ text: row.description[0].text.split(' ').length }];
      }
    }
  }
  return data;
};

module.exports = { transform };
