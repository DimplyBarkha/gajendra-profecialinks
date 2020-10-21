module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "BR",
    store: "americanas",
    transform: null,
    domain: "americanas.com.br",
    zipcode: "",
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom(element, id) {
        let div = document.createElement("div");
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      }
      const productUrl = window.location.href;
      addElementToDom(productUrl, "productUrl");

      const secondaryImagesList = document.querySelector(".image-gallery .image-gallery-content .image-gallery-thumbnails .image-gallery-thumbnails-container a")
        ? document.querySelectorAll(".image-gallery .image-gallery-content .image-gallery-thumbnails .image-gallery-thumbnails-container a")
        : [];
      secondaryImagesList.forEach((image, index) => {
        if (index > 0) {
          addElementToDom(image.querySelector("img").getAttribute("src"), "secondaryImagesList");
        }
      });

      const breadcrumbs = document.querySelector(".product-breadcrumb") ? document.querySelector(".product-breadcrumb").innerText : "";
      addElementToDom(breadcrumbs, "breadcrumbs");

      let nameExtended = document.querySelector("h1#product-name-default") ? document.querySelector("h1#product-name-default").innerText : "";
      const specificationsList = document.querySelector("div#info-section div:nth-of-type(2) table")
        ? document.querySelectorAll("div#info-section div:nth-of-type(2) table tr")
        : [];
      let brandText = "";
      let manufacturer = "";
      if (specificationsList) {
        specificationsList.forEach((item) => {
          let firstTd = item.querySelector("td:nth-of-type(1)");
          let secondTd = item.querySelector("td:nth-of-type(2)");
          if (firstTd.innerText.toLowerCase() === "marca") brandText = secondTd;
          if (firstTd.innerText.toLowerCase() === "fabricante") manufacturer = secondTd;
        });
      }
      if (nameExtended && brandText) {
        nameExtended = nameExtended.toLowercase().includes(brandText) ? nameExtended : `${brandText} - ${nameExtended}`;
      }
      addElementToDom(nameExtended, "nameExtended");
      addElementToDom(brandText, "brandText");
      addElementToDom(manufacturer, "manufacturer");

      const priceTagNumber = document.evaluate(
        'count(//div[contains(@class,"buybox__BigSection")]//div[contains(@class,"main-offer__Container")]/div[1]/div[contains(@class,"price__Paragraph")])',
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      const listedPrice =
        priceTagNumber.numberValue > 0
          ? document
              .evaluate(
                '//div[contains(@class,"buybox__BigSection")]//div[contains(@class,"main-offer__Container")]/div[1]/div[contains(@class,"price__Paragraph")][1]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
              )
              .singleNodeValue.innerText.replace(/\n.*/g, "")
          : "";
      const price =
        priceTagNumber.numberValue > 1
          ? document.evaluate(
              '//div[contains(@class,"buybox__BigSection")]//div[contains(@class,"main-offer__Container")]/div[1]/div[contains(@class,"price__Paragraph")][2]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerText
          : listedPrice;
      const availabilityText =
        priceTagNumber.numberValue === 0 ? (document.querySelector("#title-stock") ? document.querySelector("#title-stock").innerText : "Out of Stock") : "In Stock";
      addElementToDom(listedPrice, "listedPrice");
      addElementToDom(price, "priceOnline");
      addElementToDom(availabilityText, "availabilityText");
    });
    await context.extract(productDetails);
  },
};
