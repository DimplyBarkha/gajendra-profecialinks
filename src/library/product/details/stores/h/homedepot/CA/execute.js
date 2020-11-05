module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    loadedSelector: 'div[class="hdca-product"],div[evtperfname="product-localized-container"]',
    noResultsXPath: '//product-not-found-container[@evtperfname="product-not-found-container"]//div[contains(text(), "temporarily unavailable")]',
    zipcode: '',
  },
};
