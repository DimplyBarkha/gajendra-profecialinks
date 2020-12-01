const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petstock',
    transform: cleanUp,
    domain: 'petstock.com.au',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const domain = 'https://www.petstock.com.au';
      const images = document.querySelectorAll('img.etalage_source_image');
      const imgArr = [];
      for (let i = 1; i < images.length; i++) {
        const imgUrl = images[i].getAttribute('src');
        const img = `${domain}${imgUrl}`;
        imgArr.push(img);
      };
      addElementToDocument('imgUrl', imgArr.join(' | '));

      const name = document.querySelector('h1.product-name') ? document.querySelector('h1.product-name').textContent.trim() : '';
      const selectedLabel = document.querySelector('label.swatch.active') ? document.querySelector('label.swatch.active').textContent.trim() : '';
      const selectedTab = document.querySelector('div.items-rows div.active div.item-value') ? document.querySelector('div.items-rows div.active div.item-value').textContent.trim() : '';
      if (selectedLabel) addElementToDocument('nameExtended', `${name} ${selectedLabel}`);
      else if (selectedTab) addElementToDocument('nameExtended', `${name} ${selectedTab}`);
      else addElementToDocument('nameExtended', name);

      const availability = !document.querySelector('button[data-tracking=add-to-cart][disabled=disabled]') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availability', availability);

      const productUrl = window.location.href;
      const sku = productUrl.replace(/.*\/(\d+)/g, '$1');
      addElementToDocument('product-sku', sku);

      const ingredients = document.querySelector('a[href="#tab2"]') && document.querySelector('a[href="#tab2"]').textContent === 'Ingredients' && document.querySelector('div#tab2')
        ? document.querySelector('div#tab2').textContent : '';
      addElementToDocument('ingredients', ingredients);

      const scriptHTML = document.evaluate('//script[contains(text(),"skus")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const JSstring = scriptHTML && scriptHTML.textContent ? scriptHTML.textContent.split('var skus = ')[1].split(';')[0] : '';
      const idArr = JSstring ? JSstring.match(/id:\s\d+/g) : '';
      const skuArr = [];
      if (idArr.length !== 0) {
        for (let i = 0; i < idArr.length; i++) {
          const sku = idArr[i].replace(/[^\d+]/g, '');
          skuArr.push(sku);
        }
        addElementToDocument('variants-sku', skuArr.join(' | '));
        addElementToDocument('variants-count', `${skuArr.length}`);
      }

      const privacyPolicy = document.querySelector('a[href*="privacy-policy"]') ? 'Yes' : 'No';
      addElementToDocument('privacyPolicy', privacyPolicy);

      const customerService = document.querySelector('a[href*="customer-service"]') ? 'Yes' : 'No';
      addElementToDocument('customerService', customerService);
    });
    await context.extract(productDetails, { transform });
  },
};
