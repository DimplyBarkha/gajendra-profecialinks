const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    // add search url
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    // convert percentage rating to number and then to string
    var rating = document.querySelectorAll('div[class="ratingInner"]');
    const regex = /\d+\.?(\d+)?%/gm;

    rating.forEach((element) => {
      var regArray = element.getAttribute('style').match(regex);
      var value = (parseInt(regArray[0]) * 5) / 100;

      element.setAttribute('rating', value.toString().replace('.', ','));
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'pharmasimple',
    transform: transform,
    domain: 'pharmasimple.com',
    zipcode: '',
  },
  implementation,
};
