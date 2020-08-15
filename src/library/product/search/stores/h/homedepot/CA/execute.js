
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    url: 'https://www.homedepot.ca/search?q={searchTerms}',
    loadedSelector: 'acl-product-card-group[evtperfname*="acl-product-card-group"]',
    noResultsXPath: '//null-search//span[contains(text(), "we found 0 result ")]',
    zipcode: '',
  },
};
