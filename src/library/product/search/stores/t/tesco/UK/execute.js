async function addRankAndOrganicRank (context) {
  // add rank and rank_organic attribute
  await context.evaluate(() => {
    const rowSelector = 'div.product-list--page.product-list--current-page > div > ul[data-auto="product-list"] > li';
    const rows = Array.from(document.querySelectorAll(rowSelector));
    const pageNumber = Number(document.querySelector('[name="current-results-page"] > span:not([class])').textContent);
    const offSet = (pageNumber - 1) * 24;
    for (let key = 0; key < rows.length; key++) {
      const rank = (key + 1 + offSet).toString();
      rows[key].setAttribute('rank', rank);
      rows[key].setAttribute('rank_organic', rank);
    }
  });
};
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    domain: 'tesco.com',
    url: 'https://www.tesco.com/groceries/en-GB/search?query={searchTerms}',
    loadedSelector: 'div.product-image__container',
    noResultsXPath: '//div[@class="empty-section--heading"][contains(text(),"We didn\'t find anything for")]',
    interactionFn: addRankAndOrganicRank,
  },
};
