
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    transform: null,
    domain: 'expert.ie',
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
      if (document.querySelector('iframe#loadbeeTabContent')) {
        return document.querySelector('iframe#loadbeeTabContent').getAttribute('src');
      } else if (document.querySelector('iframe#eky-dyson-iframe')) {
        return document.querySelector('iframe#eky-dyson-iframe').getAttribute('src');
      }

      return null;
    });

    if (apiManufCall) {
      await context.goto(apiManufCall);
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
