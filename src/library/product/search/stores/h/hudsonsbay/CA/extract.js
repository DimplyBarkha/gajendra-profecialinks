const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    transform,
    domain: 'thebay.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      if (document.querySelector('#consent-close')) {
        document.querySelector('#consent-close').click();
      }
      function addElementToDocument(doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }

      const searchUrl = window.location.href;
      const productList = document.querySelectorAll('div.image-container a');

      productList && productList.forEach((item1) => {
        const doc = item1;
        addElementToDocument(doc, 'searchUrl', searchUrl);
      });


      await new Promise((resolve) => setTimeout(resolve, 5000));

      async function infiniteScroll() {
          let prevScroll = document.documentElement.scrollTop;
          while (true) {
              window.scrollBy(0, document.documentElement.clientHeight);
              await new Promise(resolve => setTimeout(resolve, 1000));
              const currentScroll = document.documentElement.scrollTop;
              if (currentScroll === prevScroll) {
                  break;
              }
              prevScroll = currentScroll;
          }
      }
      await infiniteScroll();
      await new Promise((resolve) => setTimeout(resolve, 8000));

    });

    return await context.extract(productDetails, { transform });
  },
};
