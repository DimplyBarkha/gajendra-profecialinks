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

    function addHiddenDiv(id, text) {
      let div = document.createElement('div');
      div.id = id;
      div.innerHTML = text;
      document.body.appendChild(div);
    }

    function addHiddenDivWithClass(name, text) {
      let div = document.createElement('div');
      div.classList.add(name);
      div.innerHTML = text;
      document.body.appendChild(div);
    }

    const alternateImages = [];
    document.querySelectorAll('.image--box').forEach((el, ind) => {
      if (ind === 0) {
        addHiddenDiv('primaryImage', 'https://euronics.de' + el.querySelector('span').getAttribute('data-img-large'));
      } else {
        alternateImages.push('https://euronics.de' + el.querySelector('span').getAttribute('data-img-large'));
      }
    });

    const categories = [];
    document.querySelectorAll('.breadcrumb--title').forEach(el => {
      categories.push(el.innerText);
    });
    categories.pop();
    categories.shift();
    categories.forEach(category => {
      addHiddenDivWithClass('category', category);
    });

    addHiddenDiv('price', '€' + document.querySelector('meta[itemprop="price"]').getAttribute('content'));

    let inStore = false;
    let delivery = false;
    if (document.getElementById('buybox--button') && document.querySelector('.buy-btn--cart-add')) {
      delivery = true;
    }

    if (document.getElementById('product--details-merchant-information')) {
      inStore = true;
    }

    let description = '';
    let bulletCount = 0;
    if (document.querySelector('.product-highlights--block')) {
      document.querySelector('.product-highlights--block').querySelectorAll('li').forEach(el => {
        description += '|| ' + el.innerText + ' ';
        bulletCount++;
      });
    }
    if (document.querySelector('.product--description') && document.querySelector('.product--description').querySelector('b')) {
      description += document.querySelector('.product--description').querySelector('b').innerText;
    }
    addHiddenDiv('description', description);
    addHiddenDiv('descriptionBullets', bulletCount);

    addHiddenDiv('brand', document.querySelector('.product--supplier-link').querySelector('img').getAttribute('alt'));

    if (delivery) {
      addHiddenDiv('availabilityText', 'In Stock');
    } else if (inStore) {
      addHiddenDiv('availabilityText', 'In Store Only');
    } else {
      addHiddenDiv('availabilityText', 'Out of Stock');
    }

    addHiddenDiv('alternateImages', alternateImages.join(' | '));

    if (document.querySelector('meta[itemprop="ratingValue"]')) {
      addHiddenDiv('aggregateRatingText', document.querySelector('meta[itemprop="ratingValue"]').getAttribute('content') + ' out of 10')
    }

    document.querySelectorAll('.margin-10-0').forEach(el => {
      if (el.innerText.includes('Artikelnummer:')) {
        addHiddenDiv('sku', el.innerText.replace('Artikelnummer:', '').trim());
      }
      if (el.innerText.includes('EAN:')) {
        addHiddenDiv('gtin', el.innerText.replace('EAN:', '').trim());
      }
      if (el.innerText.includes('Hersteller Artikelnummer:')) {
        addHiddenDiv('mpc', el.innerText.replace('Hersteller Artikelnummer:', '').trim());
      }
    });

    const specifications = [];
    if (document.querySelector('a[data-tabname="technical_details"]')) {
      document.querySelector('a[data-tabname="technical_details"]').click();
      await stall(200);
      document.querySelectorAll('.table-row').forEach(el => {
        if (el.querySelector('.table-attribut').innerText.includes('Gewicht (kg)')) {
          addHiddenDiv('weightNet', el.querySelector('.table-attribut-value').innerText + ' kg');
        }
        if (el.querySelector('.table-attribut').innerText.includes('Gehäuse-Farben')) {
          addHiddenDiv('color', el.querySelector('.table-attribut-value').innerText);
        }
        if (el.querySelector('.table-attribut').innerText.includes('Breite (cm)')) {
          specifications.push(el.querySelector('.table-attribut-value').innerText + ' Breite (cm)');
        }
        if (el.querySelector('.table-attribut').innerText.includes('Höhe (cm)')) {
          specifications.push(el.querySelector('.table-attribut-value').innerText + ' Höhe (cm)');
        }
        if (el.querySelector('.table-attribut').innerText.includes('Tiefe (cm)')) {
          specifications.push(el.querySelector('.table-attribut-value').innerText + ' Tiefe (cm)');
        }
      })
    }
    addHiddenDiv('specifications', specifications.join(' x '));


    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);
    addHiddenDiv('terms', 'Yes');
    addHiddenDiv('privacy', 'Yes');
    addHiddenDiv('customerServiceAvailability', 'Yes');
    addHiddenDiv('zoomInfo', 'Yes');
    addHiddenDiv('pdf', 'No');

  });


  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'euronics',
    transform: null,
    domain: 'euronics.de',
  },
  implementation,
};
