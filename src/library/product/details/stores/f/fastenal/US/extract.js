let {transform} = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
		function addHiddenDiv (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.className = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
		}
    var url = window.location.href;
    addHiddenDiv("product_custom_url", url);
    });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'fastenal',
    transform: transform,
    domain: 'fastenal.com',
    zipcode: '',
  },
  implementation,
};

