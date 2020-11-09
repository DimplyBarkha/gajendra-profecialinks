
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    transform: cleanUp,
    domain: 'boxed.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const isPopupPresent = document.querySelector('div[aria-label="Close modal"]');
      // @ts-ignore
      if (isPopupPresent) isPopupPresent.click();
      const productDetails = document.querySelector('a[data-tab-key="productDetails"]');
      // @ts-ignore
      if (productDetails) productDetails.click();

      function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      const dataFromJSON = document.querySelector('script[type*="json"]')
        ? document.querySelector('script[type*="json"]').textContent : '';
      const quantity = JSON.parse(dataFromJSON).disambiguatingDescription.split('-').filter(e => /\d/.test(e)).join(' ');
      addElementToDocument('quantity', quantity, '#');

      const brandLink = document.querySelector('section[data-bx="pdp-name"] a')
        ? document.querySelector('section[data-bx="pdp-name"] a') : null;
      const prefix = 'https://www.boxed.com';
      // @ts-ignore
      if (brandLink !== null) {
        // @ts-ignore
        const fullBrandLink = prefix.concat(brandLink.getAttribute('href'));
        addElementToDocument('brandLink', '', fullBrandLink);
      }

      const pricePerUnit = document.querySelector('div[class*="05d-less"]')
        ? document.querySelector('div[class*="05d-less"]').textContent.split('/')[0] : '';
      addElementToDocument('pricePerUnit', pricePerUnit);

      const pricePerUnitUom = document.querySelector('div[class*="05d-less"]')
        ? document.querySelector('div[class*="05d-less"]').textContent.split('/')[1] : '';
      if (pricePerUnitUom.indexOf('(')) {
        addElementToDocument('pricePerUnitUom', pricePerUnitUom.split('(')[0]);
      } else addElementToDocument('pricePerUnitUom', pricePerUnitUom);

      const promotion = document.querySelector('div[class*="05d-less"]')
        ? document.querySelector('div[class*="05d-less"]').textContent : '';
      addElementToDocument('promotion', promotion.substring(
        promotion.lastIndexOf('(') + 1,
        promotion.lastIndexOf(')'),
      ));

      const isAvailable = document.querySelector('section[class*="73e-less"] h2')
        ? document.querySelector('section[class*="73e-less"] h2') : null;
      // @ts-ignore
      if (isAvailable !== null && isAvailable.textContent === 'Out of Stock') {
        addElementToDocument('isAvailable', 'Out of Stock', 'No');
      } else {
        addElementToDocument('isAvailable', 'In Stock', 'Yes');
      }
    });

    await context.extract(productDetails);
  },
};
