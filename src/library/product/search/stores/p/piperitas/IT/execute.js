
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'piperitas',
    domain: 'piperitas.com',
    url: 'https://piperitas.com/catalogsearch/result/index/?q={searchTerms}',
    loadedSelector: 'div[class="category-products"]',
    noResultsXPath: '//div[@class="product-view"]|//p[@class="note-msg"][contains(text(), "Ci spiace, non ci sono prodotti per ora.")]',
    zipcode: '',
  },
};
