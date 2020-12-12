/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const clean = text =>
    text.toString()
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
        if (typeof el.text !== 'undefined') {
            el.text = clean(el.text);
        }
    }))));
  
    for (const { group } of data) {
      for (const row of group) {

        if (row.variantId) {
            let temp = row.variantId[0].text.split('-');
            row.variantId[0].text = temp[temp.length-1].split('.')[0];
        }

        if (row.variantUrl) {
            let item = row.variantUrl[0];
            let string = 'https://www.mediamarkt.hu';
            if(!item.text.startsWith(string)) { 
                item.text = string.concat(item.text);           
            }
        }
      }
    }

    return data;
  };
  module.exports = { transform };
  