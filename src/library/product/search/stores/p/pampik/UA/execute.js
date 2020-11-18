
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    domain: 'pampik.com',
    url: "https://pampik.com/search/q/{searchTerms}",
    loadedSelector: "ul[id='products-list'] li[class='listing__item'] span[class='new-product-item-img'] img",
    noResultsXPath: "//div[@class='l-search-empty']/h1",
    zipcode: '',
  },
};
