const { transform } = require('./variantFormat');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'keurig',
    transform,
    domain: 'keurig.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { variants }) => {
    try {
      await context.click('div#_tealiumModalClose');
    } catch (error) {
      console.log('no sign up modal found');
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    const src = await context.evaluate(async function () {
      const iframe = document.querySelector('div.comboPDPPanel__heading > ul > li:nth-child(2)') && document.querySelector('div.comboPDPPanel__heading > ul > li:nth-child(2) a');
      // @ts-ignore
      const src = iframe ? iframe.href : '';
      return src;
    });
    const src1 = await context.evaluate(async function () {
      const iframe = document.querySelector('div.comboPDPPanel__heading > ul > li:nth-child(3)') && document.querySelector('div.comboPDPPanel__heading > ul > li:nth-child(3) a');
      // @ts-ignore
      const src1 = iframe ? iframe.href : '';
      return src1;
    });
    await context.extract(variants, { transform });
    if (src !== '') {
      try {
        await context.goto(src, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('#base_image');
        await context.extract(variants, { transform });
      } catch (error) {
        console.log(error);
      }
    }
    if (src1 !== '') {
      try {
        await context.goto(src1, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
        await context.waitForSelector('#base_image');
        await context.extract(variants, { transform });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
