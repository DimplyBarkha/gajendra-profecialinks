const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'abt',
    transform: cleanUp,
    domain: 'abt.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const description = document.querySelector('div#overview_content')
        // @ts-ignore
        ? document.querySelector('div#overview_content').innerText : '';
      if (description) {
        addElementToDocument('description', description.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      }
      const shippingInfo = document.querySelector('div#product_shipping_container')
      // @ts-ignore
        ? document.querySelector('div#product_shipping_container').innerText : '';
      if (shippingInfo) {
        addElementToDocument('shippingInfo', shippingInfo.replace(/•/g, '||').replace(/\n|\s{2,}/g, ' '));
      }

      const variants = document.querySelector('div.display-group-color');
      const variantColor = variants && document.querySelector('div.display-group-color strong')
        // @ts-ignore
        ? document.querySelector('div.display-group-color strong').innerText : '';
      const specColorXpath = document.evaluate('//table[@id="specs_table"]//strong[text()="Color"]/../following-sibling::td[1]', document, null, XPathResult.STRING_TYPE, null);
      const specColor = specColorXpath ? specColorXpath.stringValue : '';
      const descColorXpath = document.evaluate('//li[strong[text()="Color:"]]/text()', document, null, XPathResult.STRING_TYPE, null);
      const descColor = descColorXpath ? descColorXpath.stringValue : '';
      if (variantColor) {
        addElementToDocument('color', variantColor);
      } else if (specColor) {
        addElementToDocument('color', specColor);
      } else {
        addElementToDocument('color', descColor);
      }
    });
    await context.extract(productDetails);
  },
};
