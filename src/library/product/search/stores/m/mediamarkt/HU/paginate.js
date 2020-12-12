
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'mediamarkt',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[data-gtm-prop-list-name="Search result list"]',
    noResultsXPath: '//div[@id="nincstalalat"]',
    openSearchDefinition: {
      template: 'https://www.mediamarkt.hu/hu/search.html?searchParams=%2FSearch.ff%3Fquery%3D{searchTerms}%26filterTabbedCategory%3Donlineshop%26filteravailability%3D1%26channel%3Dmmhuhu%26productsPerPage%3D25%26followSearch%3D9919&searchProfile=onlineshop&query={searchTerms}&sort=&page={page}&sourceRef=INVALID',
    },
    domain: 'mediamarkt.hu',
    zipcode: "''",
  },
};
