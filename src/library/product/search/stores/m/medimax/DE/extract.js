const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.click('button.cookies-overlay-dialog__accept-all-btn');
  } catch (err) {
    console.log(err);
  }
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
    country: 'DE',
    store: 'medimax',
    transform,
    domain: 'medimax.de',
    zipcode: '',
  },
  implementation,
};
