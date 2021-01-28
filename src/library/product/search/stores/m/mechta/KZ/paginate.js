
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'KZ',
    store: 'mechta',
    // nextLinkSelector: 'button.q-btn.q-btn-item.non-selectable.no-outline.q-btn--standard.q-btn--rectangle.bg-primary.text-white.q-btn--actionable.q-focusable.q-hoverable.q-btn--no-uppercase.q-btn--wrap',
    // mutationSelector: 'button.q-btn.q-btn-item.non-selectable.no-outline.q-btn--standard.q-btn--rectangle.bg-primary.text-white.q-btn--actionable.q-focusable.q-hoverable.q-btn--no-uppercase.q-btn--wrap',
    // spinnerSelector: 'div[style*="preload_circle_mechta.svg"]',
    loadedSelector: 'div.hoverCard-child.bg-white',
    noResultsXPath: '//div[@class="bg-color10 q-mt-xl q-pt-sm"]/div[contains(., "ничего не найдено")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mechta.kz',
    zipcode: "''",
  },
};
