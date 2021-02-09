const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    for (let i = 0; i <= document.body.scrollHeight; i = i + 500) {
      window.scrollBy({ top: i, left: 0, behavior: 'smooth' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    // add search url
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    // add price
    var prices = document.querySelectorAll('a[class="productPrice"]');

    prices.forEach((element) => {
      let price = null;
      if (element.querySelector('dd[class="productPrice"')) {
        price = element.querySelector('dd[class="productPrice"').textContent;
      } else if (element.querySelector('dd[class="productNowPrice"')) {
        price = element.querySelector('dd[class="productNowPrice"').textContent;
      } else if (element.querySelector('span[class="priceRangeWasValue"]')) {
        price = element.querySelector('span[class="priceRangeWasValue"]').textContent;
      } else if (element.querySelector('dd[class="productPrice"]')) {
        price = element.querySelector('dd[class="productPrice"]').textContent;
      }

      if (price) {
        price = price.replace(/(\r\n|\n|\r)/gm, '');
        const results = price.match(/.\d+\.?(\d+)?/gm);

        if (results[0]) {
          element.setAttribute('price', results[0].toString());
        }
      }
    });

    // add rank
    var products = document.querySelectorAll(
      'ul[class="productList"] div[class="productInfo"]');

    products.forEach((element, index) => {
      element.setAttribute('rank', (index + 1).toString());
    });
  });

  // await context.evaluate(async () => {


  // add id
  // var ids = document.querySelectorAll('a[class="productMainImage"]');
  // ids.forEach((element) => {
  //   const imgSrc = element.querySelector('img').getAttribute('src');
  //   const regex = /(?<=very\/)(.*)(?=_SQ)/g;
  //   const id = imgSrc.match(regex).toString();
  //   if (id) {
  //     element.setAttribute('id', id);
  //   }
  // });
  // });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'very',
    transform: transform,
    domain: 'very.co.uk',
    zipcode: '',
  },
  implementation,
};
