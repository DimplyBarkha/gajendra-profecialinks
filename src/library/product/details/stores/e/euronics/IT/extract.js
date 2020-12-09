const { cleanUp } = require('../../../../shared');
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

    function addHiddenDiv(id, text) {
      let div = document.createElement('div');
      div.id = id;
      div.innerHTML = text;
      document.body.appendChild(div);
    }

    async function stall1(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms)
      })
    }

    console.log('count of popups - ' + document.querySelectorAll('div[class*="summary-buttons"] button[mode*="primary"]').length);
    if(document.querySelectorAll('div[class*="summary-buttons"] button[mode*="primary"]').length === 1) {
      console.log('we have one to click !');
      document.querySelectorAll('div[class*="summary-buttons"] button[mode*="primary"]')[0].click();
      console.log('waiting for a while for the page to load');
      await stall1(15000);

    } else if(document.querySelectorAll('div[class*="summary-buttons"] button[mode*="primary"]').length === 0) {
      console.log('we do not have any popup');
    } else {
      console.log('we are not sure which one to click');
    }

    if (document.querySelector('.owl-stage-outer')) {
      const primaryImg = document.querySelector('.owl-stage-outer').querySelector('img');
      addHiddenDiv('primaryImage', primaryImg.getAttribute('src'));
      addHiddenDiv('primaryImageAlt', primaryImg.getAttribute('alt'));
    }

    if (document.querySelector('.productDetails__category')) {
      addHiddenDiv('category', document.querySelector('.productDetails__category').innerText.trim());
    }

    const videos = [];
    const alternateImages = [];
    document.querySelectorAll('.preview__img').forEach((el, ind) => {
      if (el.querySelector('img') && ind > 0) {
        if (!el.querySelector('img').getAttribute('src').includes('youtube')) {
          alternateImages.push(el.querySelector('img').getAttribute('src').replace('small', 'full'));
        }
        if (el.querySelector('img').getAttribute('src').includes('youtube')) {
          const splitLink = el.querySelector('img').getAttribute('src').split('/');
          splitLink.pop();
          const videoLink = splitLink.join('/')
          videos.push(videoLink.replace('vi', 'embed').replace('img.youtube', 'youtube'));
        }
      }
    });
    addHiddenDiv('videos', videos.join(' | '));
    addHiddenDiv('alternateImages', alternateImages.join(' | '));
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.productDetails__price.pdpPrice')) {
      addHiddenDiv('price', document.querySelector('.productDetails__price.pdpPrice').innerText.trim());
    }
    if (document.querySelector('.productDetails__originalPrice') && document.querySelector('.productDetails__originalPrice').innerText) {
      addHiddenDiv('listPrice', document.querySelector('.productDetails__originalPrice').innerText.trim());
    }
    
    if (document.querySelector('.productDetails__originalPrice') && document.querySelector('.productDetails__originalPrice').innerText && document.querySelector('.productDetails__discount') && document.querySelector('.productDetails__discount').innerText) {
      addHiddenDiv('promotion', document.querySelector('.productDetails__discount').innerText.trim());
    }

    if (document.querySelector('.productDetails__availability')) {
      addHiddenDiv('promotion', document.querySelector('.productDetails__availability').innerText.trim());
    }

    let deliver = false;
    let inStore = false;
    document.querySelectorAll('.button__title--iconTxt').forEach(el => {
      if (el.innerText.includes('Aggiungi al carrello')) {
        deliver = true;
      }
      if (el.innerText.includes('prenota e ritira')) {
        inStore = true;
      }
    });
    if (deliver) {
      addHiddenDiv('availabilityText', "In Stock");
    } else if (inStore) {
      addHiddenDiv('availabilityText', "In Store Only");
    }


    let additionalDescBulletInfo = '';
    document.querySelectorAll('.specifications__item').forEach(el => {
      additionalDescBulletInfo  += '|| ' + el.innerText + ' ';
    });
    if (additionalDescBulletInfo.length) {
      addHiddenDiv('additionalDescBulletInfo', additionalDescBulletInfo);
    }
    addHiddenDiv('descriptionBullets', document.querySelectorAll('.specifications__item').length);

    let specifications = [];
    document.querySelectorAll('.product__specificationItem').forEach(el => {
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Composizione confezione-pz')) {
        addHiddenDiv('quantityInfo', el.querySelector('.product__specificationItemDetail').innerText.trim());
      }
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Peso-')) {
        const unit = el.querySelector('.product__specificationItemLabel').innerText.split('-')[1];
        addHiddenDiv('weightNet', el.querySelector('.product__specificationItemDetail').innerText.trim().replace(',', '.') + unit);
      }
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Altezza-mm')) {
        specifications.push(el.querySelector('.product__specificationItemDetail').innerText.trim() + 'mm');
      }
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Larghezza-mm')) {
        specifications.push(el.querySelector('.product__specificationItemDetail').innerText.trim() + 'mm');
      }
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Profondità-mm')) {
        specifications.push(el.querySelector('.product__specificationItemDetail').innerText.trim() + 'mm');
      }
    });
    if (specifications.length) {
      addHiddenDiv('specifications', specifications.join(' x '));
    }


    if (document.querySelector('.content__abstractText')) {
      addHiddenDiv('description', document.querySelector('.content__abstractText').innerText.trim());
      const warrantyMatch = document.querySelector('.content__abstractText').innerText.match(/[0-9]+ ANNI DI GARANZIA/);
      if (warrantyMatch && warrantyMatch.length) {
        addHiddenDiv('warranty', warrantyMatch[0]);
      }
    }

    if (document.querySelector('.productDetails__name')) {
      let splitName = document.querySelector('.productDetails__name').innerText.split('-');
      addHiddenDiv('color', splitName[splitName.length - 1]);
    }

    const splitUrl = window.location.href.split('/');
    const sku = splitUrl[splitUrl.length - 2].replace('eProd', '');
    addHiddenDiv('sku', sku);

    if (document.querySelector('#flix-inpage')) {
      console.log('enhancedContentHere', document.querySelector('#flix-inpage').innerText);
      addHiddenDiv('manufacturerDescription', document.querySelector('#flix-inpage').innerText);
      const manufacturerImgs = [];
      document.querySelector('#flix-inpage').querySelectorAll('img').forEach(el => {
        manufacturerImgs.push('https://' + el.getAttribute('src'));
      });
      addHiddenDiv('manufacturerImgs', manufacturerImgs);
    }

    document.querySelectorAll('script').forEach(el => {
      const match = el.innerHTML.match(/\[\'upcean\'\, \'[0-9]+\'\]/);
      if (match && match.length) {
        addHiddenDiv('gtin', match[0].replace(/\D/g, ""));
      }
      console.log('match', match);
    })

    addHiddenDiv('terms', 'Yes');
    addHiddenDiv('privacy', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');
    addHiddenDiv('zoomInfo', 'No');
    addHiddenDiv('rotateInfo', 'No');
    addHiddenDiv('technicalInformationPdfPresent', 'No');

  });


  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform: cleanUp,
    domain: 'euronics.it',
  },
  implementation,
};
