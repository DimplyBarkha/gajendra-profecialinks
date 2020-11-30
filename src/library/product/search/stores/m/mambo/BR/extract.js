const { transform } = require('./format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForSelector('.CC-searchCountFiltros .CC-count span');

  const flag = await context.evaluate(async function () {
    const numberOfProducts = document.querySelector('.CC-searchCountFiltros .CC-count span')
      ? parseInt(document.querySelector('.CC-searchCountFiltros .CC-count span').innerText)
      : 0;
    if (numberOfProducts > 12) return true;
    else return false;
  });

  const url = await context.evaluate(async function () {
    return window.location.href;
  });

  if (flag) {
    let counter = 0;
    let btn;
    do {
      btn = await context.evaluate(async function () {
        const btn = document.querySelector('.CC-seeMore button');
        if (btn) return true;
        else return false;
      });
      counter++;

      if (!btn) await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
    } while (!btn && counter < 4);
  }

  await context.evaluate(async function () {
    function checkForProducts (selectorForProducts) {
      return document.querySelector(selectorForProducts) ? document.querySelectorAll(selectorForProducts).length : 0;
    }

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }

    // function scrollBy(number) {
    //   const height = window.scrollY;
    //   window.scrollTo(0, height + number);
    // }

    const numberOfProducts = document.querySelector('.CC-searchCountFiltros .CC-count span')
      ? parseInt(document.querySelector('.CC-searchCountFiltros .CC-count span').innerText)
      : 0;
    const loadMoreBtn = document.querySelector('.CC-seeMore button') ? document.querySelector('.CC-seeMore button') : null;
    if (numberOfProducts > 0 && loadMoreBtn) {
      let numberOfSeenProducts;
      do {
        loadMoreBtn.click();
        await new Promise((resolve, reject) => setTimeout(resolve, 100));
        numberOfSeenProducts = checkForProducts('.CC-shelf.shelf-block .shelf-product');
      } while (numberOfProducts !== numberOfSeenProducts);
    }
    const productCards = document.querySelector('.CC-shelf.shelf-block .shelf-product') ? document.querySelectorAll('.CC-shelf.shelf-block .shelf-product') : [];
    if (productCards.length) {
      for (let i = 0; i < productCards.length; i++) {
        addProp('.CC-shelf.shelf-block .shelf-product', i, 'rank-organic', `${i + 1}`);
        const productImage = productCards[i].querySelector('.shelf-image img').getAttribute('src').replace(/ /g, '%20');
        productCards[i].setAttribute('data-product-image-url', productImage);
      }
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'mambo',
    transform,
    domain: 'mambo.com.br',
    zipcode: '',
  },
  implementation,
};
