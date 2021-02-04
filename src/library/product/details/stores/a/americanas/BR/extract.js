const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'americanas',
    transform: cleanUp,
    domain: 'americanas.com.br',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom (id, element) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      }

      const productUrl = window.location.href;
      addElementToDom(productUrl, 'productUrl');

      const availabilityText = document.querySelector('a#buy-button') ? 'In Stock' : 'Out Of Stock';
      addElementToDom('availabilityText', availabilityText);

      const xp = '//script[contains(.,"video") and contains(.,"window.__APOLLO_STATE__")]';
      const jsonObj = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const videoId = jsonObj ? jsonObj.textContent.replace(/^.*video":"(?=)/g, '').replace(/",(?<=",).*/g, '').replace(/^.*\\u002F/g, '') : '';
      addElementToDom('video', `http://www.youtube.com/embed/${videoId}`);

      const specifications = document.querySelectorAll("table[class^='src__SpecsCell'] td");
      const specificationsArr = [];
      for (let i = 0; i < specifications.length; i++) {
        specificationsArr.push(specificationsArr[i].textContent);
      };
      addElementToDom('specifications', specificationsArr.join(' '));
    });
    await context.extract(productDetails);
  },
};
