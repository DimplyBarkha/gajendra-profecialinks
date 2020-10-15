
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'EG',
    store: 'souq',
    domain: 'egypt.souq.com',
    loadedSelector: 'div[class="tpl-results"]',
    noResultsXPath: '//div[contains(@class , "zero-results")] | //div[contains(@class,"warning callout zero-results")]',
    zipcode: '',
  },
};
