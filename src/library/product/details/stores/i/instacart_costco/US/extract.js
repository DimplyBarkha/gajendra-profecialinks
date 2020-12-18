module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "US",
    store: "instacart_costco",
    transform: null,
    domain: "instacart.com",
    zipcode: "",
  },
  implementation: async (
    { url },
    { country, domain },
    context,
    dependencies
  ) => {
    await context.evaluate(() => {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        document.body.appendChild(newDiv);
      }
      if (window.location.href != null) {
        var url = window.location.href;
        if (url.includes("item_")) {
          const product_code = url.split("item_");
          if (product_code[1].includes("?")) {
            var prod_co = product_code[1].split("?");
            addHiddenDiv("ii_procode", prod_co[0]);
          } else {
            addHiddenDiv("ii_procode", product_code[1]);
          }
        } else {
          const product_code = url.split("products/");
          if (product_code[1].includes("-")) {
            var prod_co = product_code[1].split("-");
            addHiddenDiv("ii_procode", prod_co[0]);
          } else {
            addHiddenDiv("ii_procode", product_code[1]);
          }
        }
        if (
          document
            .evaluate(
              '//li/strong[contains(text(),"Total Fat")]/following-sibling::text()[2]',
              document
            )
            .iterateNext() != null
        ) {
          var fat = document
            .evaluate(
              '//li/strong[contains(text(),"Total Fat")]/following-sibling::text()[2]',
              document
            )
            .iterateNext().data;
          var total_fat = fat.replace("g", "");
          addHiddenDiv("ii_fat", total_fat);
        }
        if (
          document
            .evaluate(
              '//div/li[contains(text(),"Saturated Fat")]/text()[3]',
              document
            )
            .iterateNext() != null
        ) {
          var sat_fat = document
            .evaluate(
              '//div/li[contains(text(),"Saturated Fat")]/text()[3]',
              document
            )
            .iterateNext().data;
          var total_sat_fat = sat_fat.replace("g", "");

          addHiddenDiv("ii_satfat", total_sat_fat);
        }

        if (
          document
            .evaluate(
              '//li/strong[contains(text(),"Cholesterol")]/following-sibling::text()[2]',
              document
            )
            .iterateNext() != null
        ) {
          var Cholesterol = document
            .evaluate(
              '//li/strong[contains(text(),"Cholesterol")]/following-sibling::text()[2]',
              document
            )
            .iterateNext().data;
          var total_Cholesterol = Cholesterol.replace("mg", "");

          addHiddenDiv("ii_Cholesterol", total_Cholesterol);
        }

        if (
          document
            .evaluate(
              '//li/strong[contains(text(),"Sodium")]/following-sibling::text()[2]',
              document
            )
            .iterateNext() != null
        ) {
          var Sodium = document
            .evaluate(
              '//li/strong[contains(text(),"Sodium")]/following-sibling::text()[2]',
              document
            )
            .iterateNext().data;
          var total_Sodium = Sodium.replace("mg", "");

          addHiddenDiv("ii_Sodium", total_Sodium);
        }

        if (
          document
            .evaluate(
              '(//div[@class="rmq-97f207b6"]/div/div)[2]/div/ul/div/li/strong[contains(text(),"Total Carbohydrate")]/following-sibling::text()[2]',
              document
            )
            .iterateNext() != null
        ) {
          var Carbohydrate = document
            .evaluate(
              '(//div[@class="rmq-97f207b6"]/div/div)[2]/div/ul/div/li/strong[contains(text(),"Total Carbohydrate")]/following-sibling::text()[2]',
              document
            )
            .iterateNext().data;
          var total_Carbohydrate = Carbohydrate.replace("g", "");

          addHiddenDiv("ii_Carbohydrate", total_Carbohydrate);
        }

        if (
          document
            .evaluate(
              '//div/li[contains(text(),"Dietary Fiber")]/text()[3]',
              document
            )
            .iterateNext() != null
        ) {
          var Fiber = document
            .evaluate(
              '//div/li[contains(text(),"Dietary Fiber")]/text()[3]',
              document
            )
            .iterateNext().data;
          var total_Fiber = Fiber.replace("g", "");

          addHiddenDiv("ii_Fiber", total_Fiber);
        }

        if (
          document
            .evaluate('//div/li[contains(text(),"Sugars")]/text()[3]', document)
            .iterateNext() != null
        ) {
          var Sugars = document
            .evaluate('//div/li[contains(text(),"Sugars")]/text()[3]', document)
            .iterateNext().data;
          var total_Sugars = Sugars.replace("g", "");

          addHiddenDiv("ii_Sugars", total_Sugars);
        }

        if (
          document
            .evaluate(
              '//li/strong[contains(text(),"Protein")]/following-sibling::text()[2]',
              document
            )
            .iterateNext() != null
        ) {
          var Protein = document
            .evaluate(
              '//li/strong[contains(text(),"Protein")]/following-sibling::text()[2]',
              document
            )
            .iterateNext().data;
          var total_Protein = Protein.replace("g", "");

          addHiddenDiv("ii_Protein", total_Protein);
        }
      }
      addHiddenDiv("ii_gram", "g");
      addHiddenDiv("ii_mg", "mg");
    });
    await context.extract(dependencies.productDetails);
  },
};
