
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'hudsonsbay',
    transform: null,
    domain: 'thebay.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      if (document.querySelector('#consent-close')) {
        document.querySelector('#consent-close').click();
      }
      function addElementToDocument (doc, key, value) {
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
      // let element = document.querySelectorAll('div.product.bfx-disable-product.standard');
      // element = element[element.length - 1];
      // if (element) {
      //   element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      //   await new Promise((resolve) => setTimeout(resolve, 10000));
      //   element = document.querySelectorAll('div.product.bfx-disable-product.standard');
      //   console.log('-----------------', element.length);
      // }
    });
    return await context.extract(productDetails);
  },
};
