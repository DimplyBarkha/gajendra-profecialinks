
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    domain: 'nocibe.fr',
    url: 'https://www.nocibe.fr/resultats/{searchTerms}',
    loadedSelector: 'div[class="products-list"], section#brandLanding > div > a[class="ems-head__cta"]',
    noResultsXPath: '//div[@class="srchrslt noresult"] | //div[@class="cntnt__content"] | //section[@id="brandLanding"][not(descendant::a)] | //div[@class="cmsPageContouring"]',
    zipcode: '',
  },
};
