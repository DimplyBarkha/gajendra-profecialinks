const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function autoScroll () {
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
  autoScroll();

  const addRanking = async function (context) {
    await context.evaluate(async function () {
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      const lastProductPosition = localStorage.getItem('prodCount')
        ? Number(localStorage.getItem('prodCount'))
        : 1;
      const arr = document.querySelectorAll(
        '.ProductFlexBox__StyledListItem-sc-1xuegr7-0.cBIIIT',
      );
      for (let i = 0; i < arr.length; i++) {
        addElementToDocument(arr[i], 'pd_rank', lastProductPosition + i);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + arr.length}`);
    });
  };

  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll(
        '.ProductFlexBox__StyledListItem-sc-1xuegr7-0.cBIIIT',
      );
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addRanking(context);
  await addSearchUrl(context);

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
  implementation,
};
