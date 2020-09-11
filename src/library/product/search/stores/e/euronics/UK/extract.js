
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  let resultArr = [];
  let dataResults = [];

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms)
    });
  }

  while(true) {
    await stall(5000);
    const hasNextButton = await context.evaluate(function() {
      return document.querySelector('.pagination__item--next') && document.querySelector('.pagination__item--next').querySelector('a');
    });
    resultArr = await context.evaluate(function(resultArr) {

      function addHiddenDiv(el, id, text) {
        const div = document.createElement('div');
        div.classList.add(id);
        div.innerHTML = text;
        el.appendChild(div);
      }

      document.querySelectorAll('.product-listing__item').forEach(el => {
        if (resultArr.length < 150) {

          let resultObj = {};
          let name = el.querySelector('h3').innerText;
          resultObj['name'] = name;
          resultObj['manufacturer'] = name.split(' ')[0];
          resultObj['rank'] = resultArr.length + 1;
          //addHiddenDiv(el, 'name', name);
          //addHiddenDiv(el, 'manufacturer', name.split(' ')[0]);
          //addHiddenDiv(el, 'rank', resultArr.length);

          if (el.querySelector('.product-card__image-wrap')) {
            const splitHref =  el.querySelector('.product-card__image-wrap').getAttribute('href').split('/');
            const sku = splitHref[splitHref.length - 1];
            resultObj['id'] = sku;
            //addHiddenDiv(el, 'id', sku);
            resultObj['url'] = 'https://euronics.co.uk' + el.querySelector('.product-card__image-wrap').getAttribute('href');
            //addHiddenDiv(el, 'url', 'https://euronics.co.uk' + el.querySelector('.product-card__image-wrap').getAttribute('href'));
          }

          resultArr.push(resultObj);
        }

      });
      return resultArr;
    }, resultArr);

    console.log('totalResults', resultArr.length);

    if (hasNextButton && resultArr.length < 24) {
      await context.evaluate(function() {
        document.querySelector('.pagination__item--next').querySelector('a').click();
      });
    } else {
      break;
    }
  }

  for (let result of resultArr) {
    try {
      await context.goto('https://mark.reevoo.com/reevoomark/en-GB/product?sku='+ result.id + '&trkref=ERN');
    } catch {
      
    }
    const results = context.extract(productDetails, { transform });
    dataResults.push(results);
    await stall(2000);
  }

  return dataResults;

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'euronics',
    transform: null,
    domain: 'euronics.co.uk',
  },
  implementation,
};
