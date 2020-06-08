async function addRankAndOrganicRank ({ rowSelector, sponsoredSelector }) {
  // add rank and rank_organic attribute
  let rankOrganic = 0;
  document.querySelectorAll(rowSelector).forEach((row, index) => {
    const rank = index;
    row.setAttribute('rank', rank);
    if (sponsoredSelector) {
      if (row.querySelector(sponsoredSelector)) {
        rankOrganic++;
      }
    } else {
      rankOrganic = index + 1;
    }
    row.setAttribute('rank_organic', rankOrganic);
  });
}

module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'tesco',
    spinnerSelector: 'div.loading-spa',
    loadedSelector: 'div.product-image__container',
    nextLinkSelector: 'nav.pagination--page-selector-wrapper > ul > li:last-child > a.pagination--button.prev-next:not(.disabled)',
    domain: 'tesco.com',
    interactionFn: addRankAndOrganicRank,
    interactionFnParams: { rowSelector: 'div.product-list--page.product-list--current-page > div > ul[data-auto="product-list"] > li' },
  },
};
