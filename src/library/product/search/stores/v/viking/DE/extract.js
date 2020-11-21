module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'viking',
    transform: null,
    domain: 'viking.de',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 10000) {
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 10000) {
            await stall(1000);
            break;
          }
        }
        function stall (ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
        const popup = document.querySelector('.QSIWebResponsive');
        if (popup) {
          const button = document.querySelector('.QSIWebResponsive > div:last-child > div > div:last-child > button:last-child');
          button.click();
        }
      });
    };
    const addUrl = async function (context) {
      await context.evaluate(async function () {
        const url = document.location.href;
        const productList = document.querySelectorAll('li.search-results__result');
        productList.forEach(product => product.setAttribute('searchurl', url));
      });
    };
    const addRanking = async function (context) {
      await context.evaluate(async function () {
        function addElementToDocument (doc, key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          doc.appendChild(catElement);
        }
        const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
        const arr = document.querySelectorAll('li.search-results__result');
        for (let i = 0; i < arr.length; i++) {
          addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
        }
        localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
      });
    };

    await applyScroll(context);
    await addUrl(context);
    await addRanking(context);
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
