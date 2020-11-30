const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const checkUrl = async function (context) {
    async function currentUrl () {
      return await context.evaluate(function () {
        let url = document.location.href;
        if (url.includes('shop/marke/')) {
          url = url.match(/(?<=marke\/)\w+/)[0];
          return url;
        }
        if (url.includes('de/category/')) {
          url = url.match(/(?<=category\/)\w+/)[0];
          return url;
        }
        return false;
      });
    }
    const url = await currentUrl();

    if (url) {
      await context.goto(
        `https://www.mediamarkt.de/de/search.html?query=%27${url}%27`,
        {
          timeout: 700000,
          waitUntil: 'load',
          checkBlocked: true,
          actionTimeout: 700000,
        },
      );
    }
  };

  await checkUrl(context);
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
