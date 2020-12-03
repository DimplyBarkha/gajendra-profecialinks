
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'next',
    domain: 'next.co.uk',
    loadedSelector: 'div[class="itemsContainer"]',
    noResultsXPath: '//div[@class="Error Error404"]',
    zipcode: '',
  },
};
