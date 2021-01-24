const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    transform: null,
    domain: 'bcc.nl',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const pi = 18;
      const url = new URL(window.location.href);
      const index = url.searchParams.get('index') || 0;
      const page = (index / pi) + 1 || 1;
      const product = document.querySelectorAll('div.lister-product');
      for (let i = 0; i < product.length; i++) {
        const rank = (page * pi) - (pi - 1) + i;
        product[i].querySelector('h3.h2').setAttribute('rank', Math.round(rank));
        const rating = product[i].querySelector('div.rating');
        if (rating) {
          const rValue = rating.style.width.match(/[0-9]+/g) / 20;
          rating.setAttribute('rvalue', rValue);
        }
        if(fieldName.aggregateRating2) {
          let aggregateRatingValue = fieldName.aggregateRating2[0].text;
          let fixedNumber = Number(aggregateRatingValue).toFixed(1).toString().replace(/\./, ',');
          fieldName.aggregateRating2[0].text = `${fixedNumber}`;
        }

      }
    });
    return await context.extract(productDetails, { transform });
  },
};
