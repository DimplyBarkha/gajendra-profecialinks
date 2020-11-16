
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'petsmart',
    domain: 'petsmart.ca',
    loadedSelector: 'img.react-viewer-image',
    noResultsXPath: '//div[@class="ca-404-container"]',
    zipcode: '',
  },
};
