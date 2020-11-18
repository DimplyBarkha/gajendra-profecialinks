const { transform } = require('./shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'kalunga',
    transform,
    domain: 'kalunga.com.br',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      const lastPage = document.querySelector('.ultima').getAttribute('data-page');
      let inc = 1;
      const url = 'https://www.kalunga.com.br/getBusca';
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      async function getData () {
        const formData = new FormData();
        inc++;
        const jsonStr = {
          termo: location.pathname.replace('/busca/', ''),
          pagina: inc,
          ordenacao: 1,
          fitroBusca: [],
          classificacao: null,
          grupo: null,
        };
        formData.append('json_str', JSON.stringify(jsonStr));
        await fetch(url, {
          method: 'POST',
          body: formData,
        }).then(response => response.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
            if (inc < +lastPage) {
              try {
                document.getElementById('divProdutoDepartamento').innerHTML += response.templateProdutos;
                getData();
              } catch (e) {
                console.log(e);
              }
            } else {
              addElementToDocument('finish', 'finish');
            }
          });
      }
      getData();
    });
    await context.waitForSelector('#finish');
    return await context.extract(productDetails, { transform });
  },
};
