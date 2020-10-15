const { cleanUp } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const GetTagByIdUsingRegex = (tag, id, html) => {
      // eslint-disable-next-line no-useless-escape
      return new RegExp('<' + tag + '[^>]*id[\\s]?=[\\s]?[\'"]' + id + '[\'"][\\s\\S]*?<\/' + tag + '>').exec(html);
    };
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
    await fetch(window.location.href, {
      method: 'GET',
    }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', 'is_script', htm);
      const outerHTML = result && result[0] ? result[0] : '';

      document.body.insertAdjacentHTML('beforeend', outerHTML);
    });

    const readMoreBtn = document.querySelector('button[class*="uSQV49"]');
    if (readMoreBtn) {
      readMoreBtn.click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1000));
    }

    const JSstring = document.body.querySelector('#is_script') ? document.body.querySelector('#is_script').innerHTML : '';
    const obj = JSON.parse(JSstring.split('window.__INITIAL_STATE__ = ').slice(-1)[0].trim().slice(0, -1));
    const videoObject = obj.pageDataV4.page.data[10001]['0'].widget.data.multimediaComponents;
    // eslint-disable-next-line no-prototype-builtins
    if (videoObject.hasOwnProperty(1)) {
      if (videoObject[1].value.contentType === 'VIDEO') {
        addElementToDocument('videoUrl', videoObject[1].value.url);
      }
    }

    const imageFromThumbnails = document.querySelectorAll('li[class*=\'_4f8Q22 _2y_FdK\'] div div').length ? document.querySelectorAll('li[class*=\'_4f8Q22 _2y_FdK\'] div div')[0].getAttribute('style') : '';
    if (imageFromThumbnails) {
      const imageFromThumbnailsTransformed = imageFromThumbnails.substr(21, imageFromThumbnails.length - 22).replace('/128/128/', '/416/416/');;
      addElementToDocument('thumbnailsMainImage', imageFromThumbnailsTransformed);
    }
    const ratingCountExists = document.evaluate('//span[@class=\'_38sUEc\']//*[contains(text(), \'Reviews\') or contains(text(), \'reviews\')]', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
    if (ratingCountExists) {
      const ratingCountString = document.evaluate('//span[@class=\'_38sUEc\']//*[contains(text(), \'Reviews\') or contains(text(), \'reviews\')]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      const ratingCountRegexp = /(\d+)\s+(Reviews|reviews)/g;
      const ratingCountMatch = ratingCountRegexp.exec(ratingCountString)[1];
      addElementToDocument('ratingCount', ratingCountMatch);
    }

    const jsonData = JSON.parse(document.getElementById('jsonLD').innerHTML);
    if ('brand' in jsonData[0]) {
      const brandText = jsonData[0].brand.name;
      addElementToDocument('brandText', brandText);
    }

    const defaultVariantCount = 0;
    addElementToDocument('variantCount', defaultVariantCount);
  });
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform: cleanUp,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
