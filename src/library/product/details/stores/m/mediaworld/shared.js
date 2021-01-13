/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
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

  for (const { group } of data) {
    for (const row of group) {
      let text = '';
      if (row.inTheBoxUrl && row.inTheBoxUrl.length > 1) {
        row.inTheBoxUrl.forEach(item => {
          const data = item.text.split(',');
          text += `${data[data.length - 1].split(' ')[1].replace(/^(.*)/gm, 'http:$1')} || `;
        });
        row.inTheBoxUrl = [
          {
            text,
          },
        ];
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
