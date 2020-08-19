
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  const results = [];
  let resultsArr = [];

  while (true) {

    await context.waitForXPath('//div[@class="productCard j-productCard j-comparisonItem "]');
    await stall(3000);
    const hasNextButton = await context.evaluate(function() {
      let nextBtn = null;
      document.querySelectorAll('.pageNumber__item').forEach((el, ind) => {
        if(el.classList.contains('active')) {
          nextBtn = document.querySelectorAll('.pageNumber__item')[ind + 1];
        }
      });
      return nextBtn;
    });

     resultsArr = await context.evaluate(async function(resultsArr) {

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      function addHiddenDiv(el, id, text) {
        const div = document.createElement('div');
        div.innerHTML = text;
        div.classList.add(id);
        el.appendChild(div);
      }

      document.querySelectorAll('.j-comparisonItem').forEach(el => {
        if (resultsArr.length >= 150) {
           el.remove();
         } else {
           resultsArr.push(true);
        }
        addHiddenDiv(el, 'rank', resultsArr.length);
      });

      return resultsArr;

    }, resultsArr);

    console.log('totalResults', resultsArr.length);

    let extract = await context.extract(productDetails, { transform });
    results.push(extract);

    await stall(1000);

    if (hasNextButton && resultsArr.length < 150) {
      await context.evaluate(function() {
        document.querySelectorAll('.pageNumber__item').forEach((el, ind) => {
          if(el.classList.contains('active')) {
            return document.querySelectorAll('.pageNumber__item')[ind + 1].querySelector('a').click();
          }
        });
      });
    } else {
      break;
    }

  }

  return results;

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    transform: null,
    domain: 'euronics.it',
  },
  implementation,
};
