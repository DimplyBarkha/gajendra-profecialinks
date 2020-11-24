const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  await context.waitForXPath('//div[@id="sidebar-nav"]');

  await context.evaluate(async () => {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);


    const products = document.querySelectorAll('div[class="col-lg-4 col-md-4 col-sm-4 col-xs-6 item card-col"]');
    products.forEach((product, index) => {
      // set rank
      product.setAttribute('rank', (index + 1).toString());
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'piperitas',
    transform: transform,
    domain: 'piperitas.com',
    zipcode: '',
  }, implementation,
};
