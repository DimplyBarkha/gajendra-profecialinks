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
  await context.click('.img-link-block');
  await stall(5000);

  await context.evaluate(function() {

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
        addHiddenDiv('price', document.querySelector('.product-price.hide-for-small').innerText.trim());
      } else {
        addHiddenDiv('listPrice', document.querySelector('.product-price.hide-for-small').innerText.trim());
        addHiddenDiv('price', document.querySelector('.product-price.hide-for-small').innerText.trim());
      }
    }

    let availabilityText = "Out of Stock";
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

    if (document.querySelector('#specificationTab').querySelector('table')) {
      console.log('hasTable');
      document.querySelector('#specificationTab').querySelector('table').querySelectorAll('tr').forEach(tr => {
        if (tr.querySelectorAll('td')[0].innerText === 'Weight (kg)') {
          addHiddenDiv('weightNet', tr.querySelectorAll('td')[1].innerText);
        }
      })
    }

    document.querySelectorAll('iframe').forEach(el => {
      const frame = el.contentWindow.document;
      if (frame.querySelector('reevoo-score')) {
        addHiddenDiv('aggregatedRating', frame.querySelector('reevoo-score').getAttribute('data-score'));
        addHiddenDiv('aggregatedRatingText', frame.querySelector('reevoo-score').getAttribute('data-score') + ' out of 10');
      }
    });

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
