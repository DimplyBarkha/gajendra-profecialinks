const { transform } = require('../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // await context.waitForSelector('button.gdpr-cookie-layer__btn--submit');
  // await context.click('button.gdpr-cookie-layer__btn--submit');

  await context.evaluate(async function () {
    if (document.querySelector('gdpr-cookie-layer--show') && document.querySelector('button.gdpr-cookie-layer__btn--submit')) {
      document.querySelector('button.gdpr-cookie-layer__btn--submit').click();
    }
    function addElementToDocument (item, key, value) {
      const catElement = document.createElement('div');
      catElement.className = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      item.appendChild(catElement);
    }
    const productList = document.querySelectorAll('ul.products-list > li:not(.with-contenspot)');
    const paginationDiv = document.querySelector('ul.pagination > li.active');
    let pageStartIndex = paginationDiv ? parseInt(paginationDiv.getAttribute('data-value')) : 0;
    // pageStartIndex = pageStartIndex ? +pageStartIndex : 1;
    productList && productList.forEach((item, index) => {
      let classnameText = item.querySelector('a.rating > div') ? item.querySelector('a.rating > div').getAttribute('class') : '';
      classnameText = classnameText.replace('value-', '').replace('-', ',');
      addElementToDocument(item, 'ii_rating', classnameText);
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.nl',
    zipcode: '',
  },
  implementation,
};
