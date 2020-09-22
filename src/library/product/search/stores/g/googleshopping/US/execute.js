
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    domain: 'shopping.google.com',
    url: 'https://shopping.google.com/u/0/s?m=7867565&sa=X&ved=0ahUKEwjvzIm746rrAhUNK80KHbtCCoAQ2NsDCGA',
    loadedSelector: 'ul[class*="carouselItemsContainer"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
