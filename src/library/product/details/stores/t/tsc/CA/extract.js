
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // Fetching brand from JSON and if not available then first word from the product name
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const brandSelector = document.querySelector('div[data-id="productData"]');
    const brandJSON = brandSelector ? brandSelector.getAttribute('data-value') : '';
    const brandObj = JSON.parse(brandJSON);
    let brand = brandObj.Brand;
    if (!brand) {
      const nameSelector = document.querySelector('h1[id="lblProductName"]');
      const name = nameSelector ? nameSelector.innerText : '';
      brand = name ? name.replace(/^([\w]+).*/gm, '$1') : '';
    }
    addHiddenDiv('added-brand', brand);
  });

  await new Promise(resolve => setTimeout(resolve, 20000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'tsc',
    transform,
    domain: 'tsc.ca',
    zipcode: '',
  },
  implementation,
};
