const {transform} = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mondoffice',
    transform,
    domain: 'mondoffice.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const {transform} = parameters;
    const {productDetails} = dependencies;
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const bread = document.querySelectorAll('.page-breadcrumb__item');
      if (bread) {
        addElementToDocument('breadCramb', '');
        const a = document.getElementById('breadCramb');
        for (let i = 0; i < bread.length; i++) {
          const newContent = document.createElement('p');
          newContent.innerHTML = bread[i].innerText;
          a.appendChild(newContent);
        }
      }
      addElementToDocument('url', location.href);
    });
    await context.waitForSelector('#breadCramb');
    return await context.extract(productDetails, {transform});
  },
};
