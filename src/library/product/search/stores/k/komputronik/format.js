/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    let rank = 1;
    for (const row of group) {
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          item.text = item.text.replace(/(.+?)\/.+/g, "$1");
          item.text = item.text.replace(".",",");
        });
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          item.text = item.text.replace(/.+?\|.+?(\d+).+/g, "$1");
        });
        row.ratingCount = row.reviewCount;
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
          item.text = item.text.replace(/\s*/g, '').trim();
        });
      }
      if (row.id) {
        row.id.forEach(item => {
          item.text = item.text.replace(/.+systemowy\s*:\s*\[(.+?)\].*/g, "$1");
        });
        row.variantId = row.id;
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.replace(/.+producenta\s*:\s*\[(.+?)\].*/g, "$1");
        });
      }      
      row.rank = row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  return data;
};
module.exports = { transform };