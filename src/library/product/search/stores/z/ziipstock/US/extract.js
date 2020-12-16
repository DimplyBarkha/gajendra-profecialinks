const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.productUrl) {
        // const text = '';
        row.productUrl.forEach(item => {
          item.text = 'https://ziipstock.com' + item.text;
        });
      }
    }
  }
  return data;
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'ziipstock',
    transform,
    domain: 'ziipstock.com',
    zipcode: "''",
  },
};
