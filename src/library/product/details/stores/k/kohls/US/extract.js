const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForXPath('//div[@class="bv_main_container"]');

  await context.evaluate(async () => {
    // await new Promise((resolve, reject) => setTimeout(resolve, 5000));

    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    const availability = document.querySelector('h3[class="OOSprodNotAvail"]')
      ? 'Out of Stock'
      : 'In Stock';

    addElementToDom(availability, 'availability');
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'kohls',
    transform: transform,
    domain: 'kohls.com',
    zipcode: '',
  },
  implementation,
};
