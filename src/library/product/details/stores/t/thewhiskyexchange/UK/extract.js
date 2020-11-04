const { transform } = require('../../../../shared');

async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    var prodImg = document.querySelector(
      'div[class="product-main__image-container"] img[class="product-slider__image lazyloaded"]'
    );

    if (prodImg !== null) {
      var prodImgAttr = prodImg.getAttribute('src');
      var prodContainer = document.querySelector(
        'div[class="product-main__image-container"]'
      );
      prodContainer.setAttribute('img_url', prodImgAttr);
    } else {
      var prodImgAttr = document
        .querySelector('div[class="product-main__image-container"] img')
        .getAttribute('src');
      var prodContainer = document.querySelector(
        'div[class="product-main__image-container"]'
      );
      prodContainer.setAttribute('img_url', prodImgAttr);
    }

    // join facts into description
    var facts = document.querySelectorAll('li[class="product-facts__item"]');
    var description = '';
    facts.forEach((element) => {
      description += element.children[1].textContent.concat(
        ': ',
        element.children[2].textContent,
        '\n'
      );
    });

    var elem = document.createElement('div');
    elem.classList.add('otherProdInfo');
    elem.innerText = description;
    elem.style.display = 'none';
    document.body.appendChild(elem);

    // join shipping info
    var deliveries = document.querySelectorAll(
      'li[class="product-shipping__item"]'
    );
    var deliveryInfo = '';
    deliveries.forEach((element) => {
      deliveryInfo += element.children[0].textContent.concat(
        ': ',
        element.children[1].textContent,
        '\n'
      );
    });

    var elem = document.createElement('div');
    elem.classList.add('deliveryInfo');
    elem.innerText = deliveryInfo;
    elem.style.display = 'none';
    document.body.appendChild(elem);

    // filter breadcrumbs
    var breadcrumps = document.querySelectorAll(
      'div[class="breadcrumb"] li[class="breadcrumb__item"] a'
    );
    breadcrumps.forEach((element, index) => {
      if (index > 0) {
        element.setAttribute('category', element.textContent);
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'thewhiskyexchange',
    transform: transform,
    domain: 'thewhiskyexchange.com',
    zipcode: '',
  },
  implementation,
};
