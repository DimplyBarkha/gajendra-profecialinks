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
      // rating
      const ratingValue = document.querySelector('meta[itemprop="ratingValue"]');
      if (ratingValue !== null) ratingValue.setAttribute('ratingValue', ratingValue.getAttribute('content').replace('.', ','));
      // video url
      const ytPrefix = 'https://www.youtube.com/watch?v=';
      const keyword = document.querySelector('a[class*="thumb youtube"]')
        ? document.querySelector('a[class*="thumb youtube"]').getAttribute('style').match(/vi\/(.*)\//)[1] : null;
      if (keyword !== null) addElementToDocument('videoUrl', ytPrefix.concat(keyword));

      // alternateImages
      const prefix = 'https://www.salontopper.nl';
      const alternateImages = document.querySelectorAll('a[class*="thumb"]:not(:first-child) img')
        ? document.querySelectorAll('a[class*="thumb"]:not(:first-child) img') : null;
      if (alternateImages !== null) alternateImages.forEach(e => addElementToDocument('alternateImages', prefix.concat(e.getAttribute('src'))));

      // brandLink
      const brandLink = document.querySelector('div.accordion-content li a[href*="/merken/"]')
        ? document.querySelector('div.accordion-content li a[href*="/merken/"]') : null;
      if (brandLink !== null) addElementToDocument('brandLink', prefix.concat(brandLink.getAttribute('href')));

      // adding availability
      const isAvailable = document.querySelector('meta[itemprop*="availability"][content*="InStock"]')
        ? document.querySelector('meta[itemprop*="availability"][content*="InStock"]').getAttribute('content') : null;
      if (isAvailable !== null) {
        addElementToDocument('isAvailable', 'In Stock');
      } else addElementToDocument('isAvailable', 'Out of Stock');

      const isVariants = document.querySelector('select.autoredirect');
      const firstVariant = document.querySelector('meta[itemprop="mpn"]')
        ? document.querySelector('meta[itemprop="mpn"]').getAttribute('content') : '';
      if (isVariants !== null) addElementToDocument('firstVariant', firstVariant);
    });
    var dataRef = await context.extract(productDetails, { transform });
    dataRef[0].group.forEach((row) => {
      if (row.variantInformation) {
        row.variantInformation.forEach(item => {
          item.text = item.text ? item.text.trim() : '';
        });
      }
      if (row.variants) {
        row.variants.forEach(item => {
          item.text = item.text.includes('variant') ? item.text.split('variant: ').join('') : item.text;
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.includes('variant') ? item.text.split('variant: ').pop() : item.text;
        });
      }
    });

    return dataRef;
    // await context.extract(productDetails, { transform });
  },

};
