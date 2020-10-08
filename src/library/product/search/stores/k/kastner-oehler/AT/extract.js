const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addElementToDocument (elem, id, value) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = value;
      newDiv.style.display = 'none';
      elem.appendChild(newDiv);
    }
    const cookie = document.querySelector('span.tao_button_cookie_settings');
    if (cookie) cookie.click();
    const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
    const productsOnPage = document.querySelectorAll('section#product-list article.en_griditem');
    const numberOfProductsOnPage = productsOnPage ? productsOnPage.length : 0;
    for (let i = 0; i < numberOfProductsOnPage; i++) {
      const item = document.querySelectorAll('section#product-list article.en_griditem')
        ? document.querySelectorAll('section#product-list article.en_griditem')[i] : [];
      // @ts-ignore
      const itemId = item && item.querySelector('div.en_mdl_product__image--alt')
        // @ts-ignore
        ? item.querySelector('div.en_mdl_product__image--alt').getAttribute('id').replace(/(^.+)_alt/g, '$1') : '';
      addElementToDocument(item, 'itemId', itemId);
      const imgId = item && item.querySelector('div.en_mdl_product__image_img.cssimg')
        ? item.querySelector('div.en_mdl_product__image_img.cssimg').getAttribute('id') : '';
      const element = document.evaluate('//style[contains(text(),"cssimg")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const regex = new RegExp(imgId + '\\s[^}]*url\\((.+)\\);\\}', 'g');
      const imgArr = element ? element.innerText.match(regex) : [];
      const img = imgArr ? imgArr[0].replace(regex, '$1').replace(/'\/\//g, 'https://').replace(/'/g, '') : '';
      addElementToDocument(item, 'img', img);
      addElementToDocument(item, 'count', lastProductPosition + i);
    };
    localStorage.setItem('prodCount', `${lastProductPosition + numberOfProductsOnPage}`);
  });
  return await context.extract(productDetails, { transform });
};
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    transform: transform,
    domain: 'kastner-oehler.at',
    zipcode: '',
  },
  implementation,
};
