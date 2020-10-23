
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    url: 'https://www.homedepot.ca/search?q=Cooktop#!q=Cooktop',
    loadedSelector: 'body > app-container > div.default-min-height > srp-landing-page > div.acl-position--relative > div > plp-product-card-container > product-card-shared > acl-product-card-group > article:nth-child(1)',
    noResultsXPath: null,
    zipcode: '',
  },
};
