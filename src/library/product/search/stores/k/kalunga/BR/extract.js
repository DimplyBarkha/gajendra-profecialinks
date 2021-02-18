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
    await context.waitForSelector('.paginate-async');
    await context.evaluate(() => {
      let lastPage = 1;
      try {
        lastPage = document.querySelector('.ultima').getAttribute('data-page');
      } catch (e) {
        lastPage = 1;
      }
      const maxRes = 3; // equals 150 items
      let inc = 1;
      const url = 'https://www.kalunga.com.br/getBusca';

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      addElementToDocument('search_terms', location.pathname.replace('/busca/', ''));
      addElementToDocument('url', location.href);

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
            if (inc <= +lastPage && inc <= maxRes) {
              try {
                document.getElementById('divProdutoDepartamento').innerHTML += response.templateProdutos;
                getData();
              } catch (e) {
                console.log(e);
              }
            } else {
              const hrefs = [];
              const el = document.getElementsByClassName('blocoproduto__link');
              for (let i = 0; i < el.length; i++) {
                hrefs.push(el[i].getAttribute('href'));
              }
              const results = document.querySelector('.spnQtdeRegistros').innerText;
              addElementToDocument('hrefs', hrefs);
              const els = document.querySelectorAll('.blocoproduto');
              els.forEach((el, index) => {
                if (results * 1 < 150) {
                  el.setAttribute('id', `id-${index + 1}`);
                  if (index + 1 > results * 1) {
                    document.getElementById(`id-${index + 1}`).remove();
                  }
                }
              });
            }
          });
      }

      getData();
    });
    await context.waitForSelector('#hrefs', { timeout: 20000 });
    return await context.extract(productDetails, { transform });
  },
};
