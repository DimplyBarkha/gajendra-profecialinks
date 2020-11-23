/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
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
      if (row.rank) {
        const rankArray = row.rank.map((item) => {
          return parseInt(item.text) + 1;
        });
        row.rank = [{ text: rankArray.join(), xpath: row.rank[0].xpath }];
      }
      if (row.rankOrganic) {
        const rankOrganicArray = row.rankOrganic.map((item) => {
          return parseInt(item.text) + 1;
        });
        row.rankOrganic = [{ text: rankOrganicArray.join(), xpath: row.rankOrganic[0].xpath }];
      }
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
