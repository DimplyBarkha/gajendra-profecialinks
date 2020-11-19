const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  var isButtonPresent = await context.evaluate(async () => {
    return document.querySelector('button.pagine__more');
  });
  var productsAmount = await context.evaluate(async () => {
    return document.querySelectorAll('div[class="product-item__content"]')
      .length;
  });
  while (isButtonPresent && productsAmount < 2000) {
    await context.click('button.pagine__more');
    await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    isButtonPresent = await context.evaluate(async () => {
      return document.querySelector('button.pagine__more');
    });
    productsAmount = await context.evaluate(async () => {
      return document.querySelectorAll('div[class="product-item__content"]')
        .length;
    });
  }

  await context.evaluate(async () => {
    // scroll
    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    // scrolling
    // var rawNumber = document.querySelector(
    //   'div.pagine__count span.pagine__total'
    // )
    //   ? document.querySelector('div.pagine__count span.pagine__total')
    //       .textContent
    //   : document.querySelector('div.pagine__count span.pagine__number')
    //       .textContent;
    // var match = parseInt(rawNumber);
    var match = document.querySelectorAll('div[class="product-item__content"]')
      .length;

    let scrollTop = 0;
    const scrollLimit = match * 130;
    while (scrollTop <= scrollLimit) {
      await stall(500);
      scrollTop += 2000;
      window.scroll(0, scrollTop);
    }
  });

  await context.evaluate(async () => {
    // add prefix to product url routes
    var productUrl = document.querySelectorAll('a.gtmEventClick.product-item');
    var prefix = 'https://www.nocibe.fr';

    productUrl.forEach((element) => {
      element.setAttribute('href', prefix.concat(element.getAttribute('href')));
    });

    // convert percentage rating to number and then to string
    var rating = document.querySelectorAll('div.icons-stars-full');
    const regex = /\d+\.?\d+/gm;

    rating.forEach((element) => {
      var regArray = element.getAttribute('style').match(regex);
      var value = (parseInt(regArray[0]) * 5) / 100;

      element.setAttribute('rating', value.toString().replace('.', ','));
    });

    // add price
    var info = document.querySelectorAll('div[class="product-item__content"]');
    info.forEach((element) => {
      var obj = element.querySelector(
        '.product-item__price .product-item__only-price'
      )
        ? element.querySelector(
            '.product-item__price .product-item__only-price'
          ).textContent
        : element.querySelector(
            '.product-item__price .product-item__last-price'
          )
        ? element.querySelector(
            '.product-item__price .product-item__last-price'
          ).childNodes[2].nodeValue
        : '';
      element.setAttribute('price', obj);
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    transform: transform,
    domain: 'nocibe.fr',
    zipcode: '',
  },
  implementation,
};
