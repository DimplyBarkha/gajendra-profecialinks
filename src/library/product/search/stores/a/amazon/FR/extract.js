
const { transform } = require('./transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href.replace(/%20/g, ' ');
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    domain: 'amazon.fr',
    zipcode: '75019',
  },
  implementation,
};
