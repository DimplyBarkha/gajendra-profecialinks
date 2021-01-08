
const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // changing language
  await context.evaluate(async () => {
    const lang = document.querySelector('div[class*="langNav"] a[href="#"]');
    if (lang !== null) {
      // @ts-ignore
      lang.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const langOpt = document.querySelector('label[for="de-m"]');
    if (langOpt !== null) {
      // @ts-ignore
      langOpt.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const langSave = document.querySelector('div[class*="modal"] button[class*="_buttonPrimary"]');
    if (langSave !== null) {
      // @ts-ignore
      langSave.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const currentUrl = await context.evaluate(async () => {
    if (window !== undefined) { return window.location.href; }
  });
  const searchTerm = await context.evaluate(async () => {
    const url = window.location.href;
    if (url.includes('?q=') && url.includes('&_fm')) { return url.match(/q=(.+)&_fm/)[1]; };
    if (url.includes('?q=') && !url.includes('&_fm')) { return url.match(/q=(.+)/)[1]; }
  });
  // manually redirecting to searchUrls, because otherwise site is autoredirecting to searchUrls that are not correct with t1 file
  if (currentUrl.includes('?q=After%20Sun%20Gesicht') || currentUrl.includes('?q=After+Sun+Gesicht')) {
    await context.goto(`https://www.zalando.de/beauty-gesichtsmaske/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (currentUrl.includes('Gesichtsbürste')) {
    await context.goto(`https://www.zalando.de/damen/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (currentUrl.includes('?q=augenbrauen%20farben')) {
    await context.goto(`https://www.zalando.de/beauty-damen/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if (currentUrl.includes('beauty-highlighter/?q') || currentUrl.includes('beauty-mascara/?q=wimperntusche') || currentUrl.includes('beauty-augenbrauengel/?q')) {
    await context.goto('https://www.zalando.de/herren/');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await context.goto(`https://www.zalando.de/herren/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  if ((!currentUrl.includes('beauty-augenbrauen/?q=') &&
  !currentUrl.includes('?q=Lidschatten&') &&
  !currentUrl.includes('?q=Damen+sneaker') &&
  !currentUrl.includes('?q=concealer+hell') &&
  !currentUrl.includes('?q=wimpern+serum+wachstum')) &&
  (currentUrl.includes('?q=primer&') ||
  currentUrl.includes('?q=duschgel+frauen') ||
  currentUrl.includes('?q=highlighter') ||
  currentUrl.includes('?q=  wimperntusche') ||
  currentUrl.includes('?q=bronzer&') ||
  currentUrl.includes('?q=Gesichtsspray') ||
  currentUrl.includes('?q=Lippenpeeling&') ||
  currentUrl.includes('?q=Lippenpflege&') ||
  currentUrl.includes('kinderschuhe-klassische-sneaker') ||
  currentUrl.includes('Wasserdichte+Jacke') ||
  currentUrl.includes('damen/?q=') ||
  currentUrl.includes('beauty-augencreme/?q') ||
  currentUrl.includes('Lippenscrub') ||
  currentUrl.includes('?q=argan%C3%B6l'))
  ) {
    await context.goto(`https://www.zalando.de/herren/?q=${searchTerm}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  await context.evaluate(() => {
    const url = window.location.href;

    const allProducts = document.querySelectorAll('div[class*="JT3_zV DvypSJ"]');
    allProducts.forEach((product, index) => {
      product.setAttribute('rank', `${index + 1}`);
    });
    const last = allProducts[allProducts.length - 1].getAttribute('rank');
    if (!url.includes('p=2')) {
      document.querySelector('body').setAttribute('itemsCount', last);
    }
    const rest = 150 - parseInt(last);
    if (url.includes('p=2')) {
      // @ts-ignore
      [...allProducts].filter(e => e.getAttribute('rank') > rest)
        .forEach(e => e.setAttribute('trim', ''));
    }
    const sponsoredProducts = document.querySelectorAll('div[class*="weHhRC"]');
    // @ts-ignore
    if (sponsoredProducts) {
      sponsoredProducts.forEach(e => {
        // @ts-ignore
        e.parentNode.classList.add('sponsored');
        // @ts-ignore
        e.parentNode.setAttribute('sponsored', 'yes');
      });
    }

    const notSponsoredProducts = document.querySelectorAll('div[class="qMZa55 SQGpu8 iOzucJ JT3_zV DvypSJ"]');
    notSponsoredProducts.forEach((product, index) => {
      product.setAttribute('rankorganic', `${index + 1}`);
    });

    const productUrl = document.querySelectorAll('article > a');
    productUrl.forEach((element) => {
      element.setAttribute('href', 'https://zalando.de'.concat(element.getAttribute('href')));
    });
  });

  var dataRef = await context.extract(productDetails, { transform });

  dataRef.forEach(e => {
    e.group.forEach((row) => {
      if (row.id) {
        row.id.forEach(item => {
          item.text = item.text ? item.text.toUpperCase() : '';
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text ? item.text.split('ab').pop().trim() : '';
        });
      }
    });
  });

  return dataRef;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    transform: transform,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation,
};
