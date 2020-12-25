const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform: null,
    domain: 'euronics.it',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, text) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = text;
        document.body.appendChild(div);
      }

      const metaAvailability = document.querySelector('#log_availabilityType');
      if (metaAvailability && metaAvailability.value == 'available') {
        addHiddenDiv('stock', 'In Stock');
      }

      document.querySelector('.productDetail__image').click();
      document.querySelectorAll('script').forEach(el => {
        const match = el.innerHTML.match(/\[\'upcean\'\, \'[0-9]+\'\]/);
        if (match && match.length) {
          addHiddenDiv('gtin', match[0].replace(/\D/g, ''));
        }
        console.log('match', match);
      });
    });
    return await context.extract(productDetails, { transform });
  },
};
