module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "FR",
    store: "intermarche",
    transform: null,
    domain: "intermarche.com",
    zipcode: "",
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies
  ) => {
    await context.evaluate(() => {
      if (document.querySelector("#didomi-notice-agree-button") != null) {
        async () => {
          const button = await document.querySelector(
            "#didomi-notice-agree-button"
          );
          button.click();
        };
      }

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
      var energy = document.getElementsByClassName(
        "NutritionalTable__TableCell-sc-49ty6u-8 gUJdBI"
      );
      console.log(energy);
      if (energy != null) {
        var energy_num = energy[0].innerText;
        var energy_num = energy[0].innerText.match(/([\d.]+) *kcal/)[1];
        addHiddenDiv("ii_" + "energy", energy_num);
        addHiddenDiv("ii_" + "gram", "g");
        addHiddenDiv("ii_" + "energykilo", "kcal");
      }
    });
    await context.extract(dependencies.productDetails);
  },
};
