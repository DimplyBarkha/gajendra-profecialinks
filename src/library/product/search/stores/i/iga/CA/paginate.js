
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    nextLinkSelector: 'nav[class="pagination push--ends text--center"]>nav>div>div>ul>li[class="pagination__arrow pagination__arrow--right"]>a[class="icon--arrow-skinny-right"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'iga.net',
    zipcode: '',
  },
};
