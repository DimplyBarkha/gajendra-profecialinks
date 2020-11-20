const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    transform: cleanUp,
    domain: 'salontopper.nl',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.innerText = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // video url
      const ytPrefix = 'https://www.youtube.com/watch?v=';
      const keyword = document.querySelector('a.thumb.youtube.active')
        ? document.querySelector('a[class*="thumb youtube"]').getAttribute('style').match(/vi\/(.*)\//)[1] : null;
      if (keyword !== null) addElementToDocument('videoUrl', ytPrefix.concat(keyword));

      // alternateImages
      const prefix = 'https://www.salontopper.nl';
      const alternateImages = document.querySelectorAll('a[class*="thumb"]:not(:first-child) img')
        ? document.querySelectorAll('a[class*="thumb"]:not(:first-child) img') : null;
      if (alternateImages !== null) alternateImages.forEach(e => addElementToDocument('alternateImages', prefix.concat(e.getAttribute('src'))));

      // adding availability
      const isAvailable = document.querySelector('meta[itemprop*="availability"][content*="InStock"]')
        ? document.querySelector('meta[itemprop*="availability"][content*="InStock"]').getAttribute('content') : null;
      if (isAvailable !== null) {
        addElementToDocument('isAvailable', 'In Stock');
      } else addElementToDocument('isAvailable', 'Out of Stock');

      // adding first variant
      // @ts-ignore
      const productIds = [...document.querySelectorAll('select[class="autoredirect"] option')].map(e => e.getAttribute('value').split('-').pop());
      const first = productIds[0];
      const finalRes = [];
      for (let i = 0; i < first.length; i++) {
        const substring = first.slice(0, first.length - i);
        const res = [];

        productIds.forEach(e => {
          if (e.includes(substring)) {
            res.push(true);
          } else res.push(false);
        });
        if (!res.includes(false)) {
          finalRes.push(substring);
        }
      }
      const firstVariant = finalRes.sort((a, b) => {
        return b.length - a.length;
      },
      )[0];
      addElementToDocument('firstVariant', firstVariant);
    });

    await context.extract(productDetails, { transform });
  },

};
