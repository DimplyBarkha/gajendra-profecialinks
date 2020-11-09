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

       let ratingValue = '';
       var reviews = document.querySelectorAll('script[type="application/ld+json"]')
       for (var i = 0; i < reviews.length; i++) {
         try {
         var jsonData = JSON.parse(reviews[i].textContent.replace(/\\n/g, "\\n")
           .replace(/\\'/g, "\\'")
           .replace(/"`dyson`"/g, 'dyson')
           .replace(/\\"/g, '\\"')
           .replace(/\\&/g, "\\&")
           .replace(/\\r/g, "\\r")
           .replace(/\\t/g, "\\t")
           .replace(/\\b/g, "\\b")
           .replace(/\\f/g, "\\f")
           .replace(/\s/g, '').replace(/[\u0000-\u0019]+/g, ""));
 
         if (jsonData.review) {
           ratingValue = jsonData.review.reduce((acc, { reviewRating: { ratingValue } = {} }, i, arr) => acc + ratingValue / arr.length, 0).toFixed(1)
         }
       }
      
      catch(error){
      console.log(error)
      }
    }

      ratingElem.innerText = ratingValue.toString().replace('.', ',')
      document.body.appendChild(ratingElem);

    });
    
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
