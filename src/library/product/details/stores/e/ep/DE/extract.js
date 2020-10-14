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

  const currentUrl = await context.evaluate(function () {
    return window.location.href;
  });

  const iframeUrl = await context.evaluate(function () {
    if (document.getElementById('loadbeeTabContent')) {
      return document.getElementById('loadbeeTabContent').getAttribute('src');
    }
    return null;
  });

  let manufacturerImages = [];
  let enhancedContent = [];
  let videos = [];
  if (iframeUrl) {
    await context.goto(iframeUrl, { timeout: 50000 });
    await stall(2000);

    manufacturerImages = await context.evaluate(function () {
      const manufacturerImages = [];
      document.querySelectorAll('img').forEach(img => {
        if (img.getAttribute('src').includes('logo')) {
          return;
        }
        manufacturerImages.push(img.getAttribute('src'));
      });
      return manufacturerImages;
    });
    videos = await context.evaluate(function () {
      const videos = [];
      document.querySelectorAll('video').forEach(video => {
        videos.push(video.querySelector('source').getAttribute('src'));
      });
      return videos;
    });
    enhancedContent = await context.evaluate(function () {
      return document.body.innerText;
    });

    await context.goto(currentUrl, { timeout: 50000 });
  }

  await stall(3000);

  await context.evaluate(async function (manufacturerImages, enhancedContent, videos) {
    if (document.querySelector('.cookies-overlay-dialog__accept-all-btn')) {
      document.querySelector('.cookies-overlay-dialog__accept-all-btn').click();
    }

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

    if (document.getElementById('flix-inpage')) {
      console.log('hasFlexContent');
      enhancedContent = document.getElementById('flix-inpage').innerText;
      document.querySelectorAll('video').forEach(video => {
        videos.push(video.querySelector('source').getAttribute('src'));
      });
      document.getElementById('flix-inpage').querySelectorAll('img').forEach(img => {
        manufacturerImages.push('https:' + img.getAttribute('src'));
      });
      if (document.querySelector('flix-inpage, div.inpage_product_assets div[class^="inpage_block_title flix"]')) {
        if (document.querySelector('flix-inpage, div.inpage_product_assets div[class^="inpage_block_title flix"]').innerText.includes('Weitere Informationen')) {
          addHiddenDiv('technicalInformationPdfPresent', 'Yes');
        }
      }
    }

    addHiddenDiv('enhancedContent', enhancedContent);
    if (enhancedContent) {
      addHiddenDiv('hasEnhancedContent', 'Yes');
    }
    addHiddenDiv('videos', videos.join(' | '));
    addHiddenDiv('manufacturerImages', manufacturerImages.join(' | '));

    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.primary-image')) {
      addHiddenDiv('primaryImage', document.querySelector('.primary-image').getAttribute('src'));
      addHiddenDiv('imageAlt', document.querySelector('.primary-image').getAttribute('alt'));
    }

    if (document.querySelector('.rrp.product-price-panel-offer')) {
      addHiddenDiv('listPrice', document.querySelector('.rrp.product-price-panel-offer').innerText.replace('UVP', ''));
    }
    if (document.querySelector('.priceOfProduct.product-price-panel-offer')) {
      addHiddenDiv('price', document.querySelector('.priceOfProduct.product-price-panel-offer').innerText.replace('*', ''));
    }

    let inStore = false;
    let delivery = false;
    if (document.querySelector('.product-cart-add-to-cart-button')) {
      delivery = true;
    }
    if (document.querySelector('.product-cart-pickup-label') &&
      document.querySelector('.product-cart-pickup-label').querySelector('.green-stock-level')) {
      inStore = true;
    }

    if (delivery) {
      addHiddenDiv('availabilityText', 'In Stock');
    } else if (inStore) {
      addHiddenDiv('availabilityText', 'In Store Only');
    } else {
      addHiddenDiv('availabilityText', 'Out of Stock');
    }

    if (document.querySelector('a[href="#classifications-tab"]')) {
      document.querySelector('a[href="#classifications-tab"]').click();
      await stall(100);
    }

    const specifications = [];
    const shippingDimensions = [];
    document.querySelectorAll('.product-classifications').forEach(el => {
      if (!el.querySelector('.product-classifications-headline')) {
        return;
      }
      if ((el.querySelector('.product-classifications-headline').innerText === 'Netto-Maße') || el.querySelector('.product-classifications-headline').innerText.includes('Netto-Artikelmaße')) {
        el.querySelectorAll('tr').forEach(tr => {
          if (tr.innerText.includes('Gewicht:') || tr.innerText.includes('Gewicht mit Fuß:')) {
            addHiddenDiv('weightNet', tr.innerText.replace('Gewicht:', '').replace('Gewicht mit Fuß:', ''));
          }
          if (tr.innerText.includes('Durchmesser') || tr.innerText.includes('Gewicht') || tr.innerText.includes('Breite') || tr.innerText.includes('Höhe') || tr.innerText.includes('Tiefe')) {
            specifications.push(tr.innerText);
          }
        });
      }
      if (el.querySelector('.product-classifications-headline').innerText === 'Logistikmaße mit Verpackung') {
        el.querySelectorAll('tr').forEach(tr => {
          if (tr.innerText.includes('Gewicht:')) {
            addHiddenDiv('weightGross', tr.innerText.replace('Gewicht:', ''));
          }
          if (tr.innerText.includes('Breite:') || tr.innerText.includes('Höhe:') || tr.innerText.includes('Tiefe:')) {
            shippingDimensions.push(tr.innerText);
          }
        });
      }
    });
    if (specifications.length) {
      addHiddenDiv('specifications', specifications.join(' | '));
    }
    if (shippingDimensions.length) {
      addHiddenDiv('shippingDimensions', shippingDimensions.join(' | '));
    }

    const splitUrl = window.location.href.split('/');
    addHiddenDiv('sku', splitUrl[splitUrl.length - 2]);

    if (document.querySelector('a[href="#reviews-tab"]')) {
      document.querySelector('a[href="#reviews-tab"]').click();
      await stall(1000);
      if (document.querySelector('.product-review-comment')) {
        const ratingMatch = document.querySelector('.product-review-comment').innerText.match(/\d+\.\d{0,2}\/5/);
        const reviewCountMatch = document.querySelector('.product-review-comment').innerText.match(/\d+ Testberichte/);
        if (reviewCountMatch && reviewCountMatch.length) {
          addHiddenDiv('ratingCount', reviewCountMatch[0].split(' ')[0]);
        }
        if (ratingMatch && ratingMatch.length) {
          const rating = ratingMatch[0].split('/')[0];
          addHiddenDiv('rating', rating.replace('.', ','));
          addHiddenDiv('ratingText', rating.replace('.', ',') + ' out of 5');
        }
      }
    }
  }, manufacturerImages, enhancedContent, videos);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'ep',
    transform,
    domain: 'ep.de',
    zipcode: '',
  },
  implementation,
};
