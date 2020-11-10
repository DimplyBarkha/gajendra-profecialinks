
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'pilulka',
    domain: 'pilulka.cz',
    url: 'https://www.pilulka.cz/hledej?q={searchTerms}',
    loadedSelector: 'a.product-prev__img',
    noResultsXPath: '//div[@class="alert alert-danger"]//div[contains(text(), "žádné")]',
    zipcode: '',
  },
};
