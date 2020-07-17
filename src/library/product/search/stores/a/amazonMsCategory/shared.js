/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const getPrice = function (price) {
    if (price.includes('EUR') || price.includes('€')) {
      price = price.replace('.', '');
      price = price.replace(',', '.');
    } else if (price.includes('￥')) {
      price = price.replace('￥', '');
      price = price.replace(',', '');
    }
    price = price.replace(/€,EUR,£,CDN\$,$/g, '');
    price = price.match(/([\d,.]+[.,][\d]+)/g);
    return price;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.price) {
        row.price.forEach(item => {
          item.text = getPrice(item.text) && getPrice(item.text)[0];
          if (getPrice(item.text).length > 1) {
            row.min_price = [{
              text: getPrice(item.text)[0],
            }];
            row.max_price = [{
              text: getPrice(item.text)[1],
            }];
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
