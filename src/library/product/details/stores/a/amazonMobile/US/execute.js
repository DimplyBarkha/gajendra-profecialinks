module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMobile',
    domain: 'amazon.com',
    loadedSelector: '#productTitle, [data-automation-id=title], [id*=Title] h1, h1[class*=title],  h1[id*=title]',
    noResultsXPath: '//a[contains(@href, "dogsofamazon") and not(contains(@href, "503"))]',
  },
};
