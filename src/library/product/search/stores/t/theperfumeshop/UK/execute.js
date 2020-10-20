
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'theperfumeshop',
    domain: 'theperfumeshop.com',
    url: 'https://www.theperfumeshop.com/search?text={searchTerms}',
    loadedSelector: 'div.product_grid__results',
    noResultsXPath: '//h2[@class="page_subtitle" and text()="No search results for"]',
    zipcode: '',
  },
};
