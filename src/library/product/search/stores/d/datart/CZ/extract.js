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
    function addHiddenDiv (el, id, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', id);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    // const url = window.location.href;
    // addHiddenDiv1('added-searchurl', url);

    const itemContainers = document.querySelectorAll('#fulltext-products-list > div');
    // @ts-ignore
    for (const itemContainer of itemContainers) {
      const url = window.location.href;
      addHiddenDiv(itemContainer, 'added-searchurl', url);
      console.log(itemContainer);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CZ',
    store: 'datart',
    transform,
    domain: 'datart.cz',
    zipcode: '',
  },
  implementation,
};
