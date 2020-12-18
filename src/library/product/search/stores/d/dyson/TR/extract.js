async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const allResults = [];

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

    let scrollTop = 0;
    while (scrollTop < 5000) {
      scrollTop += 500;
      window.scroll(0, 500);
      await stall(250);
    }

    function addHiddenDiv (el, id, text) {
      const div = document.createElement('div');
      div.innerHTML = text;
      div.classList.add(id);
      el.appendChild(div);
    }

    let count = 0;
    if (document.querySelector('.card__inner')) {
      document.querySelectorAll('.card__inner').forEach((el, ind) => {
        if (count >= 150) {
          return;
        }
        if (el.querySelector('h3')) {
          el.classList.add('productInfo');
          const name = el.querySelector('h3').innerText;
          const id = ind + 1;
          const thumbnail = el.querySelector('img').getAttribute('src');
          const url = el.querySelector('a').getAttribute('href');
          const splitURL = url.split('-');
          addHiddenDiv(el, 'name', name);
          addHiddenDiv(el, 'id', splitURL[splitURL.length - 2] + '-' + splitURL[splitURL.length - 1]);
          addHiddenDiv(el, 'thumbnail', thumbnail);
          addHiddenDiv(el, 'url', url);
          count++;
        }
      });
    } else {
      document.querySelectorAll('.g-wrap').forEach((el, ind) => {
        if (count >= 150) {
          return;
        }
        if (el.querySelector('h3')) {
          el.classList.add('productInfo');
          const name = el.querySelector('h3').innerText;
          const id = ind + 1;
          const thumbnail = el.querySelector('img').getAttribute('src');
          const url = el.querySelector('a').getAttribute('href');
          const splitURL = url.split('-');
          addHiddenDiv(el, 'name', name);
          addHiddenDiv(el, 'id', splitURL[splitURL.length - 2] + '-' + splitURL[splitURL.length - 1]);
          addHiddenDiv(el, 'thumbnail', thumbnail);
          addHiddenDiv(el, 'url', url);
          count++;
        }
      });
    }
  });
  const extract = await context.extract(productDetails, { transform });
  allResults.push(extract);
  return allResults;
}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'dyson',
    transform: transform,
    domain: 'dyson.com.tr',
  },
  implementation,
};
