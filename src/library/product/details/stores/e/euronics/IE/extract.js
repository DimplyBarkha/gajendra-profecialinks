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

  await context.waitForXPath('//a[@class="img-link-block"]');

  const price = await context.evaluate(function() {
    if (document.querySelector('.normprice')) {
      return document.querySelector('.normprice').innerText;
    }
  });

  await context.click('.img-link-block');
  await stall(5000);

  await context.evaluate(function(price) {

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const alternateImages = [];
    if (document.querySelector('.thumb-box')) {
      document.querySelector('.thumb-box').querySelectorAll('img').forEach(e => {
          alternateImages.push(e.getAttribute('data-zoom'));
      });
    }
    addHiddenDiv('alternateImages', alternateImages.join(' | '));
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);
    if (document.querySelector('.product-price.hide-for-small')) {
      if (document.querySelector('.product-price.hide-for-small').querySelector('.oldprice')) {
        addHiddenDiv('listPrice', document.querySelector('.product-price.hide-for-small').querySelector('.oldprice').innerText.split(' ')[1]);
      } else {
        addHiddenDiv('listPrice', document.querySelector('.product-price.hide-for-small').innerText.trim());
      }
    }

    if (price) {
      addHiddenDiv('price', price);
    }

    let availabilityText = "Out of Stock";
    if (document.querySelector('a[href="/click-and-reserve?product-page"]')) {
      availabilityText = "In Store Only";
    }
    if (document.querySelector('a[href="#cart-added-message"]')) {
      availabilityText = "In Stock";
    }
    addHiddenDiv('availabilityText', availabilityText);

    let description = '';
    document.querySelector('#specificationTab').querySelectorAll('h3, p').forEach(el => {
      console.log('tagName', el.tagName);
      if(el.tagName === 'H3') {
        description += ' || ' + el.innerText;
      } else {
        description += el.innerText;
      }
    });
    if (description.length) {
      addHiddenDiv('description', description);
      addHiddenDiv('descriptionBullets', document.querySelector('#specificationTab').querySelectorAll('h3').length);
    }

    if (document.querySelector('.sku-man.hide-for-small')) {
      addHiddenDiv('brandName', document.querySelector('.sku-man.hide-for-small').innerText.split(' ')[0]);
      addHiddenDiv('sku', document.querySelector('.sku-man.hide-for-small').innerText.split(' ')[1]);
    }

    const specifications = [];
    if (document.querySelector('#specificationTab').querySelector('table')) {
      console.log('hasTable');
      document.querySelector('#specificationTab').querySelector('table').querySelectorAll('tr').forEach(tr => {
        if (tr.querySelectorAll('td')[0].innerText === 'Weight (kg)') {
          addHiddenDiv('weightNet', tr.querySelectorAll('td')[1].innerText);
        }
        if (tr.querySelectorAll('td')[0].innerText === 'Colour') {
          addHiddenDiv('color', tr.querySelectorAll('td')[1].innerText);
        }
        if (tr.querySelectorAll('td')[0].innerText === 'Warranty') {
          addHiddenDiv('warranty', tr.querySelectorAll('td')[1].innerText);
        }
        if (tr.querySelectorAll('td')[0].innerText === 'Width (mm)') {
          specifications.push(tr.querySelectorAll('td')[1].innerText + ' width');
        }
        if (tr.querySelectorAll('td')[0].innerText === 'Height (mm)') {
          specifications.push(tr.querySelectorAll('td')[1].innerText + ' height');
        }
        if (tr.querySelectorAll('td')[0].innerText === 'Length (mm)') {
          specifications.push(tr.querySelectorAll('td')[1].innerText + ' length');
        }
      })
    }

    if (specifications.length) {
      addHiddenDiv('specifications', specifications.join(' x '));
    }

    const videos = [];
    document.querySelectorAll('iframe').forEach(el => {

      if (el.getAttribute('src') && el.getAttribute('src').includes('youtube')) {
        videos.push(el.getAttribute('src'));
      }

      if(!el.getAttribute('src')) {
        console.log('hasRatings');
        const frame = el.contentWindow.document;
        if (frame.querySelector('reevoo-score')) {
          addHiddenDiv('aggregatedRating', frame.querySelector('reevoo-score').getAttribute('data-score'));
          addHiddenDiv('aggregatedRatingText', frame.querySelector('reevoo-score').getAttribute('data-score') + ' out of 10');
        }
        if (frame.querySelector('.reevoo__section--number-of-reviews')) {
          addHiddenDiv('ratingCount', frame.querySelector('.reevoo__section--number-of-reviews').innerText.split(' ')[0]);
        }
      }
    });

    if (document.querySelector('.shippingFrom')) {
      addHiddenDiv('shippingInfo', document.querySelector('.shippingFrom').querySelector('div').innerText);
    }

    document.querySelectorAll('video').forEach(video => {
      videos.push(video.getAttribute('src'));
    });
    addHiddenDiv('videos', videos.join(' | '));

    if (document.querySelector('#flix-inpage')) {
      addHiddenDiv('manufacturerDescription', document.querySelector('#flix-inpage').innerText);
      const manufacturerImgs = [];
      document.querySelector('#flix-inpage').querySelectorAll('img').forEach(el => {
        manufacturerImgs.push(el.getAttribute('src'));
      });
      addHiddenDiv('manufacturerImages', manufacturerImgs);
    }

    addHiddenDiv('terms', 'Yes');
    addHiddenDiv('privacy', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');

    if (document.querySelector('#flix_selector_3d')) {
      addHiddenDiv('rotateInfo', 'Yes');
    }

  }, price);
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
