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
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      if (row.id) {
        row.id.forEach(item => {
          const tmpObj = JSON.parse(item.text);
          item.text = tmpObj.product_sku;
        });
      }
      if (row.aggregateRating) {
        let ratVal = 0;
        row.aggregateRating.forEach(item => {
          if (item.text == '/on/demandware.static/Sites-Sephora_IT-Site/-/default/dwf843d5fd/images/svg-icons/rating-star-full-icon.svg') {
            ratVal++;
          } else if (item.text == '16px') {
            ratVal = ratVal + 0.5;
          }
        });
        if (ratVal > 0) {
          row.aggregateRating = [{ text: ratVal }];
        }
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          if (item.text.indexOf('https://www.sephora.it') == -1) {
            item.text = 'https://www.sephora.it' + item.text;
          }
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          console.log('item.text', item.text);
          item.text = item.text.replace(',', '.').trim();
          console.log(' final item.text', item.text);
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
