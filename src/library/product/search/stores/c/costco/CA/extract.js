const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  try {
    await context.waitForSelector('#language-region-set', { timeout: 10000 });
    await context.click('#language-region-set');
  } catch (err) {
    console.log('Something happened while accepting the modal button.');
  }
  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const url = window.location.href;
    addHiddenDiv('added-searchurl', url);
  }
  await context.evaluate(addUrl);

  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    transform: transform,
    domain: 'costco.ca',
    zipcode: '',
  },
  implementation,
};
