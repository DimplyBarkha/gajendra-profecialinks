
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'eldorado',
    nextLinkSelector: '#pagnNextString, #pagnNextLink, div[class="onorfo-0 sc-1y0nltl-0 bblmYF"] ul li[class*=next]:not([class*="next disabled"]) a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'eldorado.ru',
    zipcode: '',
  },
};
