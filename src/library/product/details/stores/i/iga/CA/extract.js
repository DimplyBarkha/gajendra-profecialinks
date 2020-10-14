
const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'iga',
    transform,
    domain: 'iga.net',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const catNode = document.querySelectorAll('ul.breadcrumb li');
      if (catNode && catNode.length) {
        const catParent = document.createElement('div');
        catParent.id = 'product-breadcrumb';
        catNode.forEach((ele) => {
          const catChild = document.createElement('span');
          catChild.innerText = ele.innerText;
          catParent.appendChild(catChild);
        });
        document.body.appendChild(catParent);
      }
      // function addHiddenDiv (id, content) {
      //   const newDiv = document.createElement('div');
      //   newDiv.id = id;
      //   newDiv.textContent = content;
      //   newDiv.style.display = 'none';
      //   document.body.appendChild(newDiv);
      // }
    });
    return await context.extract(productDetails, { transform });
  },
};
