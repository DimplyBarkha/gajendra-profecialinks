const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    transform,
    domain: 'basler-beauty.at',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const searchUrl = window.location.href;
      addElementToDocument('searchUrl', searchUrl);
    });
    const dataRef = await context.extract(productDetails, { transform });
    for (const { group } of dataRef) {
      for (const row of group) {
        if (row.aggregateRating2) {
          let rating = 0;
          row.aggregateRating2.forEach(item => {
            console.log(item.text);
            if (item.text === 'fa fa-star rating-star-filled') {
              rating = rating + 1;
            } else if (item.text === 'fa fa-star-half-o rating-star-filled') {
              rating = rating + 0.5;
            }
          });
          const text = rating.toString().replace('.', ',');
          row.aggregateRating2 = [{ text }];
        }
        if (row.price) {
          const priceArr = row.price[0].text.split(' ');
          if (priceArr.length > 2) {
            row.price[0].text = priceArr[1] + ' ' + priceArr[2];
          }
        }
      }
    }
    return dataRef;
  },
};
