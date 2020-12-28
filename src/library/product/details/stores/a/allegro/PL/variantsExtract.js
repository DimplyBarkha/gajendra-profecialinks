
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
      await context.evaluate(() => {
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
        let url = null;
        if (document.querySelector('meta[property="og:url"]')) {
          url = document.querySelector('meta[property="og:url"]').getAttribute('content');
        } else if (document.querySelector('div[data-analytics-view-label="offerVariants"] a')) {
          url = document.querySelector('div[data-analytics-view-label="offerVariants"] a').getAttribute('href');
        }
        if (url.includes('//allegro.pl')) url = url.replace(/(.+-)(\d+)(\??.+)/g, '$2');
        else url = url.replace(/(.+-i)(\d+)(.+)/g, '$2');
        const div = document.createElement('div');
        div.id = 'product-variants';
        div.innerText = url;
        if(!url.includes('listing?string')) document.body.append(div);
      });
    } catch (e) {
      console.log(e.message);
    }
    return await context.extract(variants, { transform });
  },
};
