async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise(resolve => setTimeout(resolve, 3000));
  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    const createId = (str) => str.toLowerCase().split(/[ ,.\t]+/)[0];

    const dataSheet = document.querySelectorAll('section table tbody tr');
    Array.from(dataSheet)
      .map(node => {
        node.setAttribute('id', createId(node.innerText));
      });
  });
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'submarino',
    transform: null,
    domain: 'submarino.com.br',
    zipcode: '',
  },
  implementation,
};
