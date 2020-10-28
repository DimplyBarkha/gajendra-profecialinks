
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'EG',
    store: 'souq',
    domain: 'egypt.souq.com',
    loadedSelector: 'div[class="tpl-results"] , div[class="product_content"]',
    noResultsXPath: '//div[contains(@class , "zero-results")] | //div[contains(@class,"warning callout zero-results")] | //ul/li[contains(text(),"item can\'t be found")]',
    zipcode: '',
  },
};
