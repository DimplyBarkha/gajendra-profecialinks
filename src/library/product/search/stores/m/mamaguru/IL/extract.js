const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IL',
    store: 'mamaguru',
    transform: transform,
    domain: 'mamaguru.co.il',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    await context.evaluate(async function () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const arr = document.querySelectorAll('div.TextDetails');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].innerHTML.indexOf('https://www.mamaguru.co.il/css/images/RateHeartS.png') !== -1) {
          const count = (arr[i].innerHTML.match(/RateHeartS/g) || []).length;
          addElementToDocument(arr[i], 'added_aggregate_rating', count);
        }
      }
    });
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },

};
