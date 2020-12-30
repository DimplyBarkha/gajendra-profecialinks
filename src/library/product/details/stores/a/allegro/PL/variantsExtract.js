
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'PL',
    store: 'allegro',
    transform: null,
    domain: 'allegro.pl',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { variants } = dependencies;
    try {
      // await context.evaluate(() => {
      // const variants = document.evaluate(
      //   '//meta[@property="og:url"]/@content | //div[@data-analytics-view-label="offerVariants"]//a/@href',
      //   document,
      //   null,
      //   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      //   null,
      // );
      // for (let i = 0; i < variants.snapshotLength; i++) {
      //   const div = document.createElement('div');
      //   div.id = 'product-variants';
      //   div.innerText = variants.snapshotItem(i).textContent;
      //   document.body.append(div);
      // }

      // let url = null;
      // if (document.querySelector('meta[property="og:url"]')) {
      //   url = document.querySelector('meta[property="og:url"]').getAttribute('content');
      // } else if (document.querySelector('div[data-analytics-view-label="offerVariants"] a')) {
      //   url = document.querySelector('div[data-analytics-view-label="offerVariants"] a').getAttribute('href');
      // }
      // if (url.includes('//allegro.pl')) url = url.replace(/(.+-)(\d+)(\??.+)/g, '$2');
      // else url = url.replace(/(.+-i)(\d+)(.+)/g, '$2');
      // const div = document.createElement('div');
      // div.id = 'product-variants';
      // div.innerText = url;
      // if(!url.includes('listing?string')) document.body.append(div);
      // });

      // If variants are present
      await context.waitForSelector('div[data-analytics-view-label="offerVariants"]');
      await context.evaluate(() => {
        // @ts-ignore
        const variants = [...document.querySelectorAll('div[data-analytics-view-label="offerVariants"] a')];
        variants.forEach(variant => {
          const variantUrl = document.createElement('div');
          variantUrl.id = 'variants-url';
          variantUrl.innerText = variant.getAttribute('href');
          document.body.append(variantUrl);

          const variantId = document.createElement('div');
          variantId.id = 'variants-id';
          variantId.innerText = variant.getAttribute('href').replace(/(.+-)(\d+)(.+)?/, '$2');
          document.body.append(variantId);
        });
      });
    } catch (e) {
      await context.evaluate(() => {
        const noResults = document.evaluate(
          '//div[contains(@data-box-name,"Non existing offer")] | //p[contains(.,"Czy na pewno szukasz")] | //p[contains(.,"Teraz nie możemy znaleźć")] | //h3[contains(.,"Oferta została zakończona")]',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        if (noResults.snapshotLength === 0) {
          // let url = document.querySelector('meta[property="og:url"]').getAttribute('content');
          let url = window.location.href;
          url = url.split('?')[0];
          const variantUrl = document.createElement('div');
          variantUrl.id = 'variants-url';
          variantUrl.innerText = url;
          document.body.append(variantUrl);

          const variantId = document.createElement('div');
          variantId.id = 'variants-id';
          if (url.includes('.html')) {
            variantId.innerText = url.replace(/(.+-i)([0-9]+)(.htm.+)/, '$2');
          } else {
            variantId.innerText = url.replace(/(.+-)(\d+)/, '$2');
          }
          document.body.append(variantId);
        } else {
          throw new Error('Not a product page');
        }
      });
    }
    return await context.extract(variants, { transform });
  },
};
