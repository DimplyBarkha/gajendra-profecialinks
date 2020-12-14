const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'GR',
    store: 'e-fresh',
    transform: cleanUp,
    domain: 'e-fresh.gr',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const JSONText = document.evaluate('//script[@type="application/ld+json"][contains(text(),"sku")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const JSONObject = JSONText ? JSON.parse(JSONText.textContent) : null;
      const imgResults = document.querySelectorAll('a[class="thumb-image"] img[alt]');
      for (let i = 1; i < imgResults.length; i++) {
        const img = imgResults[i] ? imgResults[i].getAttribute('src').replace(/thumbs\//g, '').replace(/-95x95_crop_thumb/g, '') : '';
        addElementToDocument('addImg', img);
      }
      const brand = JSONObject && JSONObject.brand ? JSONObject.brand.name : '';
      addElementToDocument('brand', brand);
      const gtin = JSONObject ? JSONObject.mpn : '';
      addElementToDocument('gtin', gtin);
      const aggregateRating = JSONObject && JSONObject.aggregateRating ? JSONObject.aggregateRating.ratingValue : '';
      addElementToDocument('aggregateRating', aggregateRating);
      const ratingCount = JSONObject && JSONObject.aggregateRating ? JSONObject.aggregateRating.ratingCount : '';
      addElementToDocument('ratingCount', ratingCount);
      const allergyArr = [];
      const allergens = document.querySelectorAll('div.ingredients strong');
      allergens.forEach(element => {
        allergyArr.push(element.textContent);
      });
      addElementToDocument('allergens', allergyArr.join(', '));
      const oldPrice = document.querySelector('div.product-wrap div[class="old_price"]') ? document.querySelector('div.product-wrap div[class="old_price"]').textContent.replace(',', '.').trim() : '';
      addElementToDocument('oldPrice', oldPrice);
      const price = document.querySelector('div.product-wrap div[class="price"]') ? document.querySelector('div.product-wrap div[class="price"]').textContent.replace(',', '.').trim() : '';
      addElementToDocument('addedPrice', price);
      const zoomIn = document.querySelector('div.img.zoom') ? 'Yes' : 'No';
      addElementToDocument('zoomIn', zoomIn);
    });
    await context.extract(productDetails, { transform });
  },
};
