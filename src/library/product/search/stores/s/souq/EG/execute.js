
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'EG',
    store: 'souq',
    domain: 'egypt.souq.com',
    url: 'https://egypt.souq.com/eg-en/{searchTerms}/s/',
    loadedSelector: 'div[class="tpl-results"]',
    noResultsXPath: '//div[contains(@class , "zero-results")]',
    zipcode: '',
  },
};
