/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      let skyIdStr='';
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.impo.ch' + item.text;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text=parseFloat(item.text);
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
            item.text = item.text.replace(/,.*/, '');
            item.text = item.text.replace('405w', '');
            item.text = 'I'+ item.text;
            item.text = item.text.slice(1, -1);
        });
     }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
          item.text = item.text.replace('CHF', '').trim();
          item.text = item.text.replace('.', ',').trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
          item.text = item.text.replace('statt', '').trim();
          item.text = item.text.replace('.', ',').trim();
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };