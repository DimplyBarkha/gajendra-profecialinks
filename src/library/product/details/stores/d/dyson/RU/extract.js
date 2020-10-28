const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall (ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await stall(5000);

  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('url', window.location.href);
    addHiddenDiv('pageTimeStamp', new Date());

    if (document.querySelector('h5') && document.querySelector('h5').innerText.split(':')[1]) {
      addHiddenDiv('sku', document.querySelector('h5').innerText.split(':')[1]);
    } else {
      document.querySelectorAll('small').forEach(el => {
        if (el.innerText.includes('SKU:')) {
          addHiddenDiv('sku', el.innerHTML.split('<br>')[0].replace('SKU: ', ''));
        }
      });
    }
    const getUrl = document.querySelector('div.add-to-cart a').getAttribute('href');

    if (!document.getElementById('sku')) {
      document.querySelectorAll('script').forEach(script => {
        const matches = script.innerText.match(/productSKU: \"[0-9]+\-[0-9]+\"/);
        if (matches && matches.length) {
          addHiddenDiv('sku', matches[0].replace('productSKU: ', '').replace(/"/g, ''));
        }
      });
    }

    if (document.querySelector('.bv-off-screen')) {
      addHiddenDiv('rating', document.querySelector('.bv-off-screen').innerText.split(' ')[0]);
    }
    if (document.querySelector('.dyson-bazaarvoice__reviews-link')) {
      addHiddenDiv('reviewCount', document.querySelector('.dyson-bazaarvoice__reviews-link').innerText.split(' ')[0]);
    } else {
      addHiddenDiv('reviewCount', 0);
    }

    document.querySelectorAll('div.description').forEach(el => {
      if (el.innerText.includes('Гарантия')) {
        addHiddenDiv('warranty', el.innerText);
      }
      if (el.innerText.includes('shipping')) {
        addHiddenDiv('shippingInfo', el.innerText);
      }
    });

    if (!document.getElementById('warranty')) {
      document.querySelectorAll('p').forEach(el => {
        if (el.innerText.includes('Гарантия') && !document.getElementById('warranty')) {
          addHiddenDiv('warranty', el.innerText);
        }
      });
    }

    if (document.querySelector('.hgroup__prefix.hgroup__prefix--lead')) {
      addHiddenDiv('name', document.querySelector('.hgroup__prefix.hgroup__prefix--lead').childNodes[0].innerText);
    }

    let outOfStock = false;
    if (document.querySelector('.legacy__product__availability-messaging') &&
            document.querySelector('.legacy__product__availability-messaging').innerText.includes('Unfortunately, this product is no longer available.')) {
      outOfStock = true;
    }

    if (document.querySelector('.hero__pricing__sold-out') || outOfStock) {
      addHiddenDiv('availabilityText', 'Out of Stock');
    } else {
      addHiddenDiv('availabilityText', 'In Stock');
    }

    const manufacturerImages = [];
    let enhancedContent = '';
    document.querySelectorAll('.layout').forEach(el => {
      if (el.querySelector('h2') &&
                (el.querySelector('h2').innerText.includes('In the box') ||
                    el.querySelector('h2').innerText.includes('Key features') ||
                    el.querySelector('h2').innerText.includes('All features'))) {
        enhancedContent += el.innerText + ' ';
        el.querySelectorAll('img').forEach(img => {
          manufacturerImages.push(img.getAttribute('src'));
        });
      }
    });
    if (enhancedContent) {
      addHiddenDiv('hasEnhancedContent', 'Yes');
    }
    addHiddenDiv('enhancedContent', enhancedContent);
    addHiddenDiv('manufacturerImages', manufacturerImages.join(' | '));

    const alternateImages = [];
    if (document.querySelector('a.product-video-thumbnail-img')) {
      document.querySelector('a.product-video-thumbnail-img').click();
      await stall(1000);
      if (document.querySelector('video')) {
        addHiddenDiv('videos', document.querySelector('video').querySelector('source').getAttribute('src'));
      }
      const alternateImages = [];
      await stall(1000);
      if (document.querySelector('div.images')) {
        alternateImages.push(document.querySelector('div.images').getAttribute('src'));
      }
    }
    addHiddenDiv('alternateImages', alternateImages.join(' | '));

    const specifications = [];
    document.querySelectorAll('.spec').forEach(spec => {
      if (!spec.querySelector('strong')) {
        return;
      }
      const headerText = spec.querySelector('strong').innerText;
      const specText = spec.querySelector('.spec__text').innerText;
      if (headerText === 'Height' || headerText === 'Length' || headerText === 'Width') {
        specifications.push(headerText + ' ' + specText);
      }
      if (headerText === 'Weight') {
        addHiddenDiv('weight', specText);
      }
    });
    addHiddenDiv('specifications', specifications.join(' | '));
    const sku = getUrl.split('=').pop();
    document.head.setAttribute('sku', sku);
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'dyson',
    transform,
    domain: 'dyson.ru',
    zipcode: '',
  },
  implementation,
};
