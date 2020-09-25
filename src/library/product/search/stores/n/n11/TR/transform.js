/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating2) {
        let text = '';
        let rating;
        row.aggregateRating2.forEach(item => {
          rating = item.text.match(/\d+/g);
          rating = rating / 20;
          rating = rating.toString().replace('.', ',');
        });
        text = text + rating;
        row.aggregateRating2 = [{ text }];
      }

      // if (row.price) {
      //   let text = '';
      //   let price;
      //   row.price.forEach(item => {
      //     price = item.text.replace(/[,.]/g, (c) => {
      //       return c === ',' ? '.' : ',';
      //     });
      //   });
      //   text = text + price;
      //   row.price = [{ text }];
      // }

      // if (row.listPrice) {
      //   let text = '';
      //   let listPrice;
      //   row.listPrice.forEach(item => {
      //     listPrice = item.text.replace(/[,.]/g, (c) => {
      //       return c === ',' ? '.' : ',';
      //     });
      //   });
      //   text = text + listPrice;
      //   row.listPrice = [{ text }];
      // }
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
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
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
