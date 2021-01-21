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
          item.text = 'https://www.firstchoiceliquor.com.au' + item.text;
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1, -1);
          item.text = item.text.toString();
          item.text = 'https://www.firstchoiceliquor.com.au' + item.text
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          var tmp = item.text.replace(/\s\n/g, '');
          item.text = tmp.replace('outof5starrating', '');
          item.text=parseInt(item.text);
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
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