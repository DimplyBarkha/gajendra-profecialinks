
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonPrimeNow_75204',
    domain: 'primenow.amazon.com',
  },
  implementation: async ({ inputString }, { country, domain }, context) => {
    const cssProduct = 'table.prodDetTable tr:nth-last-child(1)';
    const isSelectorAvailable = async () => {
      console.log(`isSelectorAvailable: ${cssProduct}`);
      return await context.evaluate(function (cssProduct) {
        return !!document.querySelector(cssProduct);
      }, cssProduct);
    };
    const productAvailable = await isSelectorAvailable();
    console.log(`selectorAvailable: ${isSelectorAvailable}`);
    if (productAvailable) {
      console.log('Selector found');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  },
};
