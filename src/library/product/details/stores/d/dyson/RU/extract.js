const { transform } = require('../transform');
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

    const skuMatches = window.location.href.match(/[0-9]{2,}\-[0-9]{1,}/g);
    if (skuMatches) {
      addHiddenDiv('sku', skuMatches[0]);
    }

    if (document.querySelector('.bv-off-screen')) {
      addHiddenDiv('rating', document.querySelector('.bv-off-screen').innerText.split(' ')[0]);
    }
    if (document.querySelector('.dyson-bazaarvoice__reviews-link')) {
      addHiddenDiv('reviewCount', document.querySelector('.dyson-bazaarvoice__reviews-link').innerText.split(' ')[0]);
    } else {
      addHiddenDiv('reviewCount', 0);
    }

    document.querySelectorAll('.icon-info__body').forEach(el => {
      if (el.innerText.includes('year guarantee')) {
        addHiddenDiv('warranty', el.innerText);
      }
      if (el.innerText.includes('shipping')) {
        addHiddenDiv('shippingInfo', el.innerText);
      }
    });

    if (!document.getElementById('warranty')) {
      document.querySelectorAll('p').forEach(el => {
        if (el.innerText.includes('year guarantee') && !document.getElementById('warranty')) {
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
    enhancedContent = document.querySelector('.product-features') ? document.querySelector('.product-features').innerText : '';
    if (enhancedContent) {
      addHiddenDiv('hasEnhancedContent', 'Yes');
    }
    const imgNodes = document.querySelectorAll('.product-features li > img');
    imgNodes.forEach(q => {
      if (q.hasAttribute('src')) {
        manufacturerImages.push('https://shop.dyson.ru' + q.getAttribute('src'));
      }
    });
    const videoNodes = document.querySelectorAll('iframe[id*=myExperience]');
    const videoLinks = [];
    videoNodes.forEach(q => {
      if (q.hasAttribute('src')) {
        videoLinks.push(q.getAttribute('src'));
      }
    });
    addHiddenDiv('videos', videoLinks.join(' | '));
    addHiddenDiv('enhancedContent', enhancedContent);
    addHiddenDiv('manufacturerImages', manufacturerImages.join(' | '));

    const alternateImages = [];
    if (document.querySelector('button[data-modal="product_mini_gallery_video"]')) {
      document.querySelector('button[data-modal="product_mini_gallery_video"]').click();
      await stall(1000);
      if (document.querySelector('video')) {
        addHiddenDiv('videos', document.querySelector('video').querySelector('source').getAttribute('src'));
      }
      document.getElementById('product_mini_gallery_video').querySelectorAll('picture').forEach(pic => {
        if (pic.querySelector('img')) {
          alternateImages.push(pic.querySelector('img').getAttribute('src'));
        }
      });
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
