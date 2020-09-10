const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'kastner-oehler',
    transform: transform,
    domain: 'kastner-oehler.at',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
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
        addElementToDocument(item, 'count', `${i + 1}`);
        const imgId = item.querySelector('div.en_mdl_product__image_img.cssimg')
          ? item.querySelector('div.en_mdl_product__image_img.cssimg').getAttribute('id') : '';
        const element = document.evaluate('//style[contains(text(),"cssimg")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const regex = new RegExp(imgId + '\\s[^}]*url\\((.+)\\);\\}', 'g');
        const imgArr = element.innerText.match(regex);
        const img = imgArr[0].replace(regex, '$1').replace(/'\/\//g, 'https://').replace(/'/g, '');
        addElementToDocument(item, 'img', img);
      }
    });
    return await context.extract(productDetails);
  },
};
