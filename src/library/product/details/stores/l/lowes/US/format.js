
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          if (!item.text.includes('hideMenu')) {
            text += item.text.replace(/\\/g, '');
          }
        });
        row.manufacturerDescription = [
          {
            text: clean(text),
          },
        ];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/, ' : ') : '';
        });
        row.specifications = [{ text: specificationsArr.join('||'), xpath: row.specifications[0].xpath }];
      }
      if (row.description) {
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n \n \n \n \n/g, ' | ').replace(/\n \n \n \n/g, ' | ').replace(/\n \n/g, ':').replace(/\n/g, ' | ') : '|';
        });
        row.description = [{ text: descriptionArr.join('|'), xpath: row.description[0].xpath }];
      }
      if (row.description) {
        let text = '';
        let descTop = '';
        let descInfoMiddle = '';
        row.description.forEach(item => {
          text += ` || ${item.text.replace(/\s{2,}/g, ' ').trim()}`;
        });
        if (row.descTop) {
          row.descTop.forEach(item => {
            descTop += ` || ${item.text.replace(/\s{2,}/g, ' ').trim()}`;
          });
        }
        if (row.descMiddle) {
          row.descMiddle.forEach(item => {
            descInfoMiddle += `${item.text.replace(/\s{2,}/g, ' ').trim()}`;
          });
        }
        descInfoMiddle = descInfoMiddle ? ` | ${descInfoMiddle} ` : '';
        row.description = [
          {
            text: clean(`${descTop}${descInfoMiddle}${text}`.trim()),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
