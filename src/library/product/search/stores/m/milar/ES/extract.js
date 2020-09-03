async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
console.log(inputs,"inputs")
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const searchEl = document.querySelector('#txtBuscador')
    let searchTerms;
    if (searchEl) {
      const searchText = searchEl.textContent;
      const idx = searchText.indexOf(':');
      searchTerms = searchText.slice(idx + 2);
    
    }

    //const url = `https://www.kroger.com/search?query=${searchTerms}&searchType=natural`;

    const searchUrlDiv = document.createElement('div');
    searchUrlDiv.classList.add('my-search-url');
    searchUrlDiv.style.display = 'none';
    searchUrlDiv.textContent = searchTerms;

    document.body.appendChild(searchUrlDiv);
  });

  return await context.extract(productDetails, { parameters });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'milar',
    transform: null,
    domain: 'milar.es',
    zipcode: '',
  },
  implementation,
};
