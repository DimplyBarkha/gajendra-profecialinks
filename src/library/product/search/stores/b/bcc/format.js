
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.sku) {
        row.sku = row.sku.map(item => {
          item.text = item.text.replace('product-', '');
          return item
        });
      }

      if (row.aggregateRating) {
        row.aggregateRating = row.aggregateRating.map(item => {
          let res = item.text.match(/(\d+)/);
          let rating = (5*parseInt(res))/100; 
          item.text = rating.toString().replace('.', ",");
          return item;
        });
      }

      if (row.aggregateRatingText) {
        row.aggregateRatingText = row.aggregateRatingText.map(item => {
          let res = item.text.match(/(\d+)/);
          let rating = (5*parseInt(res))/100; 
          item.text = rating.toString();
          return item;
        });
      }

      if (row.id) {
        row.id = row.id.map(item => {
          item.text = item.text.replace('product-', '');
          return item
        });
      }

      if (row.variantId) {
        row.variantId = row.variantId.map(item => {
          item.text = item.text.replace('product-', '');
          return item
        });
      }

      if (row.reviewCount) {
        row.reviewCount = row.reviewCount.map(item => {
          item.text = item.text.replace('reviews', '');
          item.text = item.text.trim();
          return item
        });
      }

      if (row.price) {
        row.price = row.price.map(item => {
          item.text = item.text.replace(/ /g, '');
          return item;
        });
      }
      
      if (row.listPrice) {
        row.listPrice = row.listPrice.map(item => {
          item.text = item.text.replace(/ /g, '');
          return item;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
