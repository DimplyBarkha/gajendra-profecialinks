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
      let skuArray = [];

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

      function getVariantsSkuToArray() {
        let sku = "";

        let json = document.querySelector("#root script[type='application/ld+json']").innerText
          ? JSON.parse(document.querySelector("#root script[type='application/ld+json']").innerText)
          : "";

        if (json) {
          sku = json["@graph"][4]["sku"] ? json["@graph"][4]["sku"] : "";
        }

        skuArray.push(sku);
      }

      const productUrl = window.location.href;
      addElementToDom(productUrl, "productUrl");

      const secondaryImagesList = document.querySelector("div[class^='src__WrapperThumb'] picture img")
        ? document.querySelectorAll("div[class^='src__WrapperThumb'] picture img")
        : [];
      secondaryImagesList.forEach((image, index) => {
        if (index > 0) {
          addElementToDom(image.getAttribute("src"), "secondaryImagesList");
        }
      });

      const breadcrumbs = document.querySelector("div[class^='src__BreacrumbContainer']") ? document.querySelector("div[class^='src__BreacrumbContainer']").innerText : "";
      addElementToDom(breadcrumbs, "breadcrumbs");

      let nameExtended = document.querySelector("div[class^='src__ProductInfo'] div:nth-of-type(2) span[class^='src__Text']")
        ? document.querySelector("div[class^='src__ProductInfo'] div:nth-of-type(2) span[class^='src__Text']").innerText
        : "";
      const specificationsList = document.querySelector("table[class^='src__SpecsCell']") ? document.querySelectorAll("table[class^='src__SpecsCell'] tr") : [];

      let json = document.querySelector("#root script[type='application/ld+json']").innerText
        ? JSON.parse(document.querySelector("#root script[type='application/ld+json']").innerText)
        : "";

      let brandText = "";
      let manufacturer = "";
      let weightNet = "";
      let gtin = [];
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
          if (firstTd.toLowerCase() === "código de barras") gtin = secondTd;
          if (firstTd.toLowerCase() === "código" && !json) sku = secondTd;
          if (firstTd.toLowerCase().includes("dimensões")) shippingDimensions = secondTd;
          if (firstTd.toLowerCase().includes("cor")) color = secondTd;
          if (firstTd.toLowerCase().includes("garantia")) warranty = secondTd;
        });
      }

      if (json) {
        sku = json["@graph"][4]["sku"] ? json["@graph"][4]["sku"] : "";
      }

      const variantArray = document.querySelector("div[class^='src__ProductInfo'] div[class^='src__WrappOptions'] button")
        ? document.querySelectorAll("div[class^='src__ProductInfo'] div[class^='src__WrappOptions'] button")
        : [];

      variantArray.forEach((btn) => {
        btn.addEventListener("click", getVariantsSkuToArray);
      });

      const variantInformation = document.querySelector("div[class^='src__ProductInfo'] div[class^='src__Type'] div[class^='src__WrappOptions']")
        ? document.querySelector("div[class^='src__ProductInfo'] div[class^='src__Type'] div[class^='src__WrappOptions']").previousElementSibling.querySelector("label")
          ? document.querySelector("div[class^='src__ProductInfo'] div[class^='src__Type'] div[class^='src__WrappOptions']").previousElementSibling.querySelector("label")
              .childNodes[0].nodeValue
          : ""
        : "";
      addElementToDom(variantInformation, "variantInformation");

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
          let regExpGroup = description.match(/Dimensões.*?:(.*?)-/);
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

      if (color === "") {
        const arr = document.querySelector("div[class^='src__ProductInfo'] div[class^='src__Type']")
          ? document.querySelectorAll("div[class^='src__ProductInfo'] div[class^='src__Type']")
          : [];
        arr.forEach((elem) => {
          if (elem.innerText.toLowerCase().includes("cor")) {
            color = elem.innerText.replace("cor:", "");
          }
        });
      }

      addElementToDom(nameExtended, "nameExtended");
      addElementToDom(brandText, "brandText");
      addElementToDom(manufacturer, "manufacturer");
      addElementToDom(weightNet, "weightNet");
      addElementToDom(warranty, "warranty");
      addElementToDom(color, "color");
      addElementToDom(gtin, "gtin");
      addElementToDom(sku, "sku");
      addElementToDom(variantArray.length, "variantCount");
      addElementToDom(shippingDimensions, "shippingDimensions");

      const specifications = document.querySelector("table[class^='src__SpecsCell']") ? document.querySelector("table[class^='src__SpecsCell']").innerText : "";
      addElementToDom(specifications, "specifications");

      const listedPrice = document.querySelector("div[class^='src__ProductOffer'] div[class^='src__ListPriceWrapper'] span[class^='src__ListPrice']")
        ? document.querySelector("div[class^='src__ProductOffer'] div[class^='src__ListPriceWrapper'] span[class^='src__ListPrice']").innerText.replace(/\n/g, "")
        : "";
      const price = document.querySelector("div[class^='src__ProductOffer'] div[class^='src__PriceWrapper']")
        ? document.querySelector("div[class^='src__ProductOffer'] div[class^='src__PriceWrapper']").innerText.replace(/\n/g, "")
        : "";
      const availabilityText = document.querySelector("div[class^='src__ProductOffer'] h2") ? document.querySelector("div[class^='src__ProductOffer'] h2").innerText : "In Stock";
      const coupon = document.querySelector("div[class^='src__ProductOffer'] div[class^='src__ListPriceWrapper'] div[class^='src__Badge']")
        ? document.querySelector("div[class^='src__ProductOffer'] div[class^='src__ListPriceWrapper'] div[class^='src__Badge']").innerText
        : "";
      addElementToDom(listedPrice, "listedPrice");
      addElementToDom(price, "priceOnline");
      addElementToDom(availabilityText, "availabilityText");
      addElementToDom(coupon, "coupon");

      const ratingCount = document.querySelector("div[class^='src__WrapperReview'] span[class^='header__ReviewsValue']")
        ? document.querySelector("div[class^='src__WrapperReview'] span[class^='header__ReviewsValue']").innerText.replace(/\n/g, "").replace(/\(/g, "").replace(/\)/g, "")
        : 0;
      addElementToDom(ratingCount, "ratingCount");

      const aggregateRating = document.querySelector("div[class^='src__WrapperReview'] span[class^='header__RatingValue']")
        ? document.querySelector("div[class^='src__WrapperReview'] span[class^='header__RatingValue']").innerText
        : 0;
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
      const productName = document.querySelector("div[class^='src__ProductInfo'] div:nth-of-type(2) span[class^='src__Text']")
        ? document.querySelector("div[class^='src__ProductInfo'] div:nth-of-type(2) span[class^='src__Text']").innerText
        : "";
      addElementToDom(productName, "productName");

      variantArray.forEach((btn) => {
        btn.click();
      });

      addElementToDom(skuArray.join(" | "), "variants");
    });
    await context.extract(productDetails);
  },
};
