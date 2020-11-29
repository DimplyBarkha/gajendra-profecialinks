const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    transform,
    domain: 'eprice.it',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const specsArrSelector = document.querySelectorAll('div#anchorTech ul li');
      if (specsArrSelector) {
        const specsArr = [];
        for (let i = 0; i < specsArrSelector.length; i++) {
          specsArr.push(specsArrSelector[i].querySelector('span:nth-child(1)').innerText + ': ' + specsArrSelector[i].querySelector('span:nth-child(2)').innerText);
          addHiddenDiv('specsArr', specsArr[i]);
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
