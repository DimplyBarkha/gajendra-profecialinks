/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const cleanUp = (data) => {
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
  let productUrlObj;
  try {
    // @ts-ignore
    productUrlObj = JSON.parse(data[0].group[0].productUrlObj[0].text);
  } catch (error) {
    console.log('no data found');
  }
  const state = context.getState();
  let rank = state.rank || 1;
  for (const { group } of data) {
    // @ts-ignore
    for (const [i, row] of group.entries()) {
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.gall.nl' + item.text;
        });
      }
      if (row.price) {
          row.price.forEach(item => {
            item.text = item.text.replace(/(\s*)+/g, '');
            item.text = '€' + item.text;
            item.text = item.text.replace('.', ',');
            item.text = item.text.replace(/\s*/g, '');
          });
        }
        if (row.listPrice) {
          row.listPrice.forEach(item => {
            item.text = item.text.replace(/(\s*)+/g, '');
            item.text = '€' + item.text;
            item.text = item.text.replace('.', ',');
            item.text = item.text.replace(/\s*/g, '');
          });
        }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          var tmp = item.text.replace('(', '');
          item.text = tmp.replace(')', '');
          item.text=parseInt(item.text);
        });
      }
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          item.text = item.text.replace("brand:(.+?)", '$1').trim();
        });
      }
      row.rank = row.rankOrganic = [{ text: rank }];
      rank++;
    }
  }
  context.setState({ rank });
  return cleanUp(data);
};
module.exports = { transform };