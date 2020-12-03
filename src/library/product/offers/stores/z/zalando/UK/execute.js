
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'UK',
    store: 'zalando',
    domain: 'zalando.co.uk',
    loadedSelector: '[id="z-vegas-pdp-props"]',
    noResultsXPath: '/html[not(//meta[@property="og:type"][@content="zalando_sharing:product"])]',
    offerUrl: null,
    zipcode: '',
  },
};
