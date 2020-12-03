
module.exports = {
  implements: 'product/offers/execute',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    domain: 'zalando.de',
    loadedSelector: '[id="z-vegas-pdp-props"]',
    noResultsXPath: '/html[not(//meta[@property="og:type"][@content="zalando_sharing:product"])]',
    offerUrl: null,
    zipcode: '',
  },
};
