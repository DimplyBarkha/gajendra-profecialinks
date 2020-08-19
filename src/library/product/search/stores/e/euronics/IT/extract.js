
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const results = [];
  const resultsArr = [];

  while (true) {

     let resultsArr = await context.evaluate(async function(resultsArr) {

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

    }, resultsArr);

    let extract = await context.extract(productDetails, { transform });
    results.push(extract);



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
