const { transform } = require('../../../../../search/shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function getElements () {
      return document.querySelectorAll('div[data-box-name="Items Container"] [data-item="true"]');
    }

    const elements = getElements();
    if (elements.length) {
      for (var i = 0; i < elements.length; i++) {
        try {
          elements[i].scrollIntoView();
          await stall(1500);
          const imageUrl = getElements()[i].querySelector(
            'a[rel=\'nofollow\'] img, ul li:nth-child(1) img',
          );
          console.log(elements[i]);
          const data = {
            productUrl: elements[i].querySelector('h2>a').getAttribute('href'),
            thumbnail: imageUrl.getAttribute('src'),
            name: elements[i].querySelector('h2>a[href]').textContent,
            id: elements[i].getAttribute('data-analytics-view-value'),
            price: elements[i].querySelector('span._1svub').textContent,
            nameExtended: elements[i].querySelector('h2>a').textContent,
            sponsored: getSponcered(elements[i]),
          };
          appendElement(elements[i], data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    function getSponcered(element) {
      let value = element.getAttribute('data-analytics-view-custom-index0');
      let isSponsored = element.getAttribute('data-analytics-view-label');
      if (value && isSponsored) {
        return element.getAttribute('data-analytics-view-label');
      }
    }

    function appendElement (node, data) {
      console.log(data);
      const div = document.createElement('div');
      div.classList.add('products');
      for (const key in data) {
        if (data[key]) {
          div.setAttribute(key, data[key]);
        }
      }
      document.body.appendChild(div);
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation,
};
