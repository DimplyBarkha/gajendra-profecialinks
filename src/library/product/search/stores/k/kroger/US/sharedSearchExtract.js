async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;

  await context.evaluate(() => {
    console.log('new page!');
    const confirmButton = document.querySelector('button[data-testid="DynamicTooltip-Button-confirm"]');
    if (confirmButton) {
      confirmButton.click();
    }

    const searchEl = document.querySelector('span.kds-Text--l');
    let searchTerms;
    if (searchEl) {
      const searchText = searchEl.textContent;
      const idx = searchText.indexOf(':');
      searchTerms = searchText.slice(idx + 2);
    }

    const url = `https://www.kroger.com/search?query=${searchTerms}&searchType=natural`;

    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = url;

    document.body.appendChild(searchUrlDiv);
  });

  return await context.extract('product/search/stores/k/kroger/US/extract', { transform });
}

module.exports = {
  implementation,
};
