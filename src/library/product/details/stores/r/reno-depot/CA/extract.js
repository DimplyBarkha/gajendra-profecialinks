async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  function stall(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms);
    })
  }

  await stall (3000);

  await context.evaluate(function() {
    document.cookie = "RenoWCCookie.province=QC";
    document.cookie = "RenoWCCookie.region.selected=QUEBEC";
    document.cookie = "RenoWCCookie.stores.selected=73020";
    location.reload();
  });

  await stall (3000);

  await context.evaluate(function() {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    addHiddenDiv('pageTimeStamp', new Date());
    addHiddenDiv('url', window.location.href);

    if (document.querySelector('.breadcrumb')) {
      document.querySelector('.breadcrumb').querySelectorAll('a').forEach(category => {
        addHiddenDiv('category', category.innerText);
      });
    }

    addHiddenDiv('price', '$' + document.querySelector('.integer').innerText + '.' + document.querySelector('.decimal').innerText);
    if (document.querySelector('.linethrough')) {
      addHiddenDiv('listPrice', document.querySelector('.linethrough').innerText.trim());
    } else {
      addHiddenDiv('listPrice', '$' + document.querySelector('.integer').innerText + '.' + document.querySelector('.decimal').innerText);
    }

    let inStore = false;
    let delivery = false;
    document.querySelectorAll('.availabilityMsg').forEach(msg => {
      if (msg.innerText.includes('In-store pick-up')) {
        inStore = true;
      }
      if (msg.innerText.includes('Home Delivery')) {
        delivery = true;
      }
    });

    if (delivery) {
      addHiddenDiv('availabilityText', 'In Stock');
    } else if (inStore) {
      addHiddenDiv('availabilityText', 'In Store Only');
    } else {
      addHiddenDiv('availabilityText', 'Out of Stock');
    }

    addHiddenDiv('bulletCount', 0);

  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'reno-depot',
    transform: null,
    domain: 'renodepot.com',
  },
  implementation,
};
