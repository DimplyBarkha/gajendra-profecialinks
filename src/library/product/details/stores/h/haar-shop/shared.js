/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
        });
      }
      if (row.aggregateRatingText) {
        row.aggregateRatingText.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          item.text = 'https://www.youtube.com/watch?v=' + item.text;
        });
      }
      // Price
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/\./g, ',');
      }
      // List Price
      if (row.listPrice && row.listPrice[0]) {
        row.listPrice[0].text = row.listPrice[0].text.replace(/\./g, ',');
      }
      // Aggregate Rating
      if (row.aggregateRating && row.aggregateRating[0]) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace(/\./g, ',');
      }
    }
  }
  return data;
};

module.exports = { transform };
