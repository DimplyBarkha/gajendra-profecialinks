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

  await context.waitForXPath('//h1[@itemprop="name"]');

  await stall(3000);

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

    if (document.querySelector('.carousel-inner')) {
      addHiddenDiv('primaryImage', document.querySelector('.carousel-inner').querySelector('.img-responsive').getAttribute('src'));
    }

    const alternateImages = [];
    const carousel = document.querySelector('.carousel-inner.vertical');
    if(carousel) {
      carousel.querySelectorAll('.box').forEach((el, i) => {
        if(i > 0 && el.querySelector('img') && !alternateImages.includes(el.querySelector('img').getAttribute('src')) && document.getElementById('primaryImage').innerText !== el.querySelector('img').getAttribute('src')) {
          alternateImages.push(el.querySelector('img').getAttribute('src'));
        }
      });
    }
    addHiddenDiv('alternateImages', alternateImages.join(' | '));
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.first-price')) {
      addHiddenDiv('promotion', document.querySelector('.first-price').innerText);
      addHiddenDiv('price', document.querySelector('.first-price').querySelector('strong').innerText);
    } else {
      addHiddenDiv('price', document.querySelector('.price').innerText);
    }

    let deliver = false;
    let inStore = false;
    document.querySelectorAll('.shippingType-text').forEach(el => {
      if (el.innerText.includes('Envío a domicilio')) {
        deliver = true;
      }
      if (el.innerText.includes('Recogida en tienda')) {
        inStore = true;
      }
    });
    if (deliver) {
      addHiddenDiv('availabilityText', 'In Stock');
    } else if (inStore) {
      addHiddenDiv('availabilityText', 'In Store Only');
    } else {
      addHiddenDiv('availabilityText', 'Out of Stock');
    }

    if (document.querySelector('.item__text.js-description-tab')) {
      document.querySelector('.item__text.js-description-tab').click();
      await stall(200);
      addHiddenDiv('description', document.querySelector('.text.description-content.js-description-content').innerText);
    }

    document.querySelectorAll('script').forEach(el => {
        const jsonArr = el.innerHTML.match(/("?)\b(\w+)\1\s*:\s*("?)((?:\w+[-+*%])*?\w+)\b\3/g);
        if(jsonArr && jsonArr.length) {
          jsonArr.forEach(text => {
            if (text.includes('sku')) {
              addHiddenDiv('sku', Number(text.split(':')[1].replace(/"/g,'').trim()));
            }
            if (text.includes('model')) {
              addHiddenDiv('mpc', text.split(':')[1].replace(/"/g,'').trim());
            }
            if (text.includes('gtin13')) {
              addHiddenDiv('gtin', text.split(':')[1].replace(/"/g,'').trim());
            }
          });
        }
    });

    if (document.querySelector('button[itemprop="ratingValue"]')) {
      addHiddenDiv('aggregatedRatingText', document.querySelector('button[itemprop="ratingValue"]').innerText + ' out of 5')
    }

    let specifications = [];
    document.querySelectorAll('.description-tech-text').forEach(el => {
      if (el.innerText.includes('Color')) {
        addHiddenDiv('color', el.innerText.split(':')[1].trim());
      }
      if (el.innerText.includes('Peso')) {
        addHiddenDiv('weightNet', el.innerText.split(':')[1].trim());
      }
      if (el.innerText.includes('Material')) {
        addHiddenDiv('materials', el.innerText.split(':')[1].trim());
      }
      if (el.innerText.includes('Profundidad (mm)') || el.innerText.includes('Anchura (mm)') || el.innerText.includes('Altura (mm)')) {
        specifications.push(el.innerText.trim());
      }
    });
    addHiddenDiv('specifications', specifications.join(', '));

    let additionalInfo = '';
    document.querySelector('section[class="dataProduct"]').querySelectorAll('.description-tech-text').forEach(e => {
      additionalInfo += '|| ' + e.innerText + ' ';
    });
    if (additionalInfo) {
      addHiddenDiv('additionalInfo', additionalInfo);
    }

    addHiddenDiv('terms', 'Yes');
    addHiddenDiv('privacy', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');
    addHiddenDiv('rotateInfo', 'No');
    addHiddenDiv('zoomInfo', 'No');
    addHiddenDiv('pdf', 'No');


  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IE',
    store: 'euronics',
    transform: null,
    domain: 'euronics.ie',
  },
  implementation,
};
