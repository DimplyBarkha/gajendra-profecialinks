
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
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    await context.evaluate(async function () {
      function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const quantitySecond = document.evaluate('//span[contains(@class, "a8ac-less")]/following-sibling::text()[1]', document, null, XPathResult.STRING_TYPE).stringValue;
      const quantityFirst = document.evaluate('//span[contains(@class, "a8ac-less")]/preceding-sibling::text()[1]', document, null, XPathResult.STRING_TYPE).stringValue;
      if (quantitySecond) addElementToDocument('quantity', quantitySecond, '#');
      if (!quantitySecond) addElementToDocument('quantity', quantityFirst, '#');

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
      const sku = document.querySelector('meta#meta-og-url')
        ? document.querySelector('meta#meta-og-url') : '';
      const regex = /\/(\d+)\//;
      // @ts-ignore
      sku.setAttribute('sku', sku.getAttribute('content').match(regex)[1]);
      const allImages = document.querySelectorAll("div>a[aria-label*='Slide']")
        ? document.querySelectorAll("div>a[aria-label*='Slide']") : null;
      if (allImages !== null && allImages.length !== undefined) {
        for (let i = 0; i < allImages.length; i++) {
          // @ts-ignore
          allImages[i].click();
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (i !== 0) {
            const regex = /vpc.*/;
            const currentImage = document.querySelector(`div[data-index='${i}'] img[alt*='Product image']`);
            addElementToDocument(`addedImage${i}`, currentImage.getAttribute('src').match(regex)[0]);
          }
        }
      }
      const terms = document.querySelector('a[href*="terms-conditions"]')
        ? document.querySelector('a[href*="terms-conditions"]') : null;
      if (terms.textContent.includes('Terms')) {
        terms.setAttribute('terms', 'Yes');
      } else terms.setAttribute('terms', 'No');
      const policy = document.querySelector('a[href*="privacy-policy"]')
        ? document.querySelector('a[href*="privacy-policy"]') : null;
      if (policy.textContent.includes('Policy')) {
        policy.setAttribute('policy', 'Yes');
      } else policy.setAttribute('policy', 'No');

      const couponText = document.querySelector('div[id*="couponId"] div[class*="e594"]')
        ? document.querySelector('div[id*="couponId"] div[class*="e594"]') : null;
      // @ts-ignore
      if (couponText !== null) couponText.setAttribute('coupon', couponText.textContent.split(' ').filter(e => e !== 'Details').join(' '));
    });

    await context.extract(productDetails);
  },
};
