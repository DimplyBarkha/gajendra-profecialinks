const { transform } = require('../shared');

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
    const productList = document.querySelectorAll('.a-section.a-spacing-medium');
    const paginationDiv = document.querySelector('.s-desktop-toolbar');
    let pageStartIndex = paginationDiv ? paginationDiv.innerText.match(/\d+/) : 0;
    pageStartIndex = pageStartIndex ? +pageStartIndex[0] : 1;

    productList && productList.forEach((item1, index) => {
      const doc = item1;
      addElementToDocument(doc, 'pd_rank', pageStartIndex);
      pageStartIndex++;
    });
  });
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazon',
    transform,
    domain: 'amazon.de',
  },
  implementation,
};
