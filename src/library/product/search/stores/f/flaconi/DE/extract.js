const { cleanUp } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.waitForSelector('div.category-products > ul > li:not([class="no-hover"])');
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
    transform: cleanUp,
    domain: 'flaconi.de',
  },
  implementation,
};
