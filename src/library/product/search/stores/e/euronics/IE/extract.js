
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(async function() {

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

    let scrollTop = 0;
    while(scrollTop < 10000) {
      scrollTop += 500;
      window.scroll(0, scrollTop);
      await stall(500);
    }

    document.querySelectorAll('.item').forEach((el, ind) => {
      if (el.querySelector('.normprice')) {
        addHiddenDiv(el, 'price', el.querySelector('.normprice').innerText);
      }
      if (el.querySelector('.name')) {
        addHiddenDiv(el, 'brand', el.querySelector('.name').innerText.split(' ')[0])
      }
      addHiddenDiv(el, 'rank', ind + 1)
    });
    await stall(500);

  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IE',
    store: 'euronics',
    transform: null,
    domain: 'euronics.ie',
  },
  implementation,
};
