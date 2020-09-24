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

      /*  if (JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[1].textContent.replace(/\s/g, '')).review != undefined) {
         ratingValue = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[1].textContent.replace(/\s/g, '')).review.reduce((acc, { reviewRating: { ratingValue } = {} }, i, arr) => acc + ratingValue / arr.length, 0).toFixed(1)
       } */

      let ratingValue = '';
      var reviews = document.querySelectorAll('script[type="application/ld+json"]')
      for (var i = 0; i < reviews.length; i++) {
        if (JSON.parse(reviews[i].textContent.replace(/\s/g, '')).review) {
          ratingValue = JSON.parse(reviews[i].textContent.replace(/\s/g, '')).review.reduce((acc, { reviewRating: { ratingValue } = {} }, i, arr) => acc + ratingValue / arr.length, 0).toFixed(1)
        }
      }

      console.log(ratingValue);

      ratingElem.innerText = ratingValue.toString().replace('.', ',')
      document.body.appendChild(ratingElem);

    });



    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
