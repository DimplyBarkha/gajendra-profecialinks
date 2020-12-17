const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'voila',
    transform,
    domain: 'voila.ca',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      const url = window.location.href;
      const sku = url.replace(/(.+)products\/(.+)\/details/g, '$2');
      if (sku) {
        document.body.setAttribute('sku', sku);
      }
      if (url) {
        document.body.setAttribute('url', url);
      }
      const imageData = window.__INITIAL_STATE__.data.products.productEntities;
      const imageArr = imageData[Object.keys(imageData)] && imageData[Object.keys(imageData)].images;
      if (imageArr && imageArr.length) {
        imageArr.forEach(element => {
          const newlink = document.createElement('a');
          newlink.setAttribute('class', 'image');
          newlink.setAttribute('href', element.src);
          document.body.appendChild(newlink);
        });
      }
      let bullets = document.evaluate(`//h2[contains(text(),'Product Features')]/following::div[1] | //h2[contains(text(),'Other Information')]/following::div[1]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      if (bullets) {
        let bulletsArray = bullets.textContent.split('- ');
        const table = document.createElement('table');
        document.body.appendChild(table);
        const tBody = document.createElement('tbody');
        table.appendChild(tBody);

        for (let index = 1; index < bulletsArray.length; index++) {
          const newlink = document.createElement('tr');
          newlink.setAttribute('class', 'bullets');
          newlink.setAttribute('bullets', bulletsArray[index]);
          tBody.appendChild(newlink);
        }
      }

      let ingredients = document.evaluate(`//h2[contains(text(),"Ingredients")]/following-sibling::div[1]`, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      if (ingredients) {
        let ingredientsValue = ingredients.textContent.replace('Ingredients: ', '');
        document.body.setAttribute('ingredients', ingredientsValue);
      }


    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
