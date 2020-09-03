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

  const gtin  = await context.evaluate(function() {
    let gtin = null;
    document.querySelectorAll('.margin-10-0').forEach(el => {
      if (el.innerText.includes('EAN:')) {
        gtin = el.innerText.replace('EAN:', '').trim();
      }
    });
    return gtin;
  })

  const currentUrl = await context.evaluate(function(){
    return window.location.href;
  });

  let enhancedContent = '';
  let manufacturerImages = '';
  let videos = '';
  if (gtin) {
    await context.goto('https://service.loadbee.com/ean/' + gtin + '/de_DE?css=default&template=default&data=%7B%22shop%22%3A%22www.euronics.de%22%2C%22source%22%3A%22inpage%22%2C%22api%22%3A%22fGy5uftNFDeUaTCCGbzAfZhpZZH5xnbC%22%7D');
    enhancedContent = await context.evaluate(function() {
      if (document.querySelector('.logo-wrapper')) {
        return document.body.innerText;
      }
    });

    manufacturerImages = await context.evaluate(function() {
      if (document.querySelector('.legal')) {
        document.querySelector('.legal').remove();
      }
      if (document.querySelector('.logo-wrapper')) {
        let imgs = [];
        document.querySelectorAll('img').forEach(img => {
          if (img.parentElement && !img.parentElement.classList.contains('logo-wrapper')) {
            imgs.push((img.getAttribute('src').includes('https:') ? '' : 'https:') + img.getAttribute('src'));
          }
        });
        return imgs.join(' | ');
      }
    });

    videos = await context.evaluate(function() {
      if (document.querySelector('.logo-wrapper')) {
        let videos = [];
        document.querySelectorAll('video').forEach(video => {
          if (video.querySelector('source')) {
            videos.push(video.querySelector('source').getAttribute('src'));
          }
        });
        document.querySelectorAll('.play-btn').forEach(btn => {
          if (!videos.includes(btn.getAttribute('data-video'))) {
            videos.push(btn.getAttribute('data-video'));
          }
        });
        return videos.join(' | ');
      }
    });

    await context.goto(currentUrl);
    await stall(5000);

  }

  await context.evaluate(async function(enhancedContent, manufacturerImages, videos) {

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

    addHiddenDiv('enhancedContent', enhancedContent);
    addHiddenDiv('manufacturerImages', manufacturerImages);
    addHiddenDiv('videos', videos);

    const alternateImages = [];
    document.querySelectorAll('.image--box').forEach((el, ind) => {
      if (ind === 0) {
        addHiddenDiv('primaryImage', 'https:' + el.querySelector('span').getAttribute('data-img-large'));
      } else {
        alternateImages.push('https:' + el.querySelector('span').getAttribute('data-img-large'));
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

    addHiddenDiv('price', '€' + document.querySelector('meta[itemprop="price"]').getAttribute('content').replace('.', ','));

    let inStore = false;
    let delivery = false;
    if (document.getElementById('buybox--button') && document.querySelector('.buy-btn--cart-add')) {
      delivery = true;
    }

    if (document.getElementById('product--details-merchant-information')) {
      inStore = true;
    }

    let description = '';
    let additionalDescBulletInfo = '';
    let bulletCount = 0;
    if (document.querySelector('.product-highlights--block')) {
      document.querySelector('.product-highlights--block').querySelectorAll('li').forEach(el => {
        description += '|| ' + el.innerText + ' ';
        additionalDescBulletInfo += '|| ' + el.innerText + ' ';
        bulletCount++;
      });
    }
    if (document.querySelector('.product--description') && document.querySelector('.product--description')) {
      description += '|| ' + document.querySelector('.product--description').innerText;
    }
    addHiddenDiv('description', description);
    addHiddenDiv('additionalDescBulletInfo', additionalDescBulletInfo);
    addHiddenDiv('descriptionBullets', bulletCount);

    document.querySelectorAll('script').forEach(el => {
      const match = el.innerHTML.match(/\"productBrand\"\: \'[0-9a-zA-Z]+\'/);
      if (match && match.length) {
        addHiddenDiv('brand', match[0].replace(/\"productBrand\"/g, '').replace(": '",'').replace("'", ''));
      }
    })

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
        addHiddenDiv('variantId', el.innerText.replace('Artikelnummer:', '').trim());
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

  }, enhancedContent, manufacturerImages, videos);


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
