/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    let rank = 1;
    for (const row of group) {
      if (row.id) {
        let id = row.id[0].text.trim();
        id = id.slice(id.lastIndexOf('-') + 1).split('.')[0];
        row.id = [{ text: id, xpath: row.id[0].xpath }];
      }
      if (row.productUrl) {
        const productUrl = row.productUrl.map((item) => {
          return 'https://www.conrad.de' + item.text;
        });
        row.productUrl = [{ text: productUrl, xpath: row.productUrl[0].xpath }];
      }
      if (row.aggregateRating) {
        let aggregateRating = row.aggregateRating[0].text.trim();
        aggregateRating = aggregateRating === '0' ? '0.0' : parseFloat(aggregateRating.split(' ')[0]).toFixed(1);
        row.aggregateRating = [{ text: aggregateRating, xpath: row.aggregateRating[0].xpath }];
      }
      const updatedRank = rank++;
      row.rankOrganic = [{ text: updatedRank }];
      row.rank = [{ text: updatedRank }];
    }
  }

  return data;
};

module.exports = { transform };
