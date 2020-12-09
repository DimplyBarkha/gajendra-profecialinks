

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let variantDivExtra = document.querySelector('span.b__7jdsnZPqd');
    if(variantDivExtra) {
      variantDivExtra.click();
    }
    let variantDiv = document.querySelectorAll('div.b_5w6zb4tA_L')[0];
    let variantFil = variantDiv.querySelectorAll('span.b_1vzk4iYy5n');
    console.log(variantFil , 'variantFil');
    let variantUrl
    variantFil.forEach(element => {
      element.click();
      console.log(window.location.href , 'window.location.href');
      variantUrl = window.location.href
      const secondaryImageLink = document.createElement('div');
      secondaryImageLink.setAttribute('class', 'variantUrl');
      secondaryImageLink.setAttribute('href', element.baseURI);
      document.body.appendChild(secondaryImageLink);
    });

  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    transform: null,
    domain: 'pokupki.market.yandex.ru',
    zipcode: '',
  },
  implementation
};