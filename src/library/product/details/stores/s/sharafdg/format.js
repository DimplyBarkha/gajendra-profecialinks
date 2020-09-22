const { CLIEngine } = require('eslint');

/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        const formattedSpecification = [];
        for (let i = 0; i < row.specifications.length; i++) {
          if (i % 2 === 0 && row.specifications[i + 1]) {
            formattedSpecification.push(`${row.specifications[i].text}:${row.specifications[i + 1].text}`);
          }
        }
        row.specifications = [{ text: formattedSpecification.join(' | ') }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfo = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfo.join('|'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text} || `;
        });
        row.description = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach(item => {
          text += `${item.text} | `;
        });
        row.alternateImages = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.variantInformation) {
        const variantText = row.variantInformation.map((item) => {
          if (item.text === 'Alternatives') {
            return 'Colors';
          }
          return item.text;
        });
        row.variantInformation = [{ text: variantText.join(',') }];
      }
      if (row.category) {
        row.category.shift();
      }
    }
  }

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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
