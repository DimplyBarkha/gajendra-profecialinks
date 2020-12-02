const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    transform: cleanUp,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      const productScript = document.querySelector('script[type="application/ld+json"]:not([id]):not([data-component-id])')
        ? document.querySelector('script[type="application/ld+json"]:not([id]):not([data-component-id])').textContent
        : '{}';
      const productObj = JSON.parse(productScript);

      const name = document.querySelector('div.pdp-header h1>span[data-test="title"]') ? document.querySelector('div.pdp-header h1>span[data-test="title"]').textContent.trim() : '';
      const brandElem = document.querySelector('a[data-role="BRAND"]');
      const brand = brandElem ? brandElem.textContent.trim() : '';
      const nameExtended = [name];
      if (!name.toLowerCase().startsWith(brand.toLowerCase()) && !brand.toLowerCase().includes('merkloos')) nameExtended.unshift(brand);
      const availabilityText = productObj.offers ? productObj.offers.availability : '';
      const ratingCount = productObj.aggregateRating && productObj.aggregateRating.reviewCount ? productObj.aggregateRating.reviewCount : '';
      const aggregateRating = productObj.aggregateRating && productObj.aggregateRating.ratingValue ? productObj.aggregateRating.ratingValue : '';

      addElementToDocument('product_url', window.location.href);
      addElementToDocument('name_extended', nameExtended.join(' - '));
      addElementToDocument('availability_text', availabilityText);
      addElementToDocument('price', `${productObj.offers.price} ${productObj.offers.priceCurrency}`);
      addElementToDocument('rating_count', ratingCount);
      addElementToDocument('aggregate_rating', aggregateRating);
      addElementToDocument('brand', !brand.toLowerCase().includes('merkloos') ? brand : '');
      addElementToDocument('brand_link', !brand.toLowerCase().includes('merkloos') ? brandElem.getAttribute('href') : '');
    });
    await context.extract(productDetails, { transform });
  },
};
