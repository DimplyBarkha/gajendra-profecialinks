/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');

  const regexp = '(?:([\\d\\.]+)\\s?(\\w+))';
  function getSplitValue (inputStr, count) {
    if (inputStr) {
      const result = inputStr.match(regexp);
      return result[count];
    }
  }
  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.inTheBoxUrl) {
          row.inTheBoxUrl.forEach(item => {
            if (!item.text.match('https://') && item.text.startsWith('//')) {
              item.text = `https:${item.text}`;
            }
          });
          const images = Array.from(new Set((row.inTheBoxUrl.map(elm => elm.text))));
          row.inTheBoxUrl = images.map(text => ({ text }));
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
