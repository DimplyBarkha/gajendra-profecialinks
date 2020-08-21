const { transform } = require('../format');
/**
 *
 * @param { { } } inputs
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
  await context.evaluate(async function (inputs) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const searchUrlDom = document.getElementById('search-url');
    const searchUrl = window.location.href.replace(/%20/g, ' ');
    if (searchUrlDom && searchUrlDom.innerText) {
      searchUrlDom.innerText = searchUrl;
    } else {
      addHiddenDiv('search-url', searchUrl);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'harveynorman',
    transform,
    domain: 'harveynorman.ie',
    zipcode: '',
  },
  implementation,
};
