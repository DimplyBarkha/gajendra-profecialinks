const { transform } = require('../../../../../search/shared');


async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function getElements() {
      return document.querySelectorAll('section article[data-item=\'true\']');
    }
    const isListview = document.querySelector('div[data-analytics-interaction-value="regular"]');
    if (!isListview) {
      const galleryView = document.querySelector('div[data-analytics-interaction-value="gallery"]');
      if (galleryView) {
        galleryView.click();
        await stall(30000);
      }
    }

    const elements = getElements();
    if (elements.length) {
      for (var i = 0; i < elements.length; i++) {
        try {
          elements[i].scrollIntoView();
          await stall(1500);
          let imageUrl = getElements()[i].querySelector(
            'a[rel=\'nofollow\'] img, ul li:nth-child(1) img'
          );
          let data = {
            productUrl: elements[i].querySelector('h2>a').getAttribute('href'),
            thumbnail: imageUrl.getAttribute('src'),
            name: elements[i].querySelector('h2>a[href]').textContent,
            id: elements[i].getAttribute('data-analytics-view-value'),
            price: elements[i].querySelector('span._1svub').textContent,
            listPrice: elements[i].querySelector(
              'article[data-item=\'true\']>div>div:nth-child(2) span[style] + span'
            )
              ? elements[i].querySelector(
                  'article[data-item=\'true\']>div>div:nth-child(2) span[style] + span'
                ).textContent
              : '',
            manufacturer: getElementByXpath(
              '//div[contains(@class,\"mgn2_13 mpof_5r\")]//*[contains(text(), \'Marka\')]/following::*[1]'
            ),
            nameExtended: elements[i].querySelector('h2>a').textContent,
          };
          appendElement(elements[i], data);
        } catch (error) {
          console.log(error);
        }
      }
      
    }

    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function appendElement(node, data) {
      console.log(data);
      let div = document.createElement('div');
      div.classList.add('products');
      for (let key in data) {
        if (data[key]){
          div.setAttribute(key, data[key]);
        }
      }
      document.body.appendChild(div);
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation
};