const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // await context.click('i.widget-Popup--close')
    await context.evaluate(() => {
      if (document.querySelector('.widget-Popup--container-outer---view-popup')) {
        document.querySelector('.widget-Popup--container-outer---view-popup').click();
      }
      if (document.querySelector('i.widget-Popup--close')) {
        document.querySelector('i.widget-Popup--close').click();
      }

      function addHiddenDiv (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      addHiddenDiv('iio_product_url', window.location.href);
    });

    return await context.extract(productDetails, { transform: transformParam });
  },
};
