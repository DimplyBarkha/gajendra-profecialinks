async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => {
      // Add cusom next link
      const pagination = document.querySelector('.b7t2 div');
      const basicNextBtn = document.querySelector('.b6k6 a.ui-k6');
      try{
        if(pagination.hasChildNodes() && !basicNextBtn){
          const currPage = document.querySelector('.b9g0.b9g2');
          const nextPageHref = currPage.nextElementSibling.getAttribute('href')
          const nextLink = document.createElement('a');
          nextLink.className = 'ui-k6 custom nav';
          nextLink.setAttribute('href', mainUrl.replace(/page=.*&/, nextPageHref));
          nextLink.textContent = 'Дальше'
          pagination.append(nextLink);
          console.log(nextLink);
        }
      }catch(e){
        console.log('Error with custom navigation', e);
      }

    });
    if (!hasNextLink) {
      return false;
    }
  }
}

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'RU',
    store: 'ozon',
    nextLinkSelector: '.b6k6 a.ui-k6',
    nextLinkXpath: '//div[@class="b7t2"]/div[@class="b9i0 ui-k4"]/a[@class="ui-k6"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.ao4',
    loadedXpath: null,
    noResultsXPath: '//div[@class="b6q3"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    // openSearchDefinition: {
    //   template: 'https://www.ozon.ru/search/?from_global=true&page={page}&text={searchTerms}',
    //   pageStartNb: 1,
    // },
    domain: 'ozon.ru',
    zipcode: '',
  },
  implementation,
};
