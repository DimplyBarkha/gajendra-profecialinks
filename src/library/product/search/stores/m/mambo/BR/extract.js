const { transform } = require('./format');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.waitForSelector('.CC-searchCountFiltros .CC-count span');
  const flag = await context.evaluate(async function () {
    const numberOfProducts = document.querySelector('.CC-searchCountFiltros .CC-count span') ? document.querySelector('.CC-searchCountFiltros .CC-count span').innerText : '';
    let number = 0;
    if (numberOfProducts !== '') {
      if (numberOfProducts.includes('.')) {
        const length = numberOfProducts.length;
        const index = numberOfProducts.indexOf('.');
        const separatorMultiply = Math.pow(10, length - 1 - index);
        number = parseFloat(numberOfProducts) * separatorMultiply;
      } else {
        number = parseInt(numberOfProducts);
      }
    }
    if (number > 12) return true;
    else return false;
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
      if (!btn) await await context.reload();
    } while (!btn && counter < 4);
    const numberOfProducts = await context.evaluate(async function () {
      const numberOfProducts = document.querySelector('.CC-searchCountFiltros .CC-count span') ? document.querySelector('.CC-searchCountFiltros .CC-count span').innerText : '';
      let number = 0;
      if (numberOfProducts !== '') {
        if (numberOfProducts.includes('.')) {
          const length = numberOfProducts.length;
          const index = numberOfProducts.indexOf('.');
          const separatorMultiply = Math.pow(10, length - 1 - index);
          number = parseFloat(numberOfProducts) * separatorMultiply;
        } else {
          number = parseInt(numberOfProducts);
        }
      }
      if (number >= 150) return 150;
      else return number;
    });

    let numberOfSeenProducts;

    do {
      numberOfSeenProducts = await context.evaluate(async function () {
        await new Promise((resolve, reject) => setTimeout(resolve, 100));
        return document.querySelector('.CC-shelf.shelf-block .shelf-product') ? document.querySelectorAll('.CC-shelf.shelf-block .shelf-product').length : 0;
      });
      btn = await context.evaluate(async function () {
        const btn = document.querySelector('.CC-seeMore button');
        if (btn) return true;
        else return false;
      });
      if (btn) await context.click('.CC-seeMore button');
    } while (numberOfProducts > numberOfSeenProducts && btn);
  }

  await context.evaluate(async function () {
    // function checkForProducts (selectorForProducts) {
    //   return document.querySelector(selectorForProducts) ? document.querySelectorAll(selectorForProducts).length : 0;
    // }
    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    // function scrollBy(number) {
    //   const height = window.scrollY;
    //   window.scrollTo(0, height + number);
    // }
    // const numberOfProducts = document.querySelector(".CC-searchCountFiltros .CC-count span") ? document.querySelector(".CC-searchCountFiltros .CC-count span").innerText : "";
    // let number = 0;
    // if (numberOfProducts !== "") {
    //   if (numberOfProducts.includes(".")) {
    //     const length = numberOfProducts.length;
    //     const index = numberOfProducts.indexOf(".");
    //     const separatorMultiply = Math.pow(10, length - 1 - index);
    //     number = parseFloat(numberOfProducts) * separatorMultiply;
    //   } else {
    //     number = parseInt(numberOfProducts);
    //   }
    // }
    // if (number >= 150) number = 150;
    // const loadMoreBtn = document.querySelector(".CC-seeMore button") ? document.querySelector(".CC-seeMore button") : null;
    // if (number > 0 && loadMoreBtn) {
    //   let numberOfSeenProducts;
    //   do {
    //     loadMoreBtn.click();
    //     await new Promise((resolve, reject) => setTimeout(resolve, 10000));
    //     numberOfSeenProducts = checkForProducts(".CC-shelf.shelf-block .shelf-product");
    //   } while (number > numberOfSeenProducts);
    // }
    const productCards = document.querySelector('.CC-shelf.shelf-block .shelf-product') ? document.querySelectorAll('.CC-shelf.shelf-block .shelf-product') : [];
    if (productCards.length) {
      for (let i = 0; i < productCards.length; i++) {
        addProp('.CC-shelf.shelf-block .shelf-product', i, 'rank-organic', `${i + 1}`);
        const productImage = productCards[i].querySelector('.shelf-image img').getAttribute('src').trim().replace(/ /g, '%20');
        addProp('.CC-shelf.shelf-block .shelf-product', i, 'image-url', productImage);
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
