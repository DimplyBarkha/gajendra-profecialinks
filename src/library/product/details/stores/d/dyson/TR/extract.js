const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms)
    })
  }

  await stall(5000);

  await context.evaluate(async function() {

    function stall(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms)
      })
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

    if (document.querySelector('.bv-off-screen')) {
      addHiddenDiv('rating', document.querySelector('.bv-off-screen').innerText.split(' ')[0]);
    }
    if (document.querySelector('.dyson-bazaarvoice__reviews-link')) {
      addHiddenDiv('reviewCount', document.querySelector('.dyson-bazaarvoice__reviews-link').innerText.split(' ')[0]);
    } else {
      addHiddenDiv('reviewCount', 0);
    }

    document.querySelectorAll('.icon-info__body').forEach(el => {
      if (el.innerText.includes('Yıl Garanti')) {
        addHiddenDiv('warranty', el.innerText);
      }
      if (el.innerText.includes('Kargo')) {
        addHiddenDiv('shippingInfo', el.innerText);
      }
    });

    if (!document.getElementById('warranty')) {
      document.querySelectorAll('p').forEach(el => {
        if (el.innerText.includes('Yıl Garanti') && !document.getElementById('warranty')) {
          addHiddenDiv('warranty', el.innerText);
        }
      });
    }

    if (document.querySelector('.hgroup__prefix.hgroup__prefix--lead')) {
      addHiddenDiv('name', document.querySelector('.hgroup__prefix.hgroup__prefix--lead').childNodes[0].innerText);
    }

    if (document.querySelector('.hero__pricing__sold-out')) {
      addHiddenDiv('availabilityText', 'Out of Stock');
    } else {
      addHiddenDiv('availabilityText', 'In Stock')
    }

    const manufacturerImages = [];
    let enhancedContent = '';
    if (document.getElementById('see-all-features')) {
      enhancedContent = document.getElementById('see-all-features').innerText;
      document.getElementById('see-all-features').querySelectorAll('img').forEach(img => {
        manufacturerImages.push(img.getAttribute('src'));
      });
    }
    if (document.querySelector('.contents')) {
       enhancedContent += ' ' + document.querySelector('.contents').innerText;
      document.getElementById('see-all-features').querySelectorAll('img').forEach(img => {
        manufacturerImages.push(img.getAttribute('src'));
      });
    }
    if (enhancedContent) {
      addHiddenDiv('hasEnhancedContent', 'Yes');
    }
    addHiddenDiv('enhancedContent', enhancedContent);
    addHiddenDiv('manufacturerImages', manufacturerImages.join(' | '));

    const alternateImages = [];
    if (document.querySelector('button[data-modal="product_mini_gallery_video"]')) {
      document.querySelector('button[data-modal="product_mini_gallery_video"]').click();
      await stall(1000);
      if (document.querySelector('video')) {
        addHiddenDiv('videos', document.querySelector('video').querySelector('source').getAttribute('src'));
      }
      document.querySelectorAll('picture').forEach(pic => {
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
      if (headerText === 'Yükseklik' || headerText === 'Uzunluk' || headerText === 'Genişlik') {
        specifications.push(headerText + ' ' + specText);
      }
      if (headerText === 'Ağırlık') {
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
    country: 'TR',
    store: 'dyson',
    transform,
    domain: 'dyson.com.tr',
    zipcode: '',
  },
  implementation,
};
