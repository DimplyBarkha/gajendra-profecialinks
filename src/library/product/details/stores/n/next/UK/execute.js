
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'next',
    domain: 'next.co.uk',
    loadedSelector: 'div[class="itemsContainer"]',
    noResultsXPath: '//div[@class="Error Error404"] | //div[contains(text(), "Uh oh, that page no longer exists...")] | //div[@class="Count"] | //div[@class="no-results"]',
    zipcode: '',
  },
};
