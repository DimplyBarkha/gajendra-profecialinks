
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
          productUrl.text = `https://www.homedepot.com${productUrl.text}`;
        });
      }
      if (row.id) {
        row.id.forEach(id => {
          if (id.text.includes('/')) {
            id.text = id.text.replace(/.*\/(.*)$/, '$1');
          }
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          if (item.text.includes('width')) {
            const starWidth = item.text.replace(/.*?(\d+\.?\d*).*/, '$1');
            if (starWidth) {
              const ratings = ((starWidth * 5) / 100).toFixed(1);
              item.text = ratings;
            }
          }
        });
      }
      if (row.brand) {
        const brand = row.brand[0].text;
        if (row.name) {
          row.name[0].text = `${brand} ${row.name[0].text}`;
        }
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
  context.setState({ rankCounter });
  context.setState({ productCodes });
  return data;
};

module.exports = { transform };
