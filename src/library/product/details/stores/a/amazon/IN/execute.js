
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    domain: 'amazon.in',
    loadedSelector: '#productTitle, [data-automation-id=title], [id*=Title] h1, h1[class*=title],  h1[id*=title]',
    noResultsXPath: '//a[contains(@href, "dogsofamazon") and not(contains(@href, "503"))] | //a[@href="/ref=cs_404_logo"]/@href',
    zipcode: '',
  },
};
