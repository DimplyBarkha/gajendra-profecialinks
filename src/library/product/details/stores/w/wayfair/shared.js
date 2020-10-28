
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      let text = '';
      text = [String(row.name && row.name[0].text), String(row.variantInformation && row.variantInformation[0].text)].filter(e => e !== 'undefined').join(' ');
      row.nameExtended = [
        {
          text: text,
        },
      ];
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text = row.variants.map(elm => elm.text).join(' | ');
        });
        row.variants = [{ text }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' || ');
        });
        row.description = [{ text }];
      }
      if (row.specifications) {
        let text = '';
        let count = 0;
        row.specifications.forEach(item => {
          count++;
          const val = (count % 2);
          if (val === 0) {
            text += `: ${item.text}`;
          } else {
            text += ` | ${item.text}`;
          }
        });
        row.specifications = [
          {
            text: text.replace(new RegExp('(\\s\\|\\s)(.+)', 'g'), '$2'),
          },
        ];
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
