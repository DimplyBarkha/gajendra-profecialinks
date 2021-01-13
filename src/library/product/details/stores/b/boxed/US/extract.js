
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
      const descBullets = document.querySelector('article[class*="270b-less"] > p');
      // @ts-ignore
      if (descBullets !== null && descBullets.innerText.includes('•')) descBullets.setAttribute('bullets', descBullets.innerText.match(/•/g).length);
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

      const pricePerUnit = document.querySelector('div[class*="ba0e6-less"]');
      if (pricePerUnit !== null) addElementToDocument('pricePerUnit', pricePerUnit.textContent.split('/')[0]);

      const pricePerUnitUom = document.querySelector('div[class*="ba0e6-less"]');
      if (pricePerUnitUom !== null) {
        const unit = pricePerUnitUom.textContent.split('/')[1];
        if (unit.indexOf('(')) {
          addElementToDocument('pricePerUnitUom', unit.split('(')[0]);
        } else addElementToDocument('pricePerUnitUom', unit);
      }

      const promotion = document.querySelector('div[class*="05d-less"]')
        ? document.querySelector('div[class*="05d-less"]').textContent : '';
      addElementToDocument('promotion', promotion.substring(
        promotion.lastIndexOf('(') + 1,
        promotion.lastIndexOf(')'),
      ));

      const isAvailable = document.querySelector('section[class*="73e-less"] h2');

      if (isAvailable !== null && isAvailable.textContent === 'Out of Stock') addElementToDocument('isAvailable', 'Out Of Stock', 'No');
      if (isAvailable === null) addElementToDocument('isAvailable', 'In Stock', 'Yes');

      const sku = document.querySelector('meta#meta-og-url')
        ? document.querySelector('meta#meta-og-url').getAttribute('content') : '';
      const regex = /\/(\d+)\//;
      // @ts-ignore
      document.querySelector('body').setAttribute('sku', sku.match(regex)[1]);
      // sku.setAttribute('sku', sku.getAttribute('content').match(regex)[1]);
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

      const variantOptions = document.querySelectorAll('div[class*="g-form-option"] span[class*="c98d-less"]');
      // @ts-ignore
      if (variantOptions.length > 1) variantOptions[0].setAttribute('variantinfo', variantOptions[0].innerText);
      const couponText = document.querySelector('div[id*="couponId"] div[class*="e594"]');
      // @ts-ignore
      if (couponText !== null) couponText.setAttribute('coupon', couponText.innerText.split('\n').join(''));
    });

    var dataRef = await context.extract(productDetails);
    dataRef[0].group.forEach((row) => {
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text ? 'http://'.concat(item.text) : '';
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text ? 'http://'.concat(item.text) : '';
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text ? item.text.replace(/•/g, '||').split('\n').join('') : '';
        });
      }
      if (row.ingredientsList) {
        row.ingredientsList.forEach(item => {
          item.text = item.text ? item.text.split('\n').join('') : '';
        });
      }
    });
    return dataRef;
  },
};
