async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    const itemContainers = document.querySelectorAll('#maincontent > div.columns > div.column.main > div.search.results > div.products.wrapper.grid.products-grid > ol > li');
    let rank = 1;
    // @ts-ignore
    for (const itemContainer of itemContainers) {
      console.log(itemContainer);
      const totalRank = itemContainer + rank;
      addHiddenDiv(itemContainer, 'rank', totalRank);
      rank++;
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    transform: null,
    domain: 'skin.pt',
    zipcode: '',
  },
  implementation,
};
