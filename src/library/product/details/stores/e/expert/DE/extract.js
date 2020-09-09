const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
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

    async function addHiddenArrayList (elementID, value) {
      await context.evaluate(async function (elementID, value) {
        const htmlString = `<span style="display:none" id="added_${elementID}" ></span>`;
        const root = document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        document.querySelector(`#added_${elementID}`).innerHTML = innerHTML;
      }, elementID, value);
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
        console.log(document.querySelector('h1.next-chapter'));
      });
      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        let imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('src'));
        });
        // imagesSrc = imagesSrc.slice(0, imagesSrc.length - 1);
        return imagesSrc;
        // return imagesSrc.join(' || ');
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('ii_manufContent', content);
      if (image) {
        addHiddenArrayList('ii_manufImg', image);
        // image.forEach((element, index) => {
        //   addHiddenInfo('ii_manufImg'+index, element);
        // });
      }
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
