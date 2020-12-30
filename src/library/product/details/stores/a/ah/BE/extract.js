const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    transform,
    domain: 'ah.be',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        addElementToDocument('availabilityText', 'In stock');
      } catch (e) {
        addElementToDocument('availabilityText', 'In Store Only');
      }
      try {
        const el = document.querySelector('address');
        const end = el.innerHTML.indexOf('<br>');
        const manufacture = el.innerText.slice(0, end);
        addElementToDocument('manufacturer', manufacture);
        const element = document.querySelector('.product-card-daily-price_dayPriceBlock__3gqLD > button').innerText;
        const endText = element.indexOf(' ');
        addElementToDocument('sizeContent', element.slice(0, endText));
      } catch (e) {
        addElementToDocument('manufacturer', '');
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
