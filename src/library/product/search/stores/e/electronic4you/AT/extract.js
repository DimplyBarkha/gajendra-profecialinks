const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addElementToDocument (elem, id, value) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = value;
      newDiv.style.display = 'none';
      elem.appendChild(newDiv);
    }
    const productsOnPage = document.querySelectorAll('div.category-products>ul>li');
    const numberOfProductsOnPage = productsOnPage ? productsOnPage.length : 0;
    for (let i = 0; i < numberOfProductsOnPage; i++) {
      const item = document.querySelectorAll('div.category-products>ul>li')
        ? document.querySelectorAll('div.category-products>ul>li')[i] : [];
      // @ts-ignore
      const itemId = item && item.querySelector('div.art-nr')
        // @ts-ignore
        ? item.querySelector('div.art-nr').innerText.replace(/[\D]+/g, '') : '';
      addElementToDocument(item, 'itemId', itemId);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    transform: transform,
    domain: 'electronic4you.at',
    zipcode: '',
  },
  implementation,
};
