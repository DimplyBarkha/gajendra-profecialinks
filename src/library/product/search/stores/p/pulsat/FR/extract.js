const { transform } = require('./transform');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const listProducts = tc_vars;
    addHiddenDiv('sku', listProducts.list_product_sku);

    listProducts.list_product_ean && addHiddenDiv('product_ean', listProducts.list_product_ean);
    listProducts.list_product_id && addHiddenDiv('product_id', listProducts.list_product_id);
    listProducts.list_product_name && addHiddenDiv('product_name', listProducts.list_product_name);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'pulsat',
    transform,
    domain: 'pulsat.fr',
    zipcode: '',
  },
  implementation,
};
