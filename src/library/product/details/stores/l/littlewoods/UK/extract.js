const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function (inputs) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    Object.keys(window.universal_variable.product).forEach((key) => {
      console.log("ddfdf" + window.universal_variable.product[key]);
    });
    const category=window.universal_variable.product.category
    addHiddenDiv('detail-category', category);
    });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    transform: transform,
    domain: 'littlewoods.com',
    zipcode: '',
  },
};