const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  await context.evaluate(async function () {
    const showMore = document.querySelector('section#brandLanding > div > a[class="ems-head__cta"]');
    if (showMore !== null) {
      // @ts-ignore
      showMore.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1000));
  var isButtonPresent = await context.evaluate(async () => {
    return document.querySelector('button.pagine__more');
  });
  var productsAmount = await context.evaluate(async () => {
    return document.querySelectorAll('div[class="product-item__content"]')
      .length;
  });
  while (isButtonPresent && productsAmount < 150) {
    await context.click('button.pagine__more');
    // @ts-ignore
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
    function stall (ms) {
      // @ts-ignore
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

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
    // name
    var names = document.querySelectorAll('.product-item__infos-inner');
    names.forEach(e => {
      const name = [];
      const main = e.querySelector('.product-item__name')
        // @ts-ignore
        ? e.querySelector('.product-item__name').innerText : null;
      const subName = e.querySelector('.product-item__subname')
        // @ts-ignore
        ? e.querySelector('.product-item__subname').innerText : null;
      if (main !== null) name.push(main);
      if (subName !== null) name.push(subName);
      e.setAttribute('fullname', name.join(' '));
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
        '.product-item__price .product-item__only-price',
      )
        ? element.querySelector(
          '.product-item__price .product-item__only-price',
        ).textContent
        : element.querySelector(
          '.product-item__price .product-item__last-price',
        )
          ? element.querySelector(
            '.product-item__price .product-item__last-price',
          ).childNodes[2].nodeValue
          : '';
      element.setAttribute('price', obj);
    });
  });

  var dataRef = await context.extract(productDetails, { transform });

  if (dataRef[0].group.length > 150) {
    dataRef[0].group = dataRef[0].group.slice(0, 150);
  }

  return dataRef;
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
