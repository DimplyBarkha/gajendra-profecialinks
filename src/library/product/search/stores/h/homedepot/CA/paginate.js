
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    nextLinkSelector: 'nav[aria-label*="Pages"] a[class*="tail"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'acl-product-card-group[evtperfname*="acl-product-card-group"]',
    noResultsXPath: '//null-search//span[contains(text(), "we found 0 result ")]',
    openSearchDefinition: null,
    domain: 'homedepot.ca',
    zipcode: '',
  },
};
