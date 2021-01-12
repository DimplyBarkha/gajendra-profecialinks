const { transform } = require('../../../../shared');

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

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const allProducts = document.querySelectorAll('li.shelf-item');
    const productUrls = document.querySelectorAll('a[class*="shelf-product-title"]');
    const viewMoreBtns = document.querySelectorAll('li[class=\'shelf-item\'] button[class*=\'view-more\']');
    let productCode;
    for (let i = 0; i < allProducts.length; i++) {
      allProducts[i].scrollIntoView();
      await new Promise((resolve, reject) => setTimeout(resolve, 500));
      if (viewMoreBtns[i]) {
        viewMoreBtns[i].click();
        await new Promise((resolve, reject) => setTimeout(resolve, 500));
        productCode = document.evaluate('//div[contains(@class, \'brand-code\')]//span[contains(@class, \'product-preview-code\')]/text()[2]', document, null, XPathResult.STRING_TYPE, null).stringValue;
        addProp('li.shelf-item', i, 'product_code', productCode);
        const closePreview = document.querySelector('i[class*=\'close-preView\']');
        if (closePreview) {
          closePreview.click();
        }
      }
      addProp('li.shelf-item', i, 'productUrl', 'https://www.jumbo.cl' + productUrls[i].getAttribute('href'));
    }


    const nextPageNumber = document.querySelector('div.slides button[class*=\'page-number active\'] + button')
      ? parseInt(document.querySelector('div.slides button[class*=\'page-number active\'] + button').innerText) : '';
    const currentUrl = window.location.href;
    let nextUrl = '';
    if (nextPageNumber) {
      if (!currentUrl.includes('page=')) {
        nextUrl = currentUrl + `&page=${nextPageNumber}`;
      } else {
        const urlWithoutPageNumberRegex = /(.*page=)(\d+)/g;
        const urlWithoutPageNumber = urlWithoutPageNumberRegex.exec(currentUrl)[1];
        nextUrl = urlWithoutPageNumber + nextPageNumber;
      }
      const nextLinkElement = document.createElement('link');
      nextLinkElement.rel = 'next';
      nextLinkElement.href = nextUrl;
      document.head.appendChild(nextLinkElement);
    }

    await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CL',
    store: 'jumbo',
    transform,
    domain: 'jumbo.cl',
    zipcode: '',
  },
  implementation,
};
