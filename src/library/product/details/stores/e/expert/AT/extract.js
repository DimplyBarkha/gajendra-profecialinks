const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: transform,
    domain: 'expert.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let content = null;
    let image = null;

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate(async function () {
      return document.querySelector('iframe#loadbeeTabContent') ? document.querySelector('iframe#loadbeeTabContent').getAttribute('src') : null;
    });

    if (apiManufCall) {
      await context.goto(apiManufCall);
      // The code snippet below will be executed in the website's scope.
      await context.evaluate(async function () {
        console.log('hiiii');
        console.log(document.querySelector('h1.next-chapter'));
      });
      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        const imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('src'));
        });
        return imagesSrc.join(' || ');
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('ii_manufContent', content);
      addHiddenInfo('ii_manufImg', image);
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
