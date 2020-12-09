const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async () => {
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }

    const searchUrl = window.location.href;
    const productList = document.querySelectorAll('div[itemtype="http://schema.org/Offer"]');

    productList && productList.forEach((item1) => {
      const doc = item1;
      addElementToDocument(doc, 'searchUrl', searchUrl);
    });
  });
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    transform,
    domain: 'linio.com.mx',
    zipcode: '',
  },
  implementation,
};
