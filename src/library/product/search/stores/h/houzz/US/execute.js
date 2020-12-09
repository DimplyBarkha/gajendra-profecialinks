async function implementation(inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    var btn = document.createElement("div");
    btn.setAttribute("id", "store_id");
    btn.setAttribute("value", "houzz");
    document.body.appendChild(btn);
  });
  return await context.extract(productDetails);
}

module.exports = {
  implements: "product/search/execute",
  parameterValues: {
    country: "US",
    store: "houzz",
    domain: "houzz.com",
    url: "https://www.houzz.com/products/query/{searchTerms}",
    loadedSelector: ".hz-image-container img",
    noResultsXPath: null,
    zipcode: "",
  },
};
