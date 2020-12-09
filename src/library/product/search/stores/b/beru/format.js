/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      let productPageRank = 0;
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.aggregateRating) {
        let rate = '';
        var rating = row.aggregateRating.map((item) => {
          console.log('inFunction');
          rate += `${item.text.replace(/width:/g, '')}`;
          console.log('inFunction rate1', rate);
          rate += `${rate.replace(/%/g, '')}`;
          console.log('inFunction rate2', rate);
          return rate;
        });
        let result = (parseFloat('' + rating) / 20);
        result = result + '';
        row.aggregateRating = [{ text: result.replace('.', ','), xpath: row.aggregateRating[0].xpath }];
      }
      if (row.aggregateRating2) {
        let rate1 = '';
        const rating1 = row.aggregateRating2.map((item) => {
          console.log('inFunction');
          rate1 += `${item.text.replace(/width:/g, '')}`;
          console.log('inFunction rate1', rate1);
          rate1 += `${rate1.replace(/%/g, '')}`;
          console.log('inFunction rate2', rate1);
          return rate1;
        });
        row.aggregateRating2 = [{ text: (parseFloat('' + rating1) / 20).toString(), xpath: row.aggregateRating2[0].xpath }];
      }
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      row.productPageRank = [{ text: ++productPageRank }];
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
