
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazonPrimeNow',
    domain: 'primenow.amazon.co.uk',
    loadedSelector: '#productTitle, [data-automation-id=title], [id*=Title] h1,h1[class*=title],h1[id*=title]',
    noResultsXPath: '//a[contains(@href, "dogsofamazon") and not(contains(@href, "503"))]',
    zipcode: 'EC1A1CB',
  },
};
