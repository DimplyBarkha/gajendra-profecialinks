/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text && text.toString()
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
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      if (!row.id && row.id1) {
        row.id = row.id1;
      }
      if (!row.price && row.price1 && row.price1[0]) {
        if (row.price1[0].text && row.price1[0].text.match(/(.*)"price":"(.*?)",(.*)/)) {
          row.price1.forEach(item => {
            item.text = item.text.replace(/(.*)"price":"(.*?)",(.*)/, '$2');
          });
          row.price = row.price1;
        }
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.makro.co.za' + item.text;
        });
      }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     const tmpArr = item.text.split(',');
      //     // console.log('aggregateRating tmpArr :',tmpArr);
      //     const tmpArr1 = tmpArr[0].split(':');
      //     // console.log('aggregateRating tmpArr1 :',tmpArr1);
      //     // console.log('aggregateRating tmpArr1[1] :',tmpArr1[1]);
      //     item.text = tmpArr1[1];
      //   });
      // }
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
