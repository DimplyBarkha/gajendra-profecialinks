
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'Unieuro',
    domain: 'unieuro.it',
    url: 'https://www.unieuro.it/online/?q={searchTerms}',
    // loadedSelector: '.listing-container>main>.items-container',
    noResultsXPath: '//div[@id="no-results-message"] | //section[@data-module="compare"][not(section)]',
    zipcode: '',
  },
};
