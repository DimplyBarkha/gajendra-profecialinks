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

  const productUrl = await context.evaluate(function() {
    return window.location.href;
  });

  const sku = await context.evaluate(function() {
    if (document.querySelector('.sku-man.hide-for-small')) {
      return document.querySelector('.sku-man.hide-for-small').innerText.split(' ')[1];
    }
  });


  let ratingsAndReviews = await context.evaluate(async function (sku) {
    return await fetch(`https://mark.reevoo.com/reevoomark/product_summary?locale=en-IE&sku=${sku}&trkref=ERI&callback=ReevooLib.Data.callbacks`)
      .then(response => response.text());
  }, sku);

  if (ratingsAndReviews) {
   ratingsAndReviews = ratingsAndReviews.substring(ratingsAndReviews.indexOf('{')).replace('})', '}');
  }

  await context.evaluate(async function(ratingsAndReviews) {

    function stall(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms)
      })
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(300);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    function addDivWithClass(name, content) {
      const newDiv = document.createElement('div');
      newDiv.classList.add(name);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    if (ratingsAndReviews) {
      const ratingsAndReviewsData = JSON.parse(ratingsAndReviews);
      addHiddenDiv('ratingCount', ratingsAndReviewsData.review_count);
      if (ratingsAndReviewsData.average_score) {
        addHiddenDiv('aggregatedRating', (ratingsAndReviewsData.average_score / 2).toString().replace('.',','));
        addHiddenDiv('aggregatedRatingText', (ratingsAndReviewsData.average_score / 2).toString().replace('.',',') + ' out of 5');
      }
    }

    if (document.getElementById('thumbnails') && document.getElementById('thumbnails').querySelector('a')) {
      addHiddenDiv('primaryImage', 'https://euronics.ie/' + document.getElementById('thumbnails').querySelector('a').getAttribute('href'));
    }

    const alternateImages = [];
    if (document.querySelector('.thumb-box')) {
      document.querySelector('.thumb-box').querySelectorAll('img').forEach((e, ind) => {
        if (ind > 0) {
          alternateImages.push('https://euronics.ie/' + e.getAttribute('data-zoom'));
        }
      });
    }
    addHiddenDiv('alternateImages', alternateImages.join(' | '));
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.breadcrumbs')) {
      document.querySelector('.breadcrumbs').querySelectorAll('li').forEach((e, ind) => {
        if (ind > 0) {
          addDivWithClass('category', e.innerText);
        }
      });
      document.querySelectorAll('.category')[document.querySelectorAll('.category').length - 1].remove();
    }

    if (document.querySelector('.nosto_product')) {
      addHiddenDiv('price', '€' + document.querySelector('.nosto_product').querySelector('.price').innerText);
      addHiddenDiv('listPrice', '€' + document.querySelector('.nosto_product').querySelector('.list_price').innerText);
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
    document.querySelector('#specificationTab').querySelectorAll('h3, h4, p').forEach(el => {
      if(el.tagName === 'H3' || el.tagName === 'H4') {
        description += ' || ' + el.innerText;
      } else {
        description += el.innerText;
      }
    });
    if (description.length) {
      addHiddenDiv('description', description);
    }

    if (document.querySelector('.sku-man.hide-for-small')) {
      addHiddenDiv('brandName', document.querySelector('.sku-man.hide-for-small').innerText.split(' ')[0]);
      addHiddenDiv('sku', document.querySelector('.sku-man.hide-for-small').innerText.split(' ')[1]);
    }

    let enhancedContent = '';
    const manufacturerImages = [];
    const videos = [];
    if (document.getElementById('flix-inpage')) {
      enhancedContent = document.getElementById('flix-inpage').innerText;
      console.log('hasFlix', enhancedContent);
      document.getElementById('flix-inpage').querySelectorAll('img').forEach(img => {
        manufacturerImages.push(img.getAttribute('src'));
      });
      if (document.querySelector('.flix-std-specs-table')) {
        document.querySelector('.flix-std-specs-table').querySelectorAll('tr').forEach(tr => {
          if (tr.querySelector('.flix-value').querySelector('span').innerText === 'Weight') {
            addHiddenDiv('weightNet', tr.querySelector('.flix-title').innerText);
          }
        });
      }
    }

    const specifications = [];
    if (document.querySelector('#specificationTab').querySelector('table')) {
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

    document.querySelectorAll('iframe').forEach(el => {
      if (el.getAttribute('src') && el.getAttribute('src').includes('youtube')) {
        videos.push(el.getAttribute('src'));
      }
    });

    if (document.querySelector('.shippingFrom')) {
      addHiddenDiv('shippingInfo', document.querySelector('.shippingFrom').querySelector('div').innerText);
    }

    document.querySelectorAll('video').forEach(video => {
      videos.push(video.getAttribute('src'));
    });
    addHiddenDiv('videos', videos.join(' | '));
    addHiddenDiv('terms', 'Yes');
    addHiddenDiv('privacy', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');

    if (document.querySelector('#flix_selector_3d')) {
      addHiddenDiv('rotateInfo', 'Yes');
    }

  }, ratingsAndReviews);
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
