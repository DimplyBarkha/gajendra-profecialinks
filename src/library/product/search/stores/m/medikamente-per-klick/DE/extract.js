async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (node, id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      node.appendChild(newDiv);
    }
    const paginationDiv = document.querySelector('div.displayPagination > label');
    // @ts-ignore
    let pageStartIndex = paginationDiv ? paginationDiv.innerText.match(/\d+/) : 0;

    pageStartIndex = pageStartIndex ? +pageStartIndex[0] : 1;
    document.querySelectorAll('div.boxProduct.rowEven,div.boxProduct.rowOdd').forEach(node => {
      addHiddenDiv(node, `ii_rank_${pageStartIndex}`, pageStartIndex);
      const priceSelector = node.querySelector('dd.yourPrice');
      // @ts-ignore
      const price = priceSelector ? priceSelector.innerText.replace('.', '').replace(',', '.').trim() : '';
      addHiddenDiv(node, `ii_price_${pageStartIndex}`, price);
      ++pageStartIndex;
    });
  });
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'medikamente-per-klick',
    transform: null,
    domain: 'medikamente-per-klick.de',
  },
  implementation,
};
