
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, div[class="k0dn21-0 jSQPlH"] ul li:last-child a[class="Link__LinkStyled-RC__sc-b3hjw8-0 bnZSTg arrow false"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'lowes.com',
    zipcode: '',
  },
};
