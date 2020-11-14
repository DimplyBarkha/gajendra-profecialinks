
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

  await context.evaluate(function () {
    document.cookie = 'RenoWCCookie.province=QC';
    document.cookie = 'RenoWCCookie.region.selected=QUEBEC';
    document.cookie = 'RenoWCCookie.stores.selected=73020';
    location.reload();
  });

  await stall(3000);

  await context.evaluate(function () {
    function addHiddenDiv (el, myClass, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', myClass);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    document.querySelectorAll('.col-xs-6').forEach((el, ind) => {
      if (ind >= 150) {
        el.remove();
      }  else if (el && el.id && el.id.includes('plumbing_tile')) {
        console.log('this is a advertisement div - hence ignoring this');
      } else {
        addHiddenDiv(el, 'itemId', el.querySelector('.sku').innerText.replace('Article', '').replace('#', '').trim());
        addHiddenDiv(el, 'rank', ind + 1);
        addHiddenDiv(el, 'price', '$' + el.querySelector('.integer').innerText);
        addHiddenDiv(el, 'reviewCount', el.querySelector('.bv-rating-number').innerText.replace(')', '').replace('(', ''));
        const bgStyle = el.querySelector('.product_img').getAttribute('style');
        addHiddenDiv(el, 'thumbnail', bgStyle.replace("');", '').replace("background-image:url('", ''));
      }
    });
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'reno-depot',
    transform: null,
    domain: 'renodepot.com',
  },
  implementation,
};
