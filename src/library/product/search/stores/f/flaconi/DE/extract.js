async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
    const arr = document.querySelectorAll('div.category-products > ul > li:not([class="no-hover"])');
    for (let i = 0; i < arr.length; i++) {
      addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
      const priceElement = arr[i].querySelector('span.price') ? (arr[i].querySelector('span.price').innerText).trim() : '';
      const priceValue = priceElement ? (priceElement.match(/\d+.*€/)[0]).replace(/\./g, '').replace(',', '.') : '';
      addElementToDocument(arr[i], 'pd_price', priceValue);
    }
    localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
  });
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: null,
    domain: 'flaconi.de',
  },
  implementation,
};
