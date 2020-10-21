const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    transform,
    domain: 'dns-shop.ru',
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
      const sideTabs = document.querySelectorAll('a.product-card-tabs__title');
      if (sideTabs) {
        for (let i = 0; i < sideTabs.length; i++) {
          if (sideTabs[i].innerText === 'Характеристики') {
            sideTabs[i].click();
          }
        }
      }
    });
    try {
      await context.waitForSelector('div.product-characteristics');
      await context.evaluate(async () => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const specsArrSelector = document.querySelectorAll('div.product-characteristics table tr');
        if (specsArrSelector) {
          const specsArr = [];
          for (let i = 0; i < specsArrSelector.length; i++) {
            if (specsArrSelector[i].querySelector('td:nth-child(2)')) {
              specsArr[i] = (specsArrSelector[i].querySelector('td:nth-child(1)').innerText + ': ' + specsArrSelector[i].querySelector('td:nth-child(2)').innerText);
            }
            addHiddenDiv('specsArr', specsArr[i]);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }

    return await context.extract(productDetails, { transform });
  },
};
