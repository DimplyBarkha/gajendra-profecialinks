const { transform } = require('./../shared')

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    transform,
    domain: 'basler-beauty.at',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {

      const ratingElem = document.createElement('div');
      ratingElem.id = 'ratingInfo';
      
      let ratingValue = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[1].textContent.replace(/\s/g, '')).review.reduce((acc, { reviewRating: { ratingValue } = {} }, i, arr) => acc + ratingValue / arr.length, 0).toFixed(1)
      
      ratingElem.innerText = ratingValue.toString().replace('.', ',')
      document.body.appendChild(ratingElem);

    });



    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
