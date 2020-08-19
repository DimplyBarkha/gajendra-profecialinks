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
      if (row.productUrl) {
        row.productUrl.forEach(urlItem => {
          urlItem.text = 'https://www.boulanger.com' + urlItem.text;
        });
      }
      if (row.id) {
        row.id.forEach(idItem => {
          idItem.text = idItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.sku) {
        row.sku.forEach(skuItem => {
          skuItem.text = skuItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(ratingCountItem => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRatingItem => {
          aggregateRatingItem.text = aggregateRatingItem.text.replace(/[^\d]/gm, '');
          aggregateRatingItem.text = aggregateRatingItem.text.slice(0, 1) + '.' + aggregateRatingItem.text.slice(1, 2);
        });
      }
      if (row.price) {
        row.price.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/,/gm, '.');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(listPriceItem => {
          listPriceItem.text = listPriceItem.text.replace(/,/gm, '.');
        });
      }
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
  return data;
};
module.exports = { transform };
