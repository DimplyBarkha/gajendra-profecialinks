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

  const productId = await context.evaluate(function() {
    let splitUrl = window.location.href.split('/');
    return splitUrl[splitUrl.length - 1];
  });

  const currentUrl = await context.evaluate(function() {
    return window.location.href;
  });

  await context.goto('https://mark.reevoo.com/reevoomark/en-GB/product?sku=' + productId + '&trkref=ERN');

  await stall(3000);

  const ratingContents = await context.evaluate(function() {
    return document.body.innerHTML;
  });

  await context.goto(currentUrl);

  await stall(3000);

  await context.evaluate(async function(productId, ratingContents) {
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

    await stall(5000);
    document.querySelector('button[data-read-more="Read more"]').click();
    let alternateImages = [];
    if (document.querySelector('.zoom-trap') && document.querySelector('.zoom-trap').querySelector('img')) {
      console.log('hasImage');
      addHiddenDiv('primaryImage', document.querySelector('.zoom-trap').querySelector('img').getAttribute('src'));
      document.querySelectorAll('.zoom-trap').forEach((el, ind) => {
        if(el.querySelector('img') && ind > 0) {
          alternateImages.push(el.querySelector('img').getAttribute('src'));
        }
      })
    }
    addHiddenDiv('alternateImages', alternateImages.join(' | '));
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.prd-price__now')) {
      addHiddenDiv('price', document.querySelector('.prd-price__now').innerText.replace('Now', '').trim());
    }
    if (document.querySelector('.prd-price__was')) {
      addHiddenDiv('listPrice', document.querySelector('.prd-price__was').innerText.replace('Was', '').trim());
    } else if (document.querySelector('.prd-price__now')) {
      addHiddenDiv('listPrice', document.querySelector('.prd-price__now').innerText.replace('Now', '').trim());
    }

    if (document.querySelector('.prd-price__save')) {
      addHiddenDiv('promotion', document.querySelector('.prd-price__save').innerText);
    }

    if (document.querySelector('.tab-details')) {
      addHiddenDiv('description', document.querySelector('.tab-details').innerText);
      addHiddenDiv('descriptionBullets', document.querySelector('.tab-details').querySelectorAll('h2').length);
    }

    document.querySelector('.tabs__heading--specs').click();
    await stall(100);
    document.querySelector('button[data-read-more="Read more"]').click();
    await stall(100);
    const shippingDimensions = [];
    const materials = [];
    document.querySelector('table.classifications').querySelectorAll('tr').forEach(tr => {
      let rowText = tr.innerText.trim();
      if (tr.querySelector('td').innerText === 'Brand Name') {
        addHiddenDiv('brandName', rowText.replace('Brand Name', ''));
      }
      if (tr.querySelector('td').innerText === 'Weight (Approximate)') {
        addHiddenDiv('weightNet', rowText.replace('Weight (Approximate)', ''));
      }
      if (tr.querySelector('td').innerText === 'Manufacturer') {
        addHiddenDiv('manufacturer', rowText.replace('Manufacturer', ''));
      }
      if (tr.querySelector('td').innerText === 'Colour') {
        addHiddenDiv('color', rowText.replace('Colour', ''));
      }
      if (tr.querySelector('td').innerText === 'Product Model') {
        addHiddenDiv('mpc', rowText.replace('Product Model', ''));
      }
      if (tr.querySelector('td').innerText === 'Shipping Height') {
        shippingDimensions.push(rowText.replace('Shipping Height', '') + ' height');
      }
      if (tr.querySelector('td').innerText === 'Shipping Width') {
        shippingDimensions.push(rowText.replace('Shipping Width', '') + ' width');
      }
      if (tr.querySelector('td').innerText === 'Shipping Depth') {
        shippingDimensions.push(rowText.replace('Shipping Depth', '') + ' depth');
      }
      if (rowText.includes('Material')) {
        materials.push(tr.querySelectorAll('td')[1].innerText);
      }
    });

    addHiddenDiv('materials', materials.join(', '));
    addHiddenDiv('shippingDimensions', shippingDimensions.join(' x '));

    document.querySelectorAll('.badges__image').forEach(e => {
      if (e.getAttribute('alt')) {
        if (e.getAttribute('alt').includes('Warranty') || e.getAttribute('alt').includes('Guarantee')) {
          addHiddenDiv('warranty', e.getAttribute('alt'));
        }
        if (e.getAttribute('alt') === 'Product Manual') {
          addHiddenDiv('pdf', 'Yes');
        }
      }
    });

    let specificationsInd = -1;
    let  additionalInfoInd = -1;
    document.querySelectorAll('.product-features__title').forEach((e, i) => {
      if (e && e.innerText.trim() === 'Product Dimensions') {
        specificationsInd = i;
      }
      if (e && e.innerText.trim() === 'Key features') {
        additionalInfoInd = i;
      }
    });

    if (specificationsInd > -1) {
      addHiddenDiv('specifications', document.querySelectorAll('.product-features__list')[specificationsInd].innerText);
    }

    if (additionalInfoInd > -1) {
      const additionalInfo = [];
      document.querySelectorAll('.product-features__list')[additionalInfoInd].querySelectorAll('span').forEach(e => {
        additionalInfo.push(e.innerText);
      })
      addHiddenDiv('additionalInfo', '|| ' + additionalInfo.join(' || '));
    }

    addHiddenDiv('originInfo', 'GBR');
    addHiddenDiv('privacy', 'Yes');
    addHiddenDiv('terms', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');
    addHiddenDiv('zoomInfo', 'Yes');
    addHiddenDiv('rotateInfo', 'No');

    if (ratingContents) {
      const wrapper = document.createElement('div');
      wrapper.id = 'ratingContents';
      wrapper.innerHTML = ratingContents;
      document.body.appendChild(wrapper);
    }

    /*await fetch('https://mark.reevoo.com/reevoomark/en-GB/product?sku=' + productId + '&trkref=ERN')
    .then(async function (response) {
      const sometext = await response.text();
      const startText = '<body>';
      const endText = '</body>';
      const startIx = sometext.indexOf(startText);
      const endIx = sometext.indexOf(endText, startIx);
      console.log('start: ' + startIx);
      console.log('end: ' + endIx);
      const bodyContent = sometext.substring(startIx + startText.length, endIx);
      const wrapper = document.createElement('div');
      wrapper.id = 'ratingContents';
      wrapper.innerHTML = bodyContent;
      document.body.appendChild(wrapper);
      console.log('fetchFrame', bodyContent);
    }).catch(err => {
      console.log('error fetching');
    });*/

    if (document.getElementById('ratingContents')) {
      if (document.querySelector('.filtered-count.summary')) {
        addHiddenDiv('ratingCount', document.querySelector('.filtered-count.summary').innerText.replace('reviews', '').replace('review', ''). trim());
      }
      if (document.querySelector('.out-of-ten')) {
        addHiddenDiv('aggregatedRatingText', document.querySelector('.out-of-ten').innerText);
        addHiddenDiv('aggregatedRating', document.querySelector('.out-of-ten').innerText.split(' ')[0]);
      }
    }

  }, productId, ratingContents);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'euronics',
    transform: null,
    domain: 'euronics.co.ok',
  },
  implementation,
};
