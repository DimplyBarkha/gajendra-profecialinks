
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'darty',
    domain: 'darty.com',
    url: 'https://www.darty.com/nav/recherche?p=200&text={searchTerms}',
    loadedSelector: 'div.product_detail',
    noResultsXPath: '//h2[@class="title_bloc"]',
    zipcode: '',
  },
};
