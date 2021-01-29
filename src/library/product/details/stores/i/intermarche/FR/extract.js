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
    try {
      await context.waitForSelector('img[class*=StyledProductImage]', {timeout: 40000});
    } catch(er) {
      console.log("timedOut waiting" + er.message);
      throw new Error("The product content didn't load");
    }
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
      if (energy[0] != null) {
        var energy_num = energy[0].innerText;
        var energy_num = energy[0].innerText.match(/([\d.]+) *kcal/)[1];
        addHiddenDiv("ii_" + "energy", energy_num);
        addHiddenDiv("ii_" + "gram", "g");
        addHiddenDiv("ii_" + "energykilo", "kcal");
      }
      if (window.location.href != null) {
        var url = window.location.href;
        var id = url.split("/product/");
        addHiddenDiv("ii_" + "productid", id[1]);
      }
      if (
        document.querySelector(
          ".styled__ProductConditionnement-rc4bd7-2.kvnQKM"
        ) != null
      ) {
        var size = document.querySelectorAll(
          ".styled__ProductConditionnement-rc4bd7-2.kvnQKM"
        );
        var t = size[2].innerText;
        var s = t.split(" de ");
        var p = s.reverse();
        addHiddenDiv("ii_" + "size", p[0]);
      }
    });
    await context.extract(dependencies.productDetails);
  },
};
