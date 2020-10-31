const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(async function () {
    // eslint-disable-next-line no-undef
    CookieInformation.submitAllCategories();

    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }

    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const numberOfProductsExists = document.evaluate('//div[contains(@class, \'secondary\') and contains(@class, \'search__bar\')]/preceding-sibling::text()',
      document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
    if (numberOfProductsExists) {
      let numberOfProductsString, currentProductsCountRegex, currentProductsCount, totalProductsCountRegex,
        totalProductsCount, nextPageBtn;
      do {
        numberOfProductsString = document.evaluate('//div[contains(@class, \'secondary\') and contains(@class, \'search__bar\')]/preceding-sibling::text()',
          document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        currentProductsCountRegex = /\s(\d+)\s/g;
        currentProductsCount = parseInt(currentProductsCountRegex.exec(numberOfProductsString)[1]);
        totalProductsCountRegex = /(\d+)$/g;
        totalProductsCount = parseInt(totalProductsCountRegex.exec(numberOfProductsString)[1]);
        nextPageBtn = document.querySelector('button[class*=\'my-3\']');
        if (nextPageBtn) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          nextPageBtn.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 4000));
        }
      } while (currentProductsCount !== totalProductsCount);
    }

    const allProducts = document.querySelectorAll('a[class*=\'product-card__link\']');
    const integerPrice = document.querySelectorAll('span[class*=\'product-price__integer\']');
    const decimalPrice = document.querySelectorAll('span[class*=\'product-price__decimals\']');
    for (let i = 0; i < allProducts.length; i++) {
      allProducts[i].focus();
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
      addProp('a[class*=\'product-card__link\']', i, 'productPrice',
        integerPrice[i].innerText.trim() + ',' + decimalPrice[i].innerText.trim());
      addProp('a[class*=\'product-card__link\']', i, 'rankOrganic',
        `${i + 1}`);
      addProp('a[class*=\'product-card__link\']', i, 'productUrl', allProducts[i].href);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'bilkatogo',
    transform: null,
    domain: 'bilkatogo.dk',
    zipcode: '',
  },
  implementation,
};
