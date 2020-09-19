/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    var rank = 1;
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://tmall.ru' + item.text
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = 'https:' + item.text
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var res = item.text.replace("(", "");
          var res1 = res.replace(")", "");
          item.text = res1;
        });
        row.reviewCount=row.ratingCount;
      }
      if (row.id) {
        row.id.forEach(item => {
          var res = item.text.split("|");
          item.text = res[1];
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          var res = item.text.split(":");
          var res1 = res[1].trim();
          var res2 = res1.split(" ");
          item.text = res2[0];
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          var res = item.text.split("|");
          item.text = res[1];
        });
      }
      row.rank = [{ "text": rank }];
      row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  return data;
};

module.exports = { transform };