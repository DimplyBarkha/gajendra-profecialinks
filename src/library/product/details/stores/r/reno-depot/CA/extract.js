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

  await stall(3000);

  await context.evaluate(function () {
    document.cookie = 'RenoWCCookie.province=QC';
    document.cookie = 'RenoWCCookie.region.selected=QUEBEC';
    document.cookie = 'RenoWCCookie.stores.selected=73020';
    location.reload();
  });

  await stall(5000);
  
  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.breadcrumb')) {
      document.querySelector('.breadcrumb').querySelectorAll('a').forEach(category => {
        addHiddenDiv('category', category.innerText);
      });
    }
  
    const alternateImages = [];
    if (document.getElementById('product__image-gallery')) {
      document.getElementById('product__image-gallery').querySelectorAll('img').forEach((img, ind) => {
        if (ind > 0) {
          alternateImages.push(img.getAttribute('src').replace('_S', '_L'));
        }
      });
    }
    if (alternateImages.length) {
      addHiddenDiv('alternateImages', alternateImages.join(' | '));
    }

    if (document.querySelector('.product_price_box')) {
      addHiddenDiv('price', '$' + document.querySelector('.product_price_box').querySelector('.integer').innerText + (document.querySelector('.product_price_box').querySelector('.decimal') ? '.' + document.querySelector('.product_price_box').querySelector('.decimal').innerText : ''));
      if (document.querySelector('.product_price_box').querySelector('.linethrough')) {
        addHiddenDiv('listPrice', document.querySelector('.product_price_box').querySelector('.linethrough').innerText.trim());
      } else {
        addHiddenDiv('listPrice', '$' + document.querySelector('.product_price_box').querySelector('.integer').innerText + (document.querySelector('.product_price_box').querySelector('.decimal') ? '.' + document.querySelector('.product_price_box').querySelector('.decimal').innerText : ''));
      }
    }

    let inStore = false;
    let delivery = false;
    if (document.querySelector('.cartWrapper').querySelector('.availability.availMsgInStock.store')) {
      inStore = true;
    }
    if (document.querySelector('.cartWrapper').querySelector('.availability.availMsgInStock.parcel') || document.querySelector('.cartWrapper').querySelector('.availability.availMsgTruck')) {
      delivery = true;
    }

    if (delivery) {
      addHiddenDiv('availabilityText', 'In Stock');
    } else if (inStore) {
      addHiddenDiv('availabilityText', 'In Store Only');
    } else {
      addHiddenDiv('availabilityText', 'Out of Stock');
    }

    addHiddenDiv('bulletCount', 0);

    const specifications = [];
    document.querySelectorAll('.title').forEach(el => {
      const parent = el.parentElement;
      if (parent && el.innerText.includes('Weight')) {
        el.remove();
        addHiddenDiv('weightNet', parent.innerText.trim());
      }
      if (parent && el.innerText.includes('Color')) {
        el.remove();
        addHiddenDiv('color', parent.innerText.trim());
      }
      if (parent && el.innerText.includes('Warranty')) {
        el.remove();
        addHiddenDiv('warranty', parent.innerText.trim());
      }
      if (parent && el.innerText.includes('Height')) {
        el.remove();
        specifications.push(parent.innerText.trim());
      }
      if (parent && el.innerText.includes('Width')) {
        el.remove();
        specifications.push(parent.innerText.trim());
      }
      if (parent && el.innerText.includes('Depth')) {
        el.remove();
        specifications.push(parent.innerText.trim());
      }
      if (parent && el.innerText.includes('Dimensions')) {
        el.remove();
        specifications.push(parent.innerText.trim());
      }
    });

    addHiddenDiv('specifications', specifications.join(' | '));

    if (document.querySelector('div[itemprop="ratingValue"]')) {
      addHiddenDiv('aggregatedRatingText', document.querySelector('div[itemprop="ratingValue"]').innerText + ' out of 5');
    }

    let shippingInfo = '';
    if (document.querySelector('.availabilityCommitmentMsg')) {
      shippingInfo += document.querySelector('.availabilityCommitmentMsg').innerText + ' ';
    }
    if (document.querySelector('.show-EN.inventoryParcelMsgPromo')) {
      shippingInfo += document.querySelector('.show-EN.inventoryParcelMsgPromo').innerText;
    }
    addHiddenDiv('shippingInfo', shippingInfo);

    const videos = [];
    document.querySelectorAll('video').forEach(video => {
      videos.push(video.getAttribute('src'));
    });
    document.querySelectorAll('iframe').forEach(frame => {
      if (frame.getAttribute('src')) {
        return;
      }
      frame.contentWindow.document.querySelectorAll('video').forEach(video => {
        videos.push(video.getAttribute('src'));
      });
    });
    const manufacturerImgs = [];
    if (document.getElementById('wc-power-page')) {
      if (document.getElementById('wc-power-page').querySelector('h1')) {
        document.getElementById('wc-power-page').querySelector('h1').remove();
        document.getElementById('wc-power-page').querySelector('p').remove();
      }
      console.log('hasManufacturerInfo', document.getElementById('wc-power-page').innerText);
      addHiddenDiv('manufacturerDescription', document.getElementById('wc-power-page').innerText);
      document.getElementById('wc-power-page').querySelectorAll('img').forEach(img => {
        if (img.getAttribute('data-asset-type') !== 'video') {
          manufacturerImgs.push(img.getAttribute('src'));
        } else {
          videos.push(img.getAttribute('data-asset-url'));
        }
      });
    }

    addHiddenDiv('videos', videos.join(' | '));
    addHiddenDiv('manufacturerImgs', manufacturerImgs.join(' | '));

    addHiddenDiv('terms', 'No');
    addHiddenDiv('privacyPolicy', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');
    let rotate = 'No';
    document.querySelectorAll('h2').forEach(el => {
      if (el.innerText.includes('360° Spin')) {
        rotate = 'Yes';
      }
    });
    addHiddenDiv('rotateInfo', rotate);
    addHiddenDiv('countryOfOrigin', 'Canada');

    if (document.querySelector('.zoom_btn')) {
      addHiddenDiv('zoomInfo', 'Yes');
    } else {
      addHiddenDiv('zoomInfo', 'No');
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'reno-depot',
    transform: null,
    domain: 'renodepot.com',
  },
  implementation,
};
