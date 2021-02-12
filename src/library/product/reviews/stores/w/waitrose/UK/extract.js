const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform,
    domain: 'waitrose.com',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productReviews }) => {
    // remove cookies popup
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const cookies = document.querySelector('div.acceptCookieCTA___NwqHh button');
      // @ts-ignore
      if (cookies) cookies.click();
    });

    await context.evaluate(async () => {
      // add productUrl
      var productUrl = window.location.href;
      if (productUrl !== null) {
        const element = document.createElement('a');
        element.id = 'productUrl';
        element.title = productUrl;
        element.style.display = 'none';
        document.body.appendChild(element);
      }
    });
    var data = await context.extract(productReviews, { transform });
    for (let k = 0; k < data.length; k++) {
      for (let i = 0; i < data[k].group.length; i++) {
        if ('sku' in data[k].group[i]) {
          data[k].group[i].sku[0].text = data[k].group[i].sku[0].text.split('/').pop().split('-')[0];
        }
      }
    }
    return data;
  },
};
