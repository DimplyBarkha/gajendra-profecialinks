
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
        const variants = document.evaluate(
          '//meta[@property="og:url"]/@content | //div[@data-analytics-view-label="offerVariants"]//a/@href',
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null,
        );
        for (let i = 0; i < variants.snapshotLength; i++) {
          const div = document.createElement('div');
          div.id = 'product-variants';
          div.innerText = variants.snapshotItem(i).textContent;
          document.body.append(div);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
    return await context.extract(variants, { transform });
  },
};
