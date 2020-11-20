
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'empik',
    domain: 'empik.com',
    url: 'https://www.empik.com/szukaj/produkt?q={searchTerms}',
    loadedSelector: 'div.productWrapper a.img img.lazy',
    noResultsXPath: '//div[@class="sort notFound"]',
    zipcode: '',
  },
};
