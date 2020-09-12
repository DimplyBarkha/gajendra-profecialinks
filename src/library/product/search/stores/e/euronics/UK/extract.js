async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  let resultTotal = 0;
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
    resultTotal = await context.evaluate(function(resultTotal) {

      function addHiddenDiv(el, id, text) {
        const div = document.createElement('div');
        div.classList.add(id);
        div.innerHTML = text;
        el.appendChild(div);
      }

      document.querySelectorAll('.product-item__details').forEach(el => {
        if (resultTotal >= 150) {
          el.remove();
        } else {
          resultTotal++;
        }

        let name = el.querySelector('h3').innerText;
        addHiddenDiv(el, 'name', name);
        addHiddenDiv(el, 'manufacturer', name.split(' ')[0]);
        addHiddenDiv(el, 'rank', resultTotal);

        if (el.querySelector('iframe')) {
          if (el.querySelector('iframe').contentWindow.document.querySelector('reevoo-stars')) {
            addHiddenDiv(el, 'rating', el.querySelector('iframe').contentWindow.document.querySelector('reevoo-stars').getAttribute('data-score'));
          }
          if (el.querySelector('iframe').contentWindow.document.querySelector('.reevoo__section--number-of-reviews')) {
            addHiddenDiv(el, 'reviews', el.querySelector('iframe').contentWindow.document.querySelector('.reevoo__section--number-of-reviews').innerText.split(' ')[1]);
          }
        }

      });
      return resultTotal;
    }, resultTotal);

    console.log('totalResults', resultTotal);

    const results = context.extract(productDetails, { transform });
    dataResults.push(results);
    await stall(2000);

    if (hasNextButton && resultTotal < 150) {
      await context.evaluate(function() {
        document.querySelector('.pagination__item--next').querySelector('a').click();
      });
    } else {
      break;
    }
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
