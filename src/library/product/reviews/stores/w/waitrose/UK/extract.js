/* eslint-disable no-shadow */
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
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      // remove cookies popup
      const cookies = document.querySelector('div.acceptCookieCTA___NwqHh button');
      // @ts-ignore
      if (cookies) cookies.click();

      // add product-specific fields
      const name = document.querySelector('#productName > span')
        ? document.querySelector('#productName > span').textContent
        : '';

      document.body.setAttribute('addedName', name);
      document.body.setAttribute('productUrl', window.location.href);

      const containers = document.querySelectorAll('ol li[itemprop="review"]');
      containers.forEach(container => {
        container.setAttribute('commentCount', container.querySelectorAll('div[class="bv-secondary-content-list"] li').length.toString());
      });
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
