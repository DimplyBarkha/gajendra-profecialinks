/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const getPrice = function (price) {
      if (price.includes('EUR') || price.includes('€')) {
        price = price.replace(/\./g, '');
        price = price.replace(/\,/g, '.');
      } else if (price.includes('￥')) {
        price = price.replace('￥', '');
        price = price.replace(/\,/g, '');
      } else if (price.includes('$')) {
        price = price.replace(/\,/g, '');
      }
      price = price.replace(/€,EUR,£,CDN\$,$/g, '');
      price = price.match(/([\d,.]+[.,][\d]+)/g);
      return price;
    };
    for (const { group } of data) {
      for (const row of group) {
        if (row.price) {
          row.price.forEach(item => {
            const price = getPrice(item.text);
            item.text = price && price[0];
            if (price.length > 1) {
              row.min_price = [{
                text: price[0],
              }];
              row.max_price = [{
                text: price[1],
              }];
            }
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };