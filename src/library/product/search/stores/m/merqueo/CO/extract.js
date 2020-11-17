async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await context.evaluate(async () => {
    // scroll
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    do {
      await stall(1000);
      scrollTop += 380;
      window.scroll(0, scrollTop);
    } while (scrollTop <= window.innerHeight);
  });

  await context.evaluate(() => {
    const priceSelector = document.querySelectorAll('div[class="mq-product-prices"]');
    let price;
    const productUrlSelector = document.querySelectorAll('div[class="mq-product-img"]>div>a');
    let productUrl;
    const allProducts = productUrlSelector.length;

    for (let i = 0; i < allProducts; i++) {
      if (priceSelector[i]) {
        price = priceSelector[i].textContent.replace('.', ',');
      }

      if (productUrlSelector[i].href !== undefined && productUrlSelector[i].href !== null) {
        productUrl = productUrlSelector[i].href;
      }

      document.querySelectorAll('.mq-product-prices')[i].setAttribute('price', price);
      document.querySelectorAll('.mq-product-img>div>a')[i].setAttribute('producturl', productUrl);
      document.querySelectorAll('.mq-grid-item')[i].setAttribute('rank', `${i + 1}`);
    }
  });

  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    transform: null,
    domain: 'merqueo.com',
    zipcode: '',
  },
  implementation,
};
