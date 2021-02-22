const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: cleanUp,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation: async ({ url }, {
    country,
    domain,
    transform,
  }, context, { productDetails }) => {

    const productWindow = await context.evaluate(async () => !document.querySelector('a[class*=\'product-v2\']'));
    if (!productWindow) {
      await context.click('a[class*=\'product-v2\']');
    }
    await context.waitForSelector('div[class*=\'product-breadcrumb\']');
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const variantTypes = document.querySelectorAll('div[type] > div[type]');

      const variantsObj = {};
      Array.from(variantTypes).map(el => {
        variantsObj[el.getAttribute('type')] = el.childElementCount;
      });
      if (Object.keys(variantsObj).length > 1) {
        variantsObj.variants = Object.values(variantsObj).reduce((a, b) => a * b);
        addElementToDocument('variantsCount', variantsObj.variants);
      } else {
        addElementToDocument('variantsCount', Object.values(variantsObj));
      }

      addElementToDocument('productUrl', window.location.href);
      const hiddenVideoInImg = document.evaluate('//img[contains(@alt, \'Vídeo\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (hiddenVideoInImg) {
        hiddenVideoInImg.click();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      const additionalDescription = document.evaluate('//div[contains(@class, \'GridUI\')]/div[contains(@class, \'TitleWrapper\')]/h2[contains(text(), \'Informações do produto\')]', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue
        ? document.evaluate('//div[contains(@class, \'GridUI\')]/div[contains(@class, \'TitleWrapper\')]/h2[contains(text(), \'Informações do produto\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue : '';
      if (additionalDescription) {
        additionalDescription.scrollIntoView();
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      const outOfStockInfo = document.querySelector('a[value="Comprar"]');
      outOfStockInfo ? addElementToDocument('availability_info', 'In Stock')
        : addElementToDocument('availability_info', 'Out Of Stock');
      const createId = (str) => str.toLowerCase().split(/[ ,.\t]+/)[0];
      const dataSheet = document.querySelectorAll('section table tbody tr');
      Array.from(dataSheet).map(node => {
        node.setAttribute('id', createId(node.innerText));
      });

      const additionalImages = document.querySelectorAll('body[id*="conteudo"] div[class*="desktop"]>img');
      if (additionalImages.length) {
        for (let i = 0; i < additionalImages.length; i++) {
          addElementToDocument('additional_image', additionalImages[i].src);
        }
      }

      const rating = document.querySelector('div[class*=\'summary-rating\'] span[class*=\'Average\']')
        ? document.querySelector('div[class*=\'summary-rating\'] span[class*=\'Average\']').innerText.replace('.', ',') : '';
      if (rating) {
        addElementToDocument('aggregate_rating', rating);
      }

      try {
        const productObject = window.__PRELOADED_STATE__;
        addElementToDocument('product_sku', productObject.product.skus[0]);
        addElementToDocument('product_description', productObject.description.content.trim().replace(/&lt;|\/?(br.?.?)?p?b?&gt;?/g, ''));
      } catch (e) {
        console.log('error: ', e);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
