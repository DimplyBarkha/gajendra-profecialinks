const { transform } = require('../transform');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function addHiddenInfo (elementID, content) {
    await context.evaluate(function (elementID, content) {
      const newDiv = document.createElement('div');
      newDiv.id = elementID;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }, elementID, content);
  }
  const refererUrl = await context.evaluate(async function () {
    console.log(window.location.href);
    return window.location.href;
  });
  addHiddenInfo('ii_refererUrl', refererUrl);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: transform,
    domain: 'expert.ie',
    zipcode: '',
  },
  implementation,
};
