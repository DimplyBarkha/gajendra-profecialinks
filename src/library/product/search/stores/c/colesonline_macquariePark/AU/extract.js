// const { transform } = require('../../../../shared');
const { transform } = require('../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_macquariePark',
    transform,
    domain: 'shop.coles.com.au',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const searchUrl = window.location.href;
    addHiddenDiv('ii_searchUrl', searchUrl);
  });
  return await context.extract(productDetails, { transform });
}
