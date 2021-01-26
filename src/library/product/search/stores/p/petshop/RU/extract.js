const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'petshop',
    transform,
    domain: 'petshop.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForSelector('article.article-catalogue:not([style])');
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
    const extractedData = await context.extract(productDetails, { transform });

    extractedData.forEach(page => {
      page.group.forEach(row => {
        if (row.aggregateRating2 && row.aggregateRating2[0].text.includes('.')) {
          row.aggregateRating2[0].text = row.aggregateRating2[0].text.replace('.', ',');
        }
      });
    });

    return extractedData;
  },
};
