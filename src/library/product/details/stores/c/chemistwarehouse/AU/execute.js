module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse',
    domain: 'chemistwarehouse.com.au',
    loadedSelector: 'div.search__result__product__list , div.product-id',
    noResultsXPath: '//div[@class="search__result__products-no-result"] | //div[contains(text(), "Sorry, the product you  are looking for")]',
    zipcode: '',
  },
};