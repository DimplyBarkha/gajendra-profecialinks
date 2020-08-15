
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const state = context.getState();
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(productUrl => {
          productUrl.text = `https://www.homedepot.ca${productUrl.text}`;
        });
      }
      if (row.id) {
        row.id.forEach(id => {
          if (id.text.includes('/')) {
            id.text = id.text.replace(/.*\/(.*)$/, '$1');
          }
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          if (item.text.includes('/')) {
            item.text = item.text.replace(/.*\/(.*)$/, '$1');
          }
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          if (item.text.includes('/')) {
            item.text = item.text.replace(/.*\/(.*)$/, '$1');
          }
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = item.text.replace(/(wid=)(\d)*/g, '$1256').replace(/(hei=)(\d)*/g, '$1256')
        });
      }
      if (row.price) {
        row.price[0].text += row.priceCent ? '.' + row.priceCent[0].text : '.00'
      }
      if (row.id && row.id[0] && productCodes.indexOf(row.id[0].text) === -1) {
        productCodes.push(row.id[0].text);
        rankCounter += 1;
        row.rankOrganic = [{ text: rankCounter }];
      } else {
        row.id = [{ text: '' }];
      }
    }
  }
  return data;
};

module.exports = { transform };
