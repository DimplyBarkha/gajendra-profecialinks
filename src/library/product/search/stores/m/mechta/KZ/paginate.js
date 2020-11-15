
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    nextLinkSelector: 'div.modern-page-navigation a.modern-page-next',
    mutationSelector: null,
    spinnerSelector: 'div[style*="preload_circle_mechta.svg"]',
    loadedSelector: 'div.catalog_items_list div.aa_sectiontov',
    noResultsXPath: '//div[@class="j_detectum_search" and contains(text(),"По текущему запросу нет товаров")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mechta.kz',
    zipcode: "''",
  },
};
