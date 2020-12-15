async function implementation(
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    document.querySelector("li[class='hzui-tabs__label   ']").click();
  });
  await context.evaluate(async function () {
    function findLabel(productObj, label) {
      const value = productObj[label];
      if (Array.isArray(value)) {
        return {
          label: value.reduce((prevVal, currentVal) => {
            return prevVal ? prevVal + "," + currentVal : currentVal;
          }, ""),
        };
      } else if (value) {
        return { label: value };
      }
      return null;
    }
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      document.body.appendChild(newDiv);
    }
    function findAndInsertLabel(obj, labelName, outputName) {
      const result = findLabel(obj, labelName);
      if (result != null) {
        addHiddenDiv("ii_" + outputName, result.label);
      }
    }
    // @ts-ignore
    const jsonString = document.querySelector(
      "script[type='application/ld+json']"
    ).innerText;
    let jsonParsed = {};
    if (jsonString && jsonString.trim()) {
      jsonParsed = JSON.parse(jsonString);
      findAndInsertLabel(jsonParsed[0], "image", "image");
      findAndInsertLabel(jsonParsed[0], "category", "category");
      findAndInsertLabel(jsonParsed[0], "name", "nameExtended");
      findAndInsertLabel(jsonParsed[0], "description", "description");
      findAndInsertLabel(jsonParsed[0], "sku", "sku");
      findAndInsertLabel(jsonParsed[0], "mpn", "mpc");
      findAndInsertLabel(jsonParsed[0], "material", "material");
      findAndInsertLabel(jsonParsed[0], "color", "color");
      findAndInsertLabel(jsonParsed[0].weight, "description", "weightNet");
      findAndInsertLabel(jsonParsed[0].manufacturer, "name", "manufacturer");
      findAndInsertLabel(jsonParsed[0], "productID", "variantId");
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "houzz",
    transform: null,
    domain: "houzz.com",
    zipcode: "",
  },
  implementation,
};
