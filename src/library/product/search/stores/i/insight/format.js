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
          item.text = "https://www.insight.com" + item.text;
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if (row.manufacturer) {
        let info = [];
        row.manufacturer.forEach(item => {
          item.text = item.text.replace('/en_US/shop/product/', '').trim();
          item.text = item.text.replace('/', 'siva').trim();
          item.text = item.text.match(/siva.*/g,);
          info.push(item.text);
        });
        if (info.length) {
          row.manufacturer = [{ "text": info.join().replace('siva', '').replace(/\/.*/g, '').replace('%20', ' '), 'xpath': row.manufacturer[0].xpath }];
        }
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
          item.text = item.text.replace(/\s*/g, '').trim();
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