const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'officemag',
    transform,
    domain: 'officemag.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const products = document.querySelectorAll('div.Content__group ul.listItems>li');
      products.forEach(product => {
        const starsStyleWidth = product.querySelector('span[class="Score__fill"]').getAttribute('style');
        const starValue = Number(starsStyleWidth.match(/(\d+.\d+)/g)) / 20;
        const ratingAttribute = starValue.toFixed(1).replace('.', ',');
        product.setAttribute('rating', ratingAttribute);
        const productDataObject = JSON.parse(product.getAttribute('data-ga-obj'));
        for (const property in productDataObject) {
          if (property === 'price') {
            productDataObject[property] = productDataObject[property].replace('.', ',');
          }
          product.setAttribute(property, productDataObject[property]);
        }
      });
      const searchUrl = window.location.href.replace('%20', ' ');
      const lastPageUrl = document.querySelector('div#search-url');
      if (lastPageUrl) {
        // @ts-ignore
        lastPageUrl.innerText = searchUrl;
      } else {
        const hiddenSearchDiv = document.createElement('div');
        hiddenSearchDiv.id = 'search-url';
        hiddenSearchDiv.style.display = 'none';
        hiddenSearchDiv.textContent = searchUrl;
        document.body.appendChild(hiddenSearchDiv);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
