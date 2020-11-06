const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'viking',
    transform: cleanUp,
    domain: 'viking-direct.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const availability = document.querySelector('div#productDetailsPanel div.product-add-to-cart-panel') && document.querySelector('div#productDetailsPanel div.product-add-to-cart-panel').getAttribute('data-stock-status') === 'inStock' ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);
      const pdfPresent = document.querySelector('a.product-attachments-table__link') ? 'Yes' : 'No';
      addElementToDocument('pdfPresent', pdfPresent);

      const alternateImages = document.querySelectorAll('div#s7viewer_swatches_listbox div.s7thumb');
      for (let i = 1; i < alternateImages.length; i++) {
        const img = alternateImages[i].getAttribute('style').replace(/.*url\("(https.*\?).*/g, '$1');
        addElementToDocument('img', img);
      }
    });

    await context.extract(productDetails, { transform });
  },
};
