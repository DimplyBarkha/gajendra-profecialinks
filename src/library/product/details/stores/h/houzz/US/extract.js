module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "houzz",
    transform: null,
    domain: "houzz.com",
    zipcode: "",
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies
  ) => {
    await context.evaluate(() => {
      document.querySelector("li[class='hzui-tabs__label   ']").click();
    });
    await context.extract(dependencies.productDetails);
  },
};
