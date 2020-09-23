async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  let allResults = [];

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms)
    });
  }

  const resultsArr = await context.evaluate(async function() {

    const results = [];

    function stall(ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms)
      });
    }

    let scrollTop = 0;
    while(scrollTop < 5000) {
      scrollTop += 500;
      window.scroll(0, 500);
      await stall(500);
    }

    document.querySelectorAll('.g-wrap').forEach((el, ind) => {
      if (results.length >= 150) {
        return;
      }
      if (el.querySelector('h3')) {
        const name = el.querySelector('h3').innerText;
        const id = ind + 1;
        const thumbnail  = el.querySelector('img').getAttribute('src');
        const url = el.querySelector('a').getAttribute('href');
        results.push({
          name,
          id,
          thumbnail,
          url,
        });
      }
    });
    return results;
  });

  for (let result of resultsArr) {
    await context.goto(result.url);
    await stall(2000);
    await context.evaluate(async function (result) {

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      addHiddenDiv('name', result.name);
      addHiddenDiv('productUrl', result.url);
      addHiddenDiv('thumbnail', result.thumbnail);
      if (document.querySelector('span[data-price-type="finalPrice"]')) {
        addHiddenDiv('price', document.querySelector('span[data-price-type="finalPrice"]').innerText.split('includes')[0]);
      }
      if (document.querySelector('h5') && document.querySelector('h5').innerText.split(':')[1]) {
        addHiddenDiv('id', document.querySelector('h5').innerText.split(':')[1]);
      } else {
        document.querySelectorAll('small').forEach(el => {
          if (el.innerText.includes('SKU:')) {
            addHiddenDiv('id', el.innerHTML.split('<br>')[0].replace('SKU: ', ''));
          }
        });
      }
      if (document.querySelector('.bv-off-screen')) {
        addHiddenDiv('rating', document.querySelector('.bv-off-screen').innerText.split(' ')[0]);
      }
      if (document.querySelector('.dyson-bazaarvoice__reviews-link')) {
        addHiddenDiv('reviewCount', document.querySelector('.dyson-bazaarvoice__reviews-link').innerText.split(' ')[0]);
      } else {
        addHiddenDiv('reviewCount', 0);
      }

    }, result);
    const extract = await context.extract(productDetails, { transform });
    allResults.push(extract);
  }

  return allResults;
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AE',
    store: 'dyson',
    transform: transform,
    domain: 'dyson.ae',
  },
  implementation,
};
