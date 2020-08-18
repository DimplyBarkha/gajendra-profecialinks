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


  await context.waitForXPath('//div[@class="productCard__aux j-toggle "]');
  await stall(2000);
  let url = await context.evaluate(function() {
    if (document.querySelector('.productCard') && document.querySelector('.productCard').querySelector('a[rel="nofollow"]')) {
      return document.querySelector('.productCard').querySelector('a[rel="nofollow"]').getAttribute('href');
    }
  });
  await context.goto(url, {timeout: 50000});
  await context.waitForXPath('//div[@class="owl-stage-outer"]');

  await context.evaluate(function() {

    function addHiddenDiv(id, text) {
      let div = document.createElement('div');
      div.id = id;
      div.innerHTML = text;
      document.body.appendChild(div);
    }

    if (document.querySelector('.owl-stage-outer')) {
      const primaryImg = document.querySelector('.owl-stage-outer').querySelector('img').getAttribute('src');
      addHiddenDiv('primaryImage', primaryImg);
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
    } else {
      addHiddenDiv('listPrice', document.querySelector('.productDetails__price.pdpPrice').innerText.trim());
    }
    if (document.querySelector('.productDetails__discount') && document.querySelector('.productDetails__discount').innerText) {
      addHiddenDiv('promotion', document.querySelector('.productDetails__discount').innerText.trim());
    }

    if (document.querySelector('.productDetails__availability')) {
      addHiddenDiv('availabilityText', document.querySelector('.productDetails__availability').innerText.trim());
    }

    let description = '';
    document.querySelectorAll('.specifications__item').forEach(el => {
      description += '|| ' + el.innerText + ' ';
    });
    if (description.length) {
      addHiddenDiv('description', description);
    }
    addHiddenDiv('descriptionBullets', document.querySelectorAll('.specifications__item').length);

    let specifications = [];
    document.querySelectorAll('.product__specificationItem').forEach(el => {
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Composizione confezione-pz')) {
        addHiddenDiv('quantityInfo', el.querySelector('.product__specificationItemDetail').innerText.trim());
      }
      if (el.querySelector('.product__specificationItemLabel').innerText.includes('Peso-gr')) {
        addHiddenDiv('weightNet', el.querySelector('.product__specificationItemDetail').innerText.trim());
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
      addHiddenDiv('additionalInfo', '|| ' + document.querySelector('.content__abstractText').innerText.trim().replace(/-/g, ' || '));
    }

    if (document.querySelector('.productDetails__name')) {
      let splitName = document.querySelector('.productDetails__name').innerText.split('-');
      addHiddenDiv('color', splitName[splitName.length - 1]);
    }

    addHiddenDiv('termsAndConditions', 'Yes');
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
    transform: null,
    domain: 'euronics.it',
  },
  implementation,
};
