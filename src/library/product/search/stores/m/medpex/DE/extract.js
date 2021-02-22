const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'medpex',
    transform: transform,
    domain: 'medpex.de',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div#product-list div.product-list-entry.data-tracking-product form')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        var rating = document.querySelectorAll('div[class="rating"] a[class]')
        var len = document.querySelectorAll('div.clearfix > div.description > span > b > a').length
        for (let i = 0; i < len; i++) {
          var data = rating[i].className.split("-")
          addHiddenDiv("rating", data[data.length - 1], i)
        }
      }
      catch (e) {

      }
      try {
        const product = document.querySelectorAll('div#product-list div.data-tracking-product');
        const URL = window.location.href;
        for (let i = 0; i < product.length; i++) {
          let aggrating = document.querySelectorAll('form > div.clearfix > div.description > div.product-icons > div.rating > a')[i];
          var b = aggrating.classList.value.split('-')
          // @ts-ignore
          const productUrl = product[i].querySelector('span.product-name b a').href;

          // @ts-ignore
          var price = document.querySelectorAll('span.normal-price')[i].innerText;
          var c = price.replace(',', '.')
          addHiddenDiv('pd_productUrl', productUrl, i);
          addHiddenDiv('pd_url', URL, i);
          addHiddenDiv('rating1', b[b.length - 1], i);
          addHiddenDiv('price', c, i)
        }
      } catch (error) {

      }
      const URL1 = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }
      addElementToDocument('pd_url', URL1);
    });
    return await context.extract(productDetails, { transform });
  },
};
