
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CZ',
    store: 'Mall',
    domain: 'mall.cz',
    url: 'https://www.mall.cz/hledej?s=pr%C3%ADkrmy%20kojencu',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
