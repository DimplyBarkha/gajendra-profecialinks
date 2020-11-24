
module.exports = {
  implements: 'product/sellerInventory/execute',
  parameterValues: {
    country: 'ES',
    domain: 'dosfarma.com',
    store: 'dosfarma',
    loadedSelector: null,
    noResultsXPath: '//div[@class="product_primary"][not(//button[@class="add-to-cart"])]',
    sellerInventoryUrl: null,
    zipcode: '',
  },
};
