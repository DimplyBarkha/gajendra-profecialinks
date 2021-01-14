const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'bipa',
    transform,
    domain: 'bipa.at',
  },
  implementation: async (
    { url },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(async () => {
      const addAggRating = () => {
        const rating = document.querySelector('span[itemprop="ratingValue"]');
        if (rating) {
          const regex = /(\d+)(.)(\d+)/;
          let ratingText = rating.textContent.match(regex)[0];
          ratingText = ratingText.replace('.', ',');
          rating.setAttribute('ratingFormatted', ratingText);
        }
      };
      await addAggRating();
      const zoom = document.querySelector('.magnifyframe');

      if (zoom) {
        zoom.setAttribute('zoom', 'yes');
      }
    });
    await context.extract(productDetails, { transform });
  },
};
