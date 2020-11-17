const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // if we're on search site we should click and select first item
  var detailsPage = await context.evaluate(async () => {
    if (
      document.querySelector('a.product-title.px_list_page_product_click') !=
      null
    ) {
      var productLink = document
        .querySelector('a.product-title.px_list_page_product_click')
        .getAttribute('href');
    }

    return productLink;
  });

  // check if detailsPage exists
  if (detailsPage) {
    await context.goto('https://bol.com' + detailsPage);
  }

  await context.waitForNavigation();
  await new Promise((resolve) => setTimeout(resolve, 3000));

  await context.evaluate(async function () {
    function addElementToDom (element, id) {
      const div = document.createElement('div');
      div.id = id;
      div.innerHTML = element;
      document.body.appendChild(div);
    }

    // autoclick
    var moreButtons = document.querySelectorAll('a.show-more__button');
    moreButtons.forEach(async (element) => {
      element.click();
    });
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    // scroll to images in description
    var descpImageElem = document.querySelector('a[name="product_gallery"]');
    if (descpImageElem) {
      descpImageElem.scrollIntoView();

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    }

    // get price
    var priceElem = document.querySelector('span[class="promo-price"]');
    if (priceElem) {
      const regex = /\d+/gm;
      const priceOne = priceElem.childNodes[0].textContent.match(regex);
      const priceTwo = priceElem.childNodes[1].textContent.match(regex);
      let price = '';
      if (priceTwo !== null) {
        price = '€' + priceOne + ',' + priceTwo;
      } else {
        price = '€ ' + priceOne;
      }
      addElementToDom(price, 'price');
    }

    // convert rating
    var rawRating = document.querySelector(
      'div[class="rating-horizontal__average-score"]');
    if (rawRating) {
      var text = document.querySelector(
        'div[class="rating-horizontal__average-score"]').textContent;
      rawRating.setAttribute('rating', text.toString().replace('.', ','));
    }
  });
  await context.extract(productDetails);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform: transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation,
};
