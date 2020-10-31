
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'promofarma',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, ul[class="pagination justify-content-center"] li:last-child[class="page-item  "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[@class='box-white not-found-box my-2 text-center']/h3/text()",
    openSearchDefinition: null,
    domain: 'promofarma.com',
    zipcode: '',
  },
};
