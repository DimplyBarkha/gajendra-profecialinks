const { transform } = require("../format");

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement("div");
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = "none";
      document.body.appendChild(newDiv);
    }
    // Function to fetch sku number and gtin from script tag as not available directly on DOM.
    function fetchRatingFromScript() {
      const scriptDataTagSelector = document.evaluate(
        '//script[@type="application/ld+json"]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      // @ts-ignore
      const scriptTagData = scriptDataTagSelector
        ? scriptDataTagSelector.innerText
        : "";
      const availability = scriptTagData
        ? scriptTagData.replace(/.*added_availability":"(\d+).*/gm, "$1")
        : "";
      addHiddenDiv("added_availability", availability);
    }
    // If images are present in description then add to manufacturerDescription else add to description
    let descriptionSelector = document.evaluate(
      '//*[@id="productDescription"] | //span[contains(text(), "Description")]/parent::*/following-sibling::* |  //div[contains(@class, "product-short-description short-description")]/p',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    let description = descriptionSelector ? descriptionSelector.innerText : "";
    description = description
      ? description.replace(/(\n\s*){1,}/g, " || ")
      : "";
    description = description
      ? description.replace(/\|\| Key Features/gm, "Key Features")
      : "";
    const manufacturerImageFlag = document.querySelector(
      'div[class="box-description cms"] img'
    );
    if (manufacturerImageFlag) {
      addHiddenDiv("added-manufacturerDesc", description);
    } else {
      addHiddenDiv("added-description", description);
    }
    fetchRatingFromScript();
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "AU",
    store: "domayne",
    transform,
    domain: "domayne.com.au",
    zipcode: "",
  },
  implementation,
};
