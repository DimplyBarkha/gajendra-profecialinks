
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'amazonPrimeNow',
    domain: 'primenow.amazon.de',
    url: 'https://primenow.amazon.de/search?k={searchTerms}&p_95=&merchantId=&ref_=pn_sr_nav_sr_ALL&dc',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '10115',
  },
};