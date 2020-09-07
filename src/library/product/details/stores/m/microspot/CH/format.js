
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications && row.spec1) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += row.specifications[i].text + ' : ' + row.spec1[i].text + ' | ';
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.description) {
        let desc = '';
        let count = 0;
        row.description.forEach(item => {
          if (count % 2 === 0) {
            desc += `${item.text.replace(/\n \n/g, '')} : `;
          } else {
            desc += `${item.text.replace(/\n \n/g, '')} || `;
          }
          count++;
        });
        row.description = [
          {
            text: desc.slice(0, -4),
          },
        ];
      }
      if (row.availabilityText) {
        row.availabilityText = [{
          text: 'In Stock',
        }];
      } else {
        row.availabilityText = [{
          text: 'Out of Stock',
        }];
      }
    }
  }

  return data;
};

module.exports = { transform };
