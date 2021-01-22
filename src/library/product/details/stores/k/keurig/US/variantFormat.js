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
    .replace(/\\"/gm, '"')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      row.variantUrl = [{ text: row.variantUrl[0].text.replace(" ",'%20')}];
      if(row.variantId && row.variantUrl && row.variantUrl[0] && row.variantId[0]){
        row.variantId = [{ text: `${row.variantId[0].text}:${row.variantUrl[0].text}`}]
       }
      

      if (row.variantId && !row.variantUrl) {
        const varaintUrl = [];
        row.variantId.forEach(item => {
          varaintUrl.push({ text: `https://www.keurig.com/p/${item.text}` });
        });
        row.variantUrl = varaintUrl;
      }
      if (row.variantUrl && row.variantId && row.variantId[0]) {
        row.variantUrl = [{
          text: `https://www.keurig.com/p/${row.variantId[0].text}`
        }]
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
