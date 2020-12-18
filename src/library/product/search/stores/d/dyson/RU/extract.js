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

  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function addHiddenDiv (el, id, text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      div.classList.add(id);
      el.appendChild(div);
    }

    function addHiddenDiv (el, id, text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      div.classList.add(id);
      el.appendChild(div);
    }

    let count = 0;
    if (document.querySelector('.item')) {
      document.querySelectorAll('.item').forEach((el, ind) => {
        if (count >= 150) {
          return;
        }
        if (el.querySelector('.rating-amount')) {
          addHiddenDiv(el, 'ratingCount', el.querySelector('.rating-amount').innerText.split(' ')[0]);
        }
        if (el.querySelector('.stars-full')) {
          const ratingWidth = el.querySelector('.stars-full').style.width;
          console.log('ratingWidth', ratingWidth);
          addHiddenDiv(el, 'rating', (Number(ratingWidth.replace('%', '')) / 20).toFixed(2));
        }
        const thumbnail = el.querySelector('img').getAttribute('src');
        addHiddenDiv(el, 'thumbnail', 'https://shop.dyson.ru' + thumbnail);
        count++;
      });
    }
  });
  return await context.extract(productDetails, { transform });
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'RU',
    store: 'dyson',
    transform: transform,
    domain: 'dyson.ru',
  },
  implementation,
};
