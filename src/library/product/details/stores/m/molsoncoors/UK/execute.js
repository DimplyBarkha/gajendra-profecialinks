
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'molsoncoors',
    domain: 'mymolsoncoors.com',
    loadedSelector: 'div.product_detail_item',
    noResultsXPath: '//*[contains(text(), "No Results Found")]',
    zipcode: "''",
  },
};
