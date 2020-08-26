
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

  await stall(5000);

  while(true) {
    await context.evaluate(function() {
      if (document.getElementById('onetrust-accept-btn-handler')) {
        document.getElementById('onetrust-accept-btn-handler').click();
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await stall(1000);
    let productCount = await context.evaluate(function() {
      return document.querySelectorAll('div.product--box').length;
    });
    let moreBtn = await context.evaluate(function() {
      return document.querySelector('.btn.js--load-more');
    });
    console.log('hasbtn', moreBtn)
    console.log('hasProduct', productCount);
    if (moreBtn && productCount < 150) {
      await context.click('.btn.js--load-more');
      await stall(5000);
    } else {
      break;
    }
  }

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

    document.querySelectorAll('.product--box.box--list').forEach((el, ind) => {
      if (ind > 149) {
        el.remove();
        return;
      }
      let rating = 0;
      el.querySelectorAll('.icon--star').forEach(() => {
        rating += 1;
      });
      el.querySelectorAll('.icon--star-half').forEach(() => {
        rating += .5;
      });
      addHiddenDiv(el, 'rating', rating);
      addHiddenDiv(el, 'rank', ind + 1);
    });

    await stall(500);

  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'euronics',
    transform: null,
    domain: 'euronics.de',
  },
  implementation,
};
