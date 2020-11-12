var { transform } = require('../VariantsFormat');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.innerHTML = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    
      const url = window.location.href;
      //@ts-ignore
      const currentSku = window.__NEXT_DATA__.props.initialState.Product.sku.id;
      let content = "";
      var skus = document.querySelectorAll("select#select-sku option");
      skus.forEach(x => {
        //@ts-ignore
        content += "<p>" + url.replace(currentSku,x.value) + "</p>";
      })
      console.log(content,'--------')
      addHiddenDiv(`document_variantsUrl`, content);
  }, createUrl);
  return await context.extract(variants, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BR',
    store: 'extra',
    transform,
    domain: 'extra.com.br',
    zipcode: '',
  },implementation
};
