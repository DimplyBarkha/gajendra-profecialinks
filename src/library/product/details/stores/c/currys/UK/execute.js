const { implementation } = require('../executeImplementation');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'currys',
    domain: 'currys.co.uk',
    loadedSelector: '#product-info',
    noResultsXPath: '/html[not(//*[@data-fuseaction="item_details"])] | /html[not(//script[contains(.,\'"pageType":"product"\')])] | //p[contains(text(), "No results were found for your search.")]',
    zipcode: 'SE19QY',
  },
  implementation,
};
