
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    nextLinkSelector: 'div[data-box-name="pagination bottom"] a[rel="next"]',
    mutationSelector: 'div[data-role="pagination-counter"]',
    spinnerSelector: 'div[class="opbox-listing-layout"] div[class="_6gjm5"]',
    loadedSelector: 'div[id="opbox-listing--base"]',
    noResultsXPath: '//p[contains(text(),"Czy na pewno szukasz")]',
    openSearchDefinition: null,
    domain: 'allegro.pl',
    zipcode: '',
  },
};
