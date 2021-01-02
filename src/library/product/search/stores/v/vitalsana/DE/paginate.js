
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, div.pages ul li.item.pages-item-next a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body[data-container="body"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'vitalsana.com',
    zipcode: '',
  },
};
