const { transform } = require('../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
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
  return await context.extract(productDetails, { transform: parameters.transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'amazonMweb',
    transform,
    domain: 'amazon.de',
    timeout: 8000,
    zipcode: '',
  },
  implementation,
};
