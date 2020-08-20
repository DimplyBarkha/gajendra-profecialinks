
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

  await context.evaluate(async function() {

    function createContainer() {
      const div = document.createElement('div');
      div.classList.add('itemFromApi');
      document.body.appendChild(div);
      return div;
    }

    function addHiddenDiv(container, name, text) {
      const div = document.createElement('div');
      div.classList.add(name);
      div.innerHTML = text;
      container.appendChild(div);
    }

    const searchObj = {
      page: 1,
      pageSize: 150,
      search: document.getElementById('txtBuscador').value,
    }
    await fetch('https://www.euronics.es/search/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(searchObj)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data && data.hits && data.hits.length) {
        data.hits.forEach((product, ind) => {
          const newDiv = createContainer();
          addHiddenDiv(newDiv, 'rank', ind + 1);
          addHiddenDiv(newDiv, 'name', product.name);
          addHiddenDiv(newDiv, 'id', product.id);
          addHiddenDiv(newDiv, 'url', 'https://euronics.es' + product.url);
          addHiddenDiv(newDiv, 'image', product.image);
          addHiddenDiv(newDiv, 'brand', product.brand.name);
          addHiddenDiv(newDiv, 'price', product.price + ' €');
        });
      }
    });
  });

  return await context.extract(productDetails, { transform });

}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'euronics',
    transform: null,
    domain: 'euronics.es',
  },
  implementation,
};
