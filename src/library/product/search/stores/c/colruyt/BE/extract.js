const { transform } = require('../format.js');
async function implementation (
  { results },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function (results) {
    await new Promise(resolve => setTimeout(resolve, 2814));
    const element = document.querySelector('div[class*="footer__logo"]');
    if (element) {
      while (true) {
        const productsCount = document.querySelectorAll('div[class*="product products__item _bArticle _pArticle"]');
        if (productsCount && productsCount.length > results) {
          break;
        }
      }
    }
  }, results);
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const searchURL = window.location.href;
    addHiddenDiv('added_search_url', searchURL);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    transform,
    domain: 'colruyt.be',
    zipcode: '',
  },
  implementation,
};
