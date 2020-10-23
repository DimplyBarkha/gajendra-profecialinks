const { cleanUp } = require("../../../../shared");

module.exports = {
  implements: "product/details/extract",
  parameterValues: {
    country: "BR",
    store: "americanas",
    transform: cleanUp,
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

      function getHTML(url, callback) {
        if (!window.XMLHttpRequest) return;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (callback && typeof callback === "function") {
            callback(this.responseXML);
          }
        };
        xhr.open("GET", url);
        xhr.responseType = "document";
        xhr.send();
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
        : document.evaluate('//div[contains(@class,"src__Container")]/div[contains(@class,"src__DeskWrapper")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue
        ? document
            .evaluate('//div[contains(@class,"src__Container")]/div[contains(@class,"src__DeskWrapper")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.querySelectorAll("table tr")
        : [];
      let brandText = "";
      let manufacturer = "";
      let weightNet = "";
      let gtinArr = [];
      let sku = "";
      let shippingDimensions = "";
      let color = "";
      let warranty = "";
      if (specificationsList) {
        specificationsList.forEach((item) => {
          let firstTd = item.querySelector("td:nth-of-type(1)").innerText;
          let secondTd = item.querySelector("td:nth-of-type(2)").innerText;
          if (firstTd.toLowerCase() === "marca") brandText = secondTd;
          if (firstTd.toLowerCase() === "fabricante") manufacturer = secondTd;
          if (firstTd.toLowerCase().includes("peso liq")) weightNet = secondTd.toLowerCase().includes("kg") ? secondTd : secondTd + "kg";
          if (firstTd.toLowerCase() === "código de barras") gtinArr = secondTd.split(",");
          if (firstTd.toLowerCase() === "código") sku = secondTd;
          if (firstTd.toLowerCase().includes("dimensões do produto")) shippingDimensions = secondTd;
          if (firstTd.toLowerCase().includes("cor")) color = secondTd;
          if (firstTd.toLowerCase().includes("garantia")) warranty = secondTd;
        });
      }
      const description = document.querySelector("#info-section div:nth-of-type(1)") ? document.querySelector("#info-section div:nth-of-type(1)").innerText : "";
      if (description) {
        if (brandText === "") {
          let regExpGroup = description.match(/Marca.*?:(.*?)-/);
          if (!regExpGroup) regExpGroup = description.match(/Marca.*?:(.*?)Aviso/);
          brandText = regExpGroup ? regExpGroup[1] : brandText;
        }
        if (manufacturer === "") {
          let regExpGroup = description.match(/Fabricante.*?:(.*?)-/);
          if (!regExpGroup) regExpGroup = description.match(/Fabricante.*?:(.*?)Aviso/);
          manufacturer = regExpGroup ? regExpGroup[1] : manufacturer;
        }
        if (weightNet === "") {
          let regExpGroup = description.match(/Peso Líquido.*?:(.*?)-/);
          if (!regExpGroup) regExpGroup = description.match(/Peso Líquido.*?:(.*?)Aviso/);
          weightNet = regExpGroup ? regExpGroup[1] : weightNet;
        }
        if (shippingDimensions === "") {
          let regExpGroup = description.match(/Dimensões do produto.*?:(.*?)-/);
          if (!regExpGroup) regExpGroup = description.match(/Dimensões do produto.*?:(.*?)Aviso/);
          shippingDimensions = regExpGroup ? regExpGroup[1] : shippingDimensions;
        }
        if (color === "") {
          let regExpGroup = description.match(/Cor.*?:(.*?)-/);
          if (!regExpGroup) regExpGroup = description.match(/Cor.*?:(.*?)Aviso/);
          color = regExpGroup ? regExpGroup[1] : color;
        }
        if (warranty === "") {
          let regExpGroup = description.match(/Garantia.*?:(.*?)-/);
          if (!regExpGroup) regExpGroup = description.match(/Garantia.*?:(.*)/);
          warranty = regExpGroup ? regExpGroup[1] : warranty;
        }
      }
      if (nameExtended && brandText) {
        nameExtended = nameExtended.toLowerCase().includes(brandText.toLowerCase()) ? nameExtended : `${brandText} - ${nameExtended}`;
      }
      addElementToDom(nameExtended, "nameExtended");
      addElementToDom(brandText, "brandText");
      addElementToDom(manufacturer, "manufacturer");
      addElementToDom(weightNet, "weightNet");
      addElementToDom(gtinArr[0], "gtin");
      addElementToDom(sku, "sku");
      addElementToDom(gtinArr.length, "variantCount");
      addElementToDom(shippingDimensions, "shippingDimensions");
      addElementToDom(gtinArr.join(" | "), "variants");

      const specifications = document.querySelector("div#info-section div:nth-of-type(2) table")
        ? document.querySelector("div#info-section div:nth-of-type(2) table").innerText
        : "";
      addElementToDom(specifications, "specifications");

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
                '//div[contains(@class,"buybox__BigSection")]//div[contains(@class,"main-offer__Container")]//div[contains(@class,"price__Paragraph")][1]',
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
              '//div[contains(@class,"buybox__BigSection")]//div[contains(@class,"main-offer__Container")]//div[contains(@class,"price__Paragraph")][2]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerText
          : listedPrice;
      const availabilityText =
        priceTagNumber.numberValue === 0 ? (document.querySelector("#title-stock") ? document.querySelector("#title-stock").innerText : "Out of Stock") : "In Stock";
      const coupon =
        priceTagNumber.numberValue > 1
          ? document.evaluate(
              '//div[contains(@class,"buybox__BigSection")]//div[contains(@class,"main-offer__Container")]//div[contains(@class,"price__Paragraph")][1]/div[contains(@class,"price__Badge")]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue.innerText
          : "";
      addElementToDom(listedPrice, "listedPrice");
      addElementToDom(price, "priceOnline");
      addElementToDom(availabilityText, "availabilityText");
      addElementToDom(coupon, "coupon");

      const ratingCount = document.querySelector(".card-reviews header.summary-bar .summary-rating span:nth-of-type(2)")
        ? document.querySelector(".card-reviews header.summary-bar .summary-rating span:nth-of-type(2)").innerText.replace(/\n/g, "").replace(/\(/g, "").replace(/\)/g, "")
        : "";
      addElementToDom(ratingCount, "ratingCount");

      const aggregateRating = document.querySelector(".card-reviews header.summary-bar .summary-rating span:nth-of-type(1)")
        ? document.querySelector(".card-reviews header.summary-bar .summary-rating span:nth-of-type(1)").innerText
        : "";
      addElementToDom(aggregateRating, "aggregateRating");

      const manufacturerDescriptionFrameLink = document.querySelector("#info-section iframe") ? document.querySelector("#info-section iframe").getAttribute("src") : "";
      let manufacturerImagesArr = [];
      if (manufacturerDescriptionFrameLink) {
        getHTML(manufacturerDescriptionFrameLink, function (response) {
          addElementToDom("", "manufacturerSite");
          let manufacturerSiteDiv = document.querySelector("#manufacturerSite");
          manufacturerSiteDiv.innerHTML = response.querySelector("body").innerHTML;
          manufacturerImagesArr = Array.from(response.querySelectorAll("img")).map((item) => {
            return `${manufacturerDescriptionFrameLink}${item.getAttribute("src")}`.replace("index.html", "");
          });
        });
      }
      const manufacturerDescription = document.querySelector("#manufacturerSite") ? document.querySelector("#manufacturerSite").innerText : "";
      addElementToDom(manufacturerDescription, "manufacturerDescription");
      setTimeout(() => {
        addElementToDom(manufacturerImagesArr, "manufacturerImages");
      }, 500);
      const productName = document.querySelector("h1#product-name-default") ? document.querySelector("h1#product-name-default").innerText : "";
      addElementToDom(productName, "productName");
    });
    await context.extract(productDetails);
  },
};
