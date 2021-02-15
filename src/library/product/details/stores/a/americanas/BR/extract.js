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

      const videoXp = '//script[contains(.,"video") and contains(.,"window.__APOLLO_STATE__")]';
      const jsonObj = document.evaluate(videoXp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const videoId = jsonObj && jsonObj.textContent.match(/"video":"[^,]+,/g) ? jsonObj.textContent.match(/"video":"[^,]+,/g)[0].replace(/"video":.*\\u002F/g, '').replace(/",/g, '') : '';
      if (videoId) addElementToDom('video', `http://www.youtube.com/embed/${videoId}`);

      const ratingXp = '//script[@type="application/ld+json"][contains(.,"ratingCount")]';
      const jsonRatingObj = document.evaluate(ratingXp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const ratingValue = jsonRatingObj && jsonRatingObj.textContent.match(/(?<=ratingValue":")(\d*)\.?(\d{0,1})\d*(?=")/g) ? jsonRatingObj.textContent.match(/(?<=ratingValue":")(\d*)\.?(\d{0,3})\d*(?=")/g)[0] : '';
      if (ratingValue) {
        const roundedRatingValue = parseFloat(ratingValue).toFixed(1).toString().replace('.', ',');
        addElementToDom('ratingValue', roundedRatingValue);
      }

      const specifications = document.querySelectorAll("table[class^='src__SpecsCell'] td");
      const specificationsArr = [];
      for (let i = 0; i < specifications.length; i++) {
        if (specificationsArr[i]) specificationsArr.push(specificationsArr[i].textContent);
      };
      addElementToDom('specifications', specificationsArr.join(' '));
    });
    await context.extract(productDetails);
  },
};
