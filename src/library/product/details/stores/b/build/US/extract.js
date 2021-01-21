const { transform } = require('../trasform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'build',
    transform: transform,
    domain: 'build.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    { productDetails: data }
  ) => {
    const { transform } = parameters;
    await context.evaluate(async function () {
      const videoFrame = document.evaluate(`(//script[contains(text(),'VideoObject')])[1]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if(videoFrame) {
        let video = videoFrame.textContent.match(/(embedUrl":")(.+)(\","up)/)[2]
        document.head.setAttribute('video', video);
      }

      let shownImage = document.querySelectorAll("#PDP-Media-Gallery > div > div img");
      if (shownImage.length) {
        const table = document.createElement('table');
        document.body.appendChild(table);
        const tBody = document.createElement('tbody');
        table.appendChild(tBody);

        for (let index = 0; index < shownImage.length; index++) {
          if (shownImage[index].src !== 'https://s2.img-b.com/build.com/themes/build/images/beta/play_overlay.png') {
            const newlink = document.createElement('tr');
            newlink.setAttribute('class', 'append_image');
            newlink.setAttribute('images', shownImage[index].src);
            tBody.appendChild(newlink);
          }
        }
      }

      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      console.log('Inside variants');
      try {
        const hiddenDivs = document.querySelectorAll('*[id^=custom-attr]');
        hiddenDivs.forEach((x) => {
          x.parentElement.removeChild(x);
        });
        const { dataLayer } = window || {};
        const selectedFinish = dataLayer.finishes[0] || dataLayer.selectedFinish[0];
        addHiddenDiv('custom-attr-url-field', window.location.href);
        addHiddenDiv(
          'custom-attr-product-brand-name',
          dataLayer.brand.name
        );
        addHiddenDiv(
          'custom-attr-product-manufacturer-name',
          dataLayer.manufacturer
        );
        if (selectedFinish) {
          addHiddenDiv('custom-attr-product-sku-number', selectedFinish.sku);
          addHiddenDiv(
            'custom-attr-product-variant-id',
            selectedFinish.uniqueId
          );
          addHiddenDiv('custom-attr-product-mpc', selectedFinish.sku);
          addHiddenDiv('custom-attr-product-upc', selectedFinish.upc);
        }

        var node = document.evaluate(
          "//div[contains(@class, 'description')]",
          document,
          null,
          XPathResult.ANY_TYPE
        );
        var data = node.iterateNext();
        if (data) {
          const liList = data.getElementsByTagName("li");
          const str = [];
          for (var item of liList) {
            str.push(item.innerText.trim());
          }
          addHiddenDiv("custom-attr-product-description", str.join(" || "));
          addHiddenDiv(
            "custom-attr-product-description-bullet-count",
            str.length
          );
        }

        const specsArray = [];
        const specsIterator = document.evaluate(
          "//div[@id='product-specs']//div[contains(@class, 'specs')]/..",
          document,
          null,
          XPathResult.ANY_TYPE
        );
        if (specsIterator) {
          let node = specsIterator.iterateNext();
          while (node) {
            specsArray.push(node.innerText.replace("\n", " : "));
            node = specsIterator.iterateNext();
          }
          addHiddenDiv(
            "custom-attr-product-specifications",
            specsArray.join(" || ")
          );
        }
        if (specsArray.length) {
          const productWeight =
            specsArray.find((x) => x.startsWith("Product Weight :")) || "";
          addHiddenDiv(
            "custom-attr-product-weight",
            productWeight.replace("Product Weight :", "").trim()
          );
          const productMaterial =
            specsArray.find((x) => x.startsWith("Material :")) || "";
          addHiddenDiv(
            "custom-attr-product-material",
            productMaterial.replace("Material :", "").trim()
          );
          const productCountryOfOrigin =
            specsArray.find((x) => x.startsWith("Country Of Origin :")) ||
            "";
          addHiddenDiv(
            "custom-attr-product-country-of-origin",
            productCountryOfOrigin.replace("Country Of Origin :", "").trim()
          );
          const productManufacturerWarranty =
            specsArray.find((x) =>
              x.startsWith("Manufacturer Warranty :")
            ) || "";
          addHiddenDiv(
            "custom-attr-product-manufacturer-warranty",
            productManufacturerWarranty
              .replace("Manufacturer Warranty :", "")
              .trim()
          );
        }
        addHiddenDiv("custom-attr-image-zoom-feature-present", "Yes");
        // console.log("availability text", selectedFinish.status);
        if (selectedFinish) {
          addHiddenDiv(
            "custom-attr-product-availability-text",
            selectedFinish.status === "stock" ? "In Stock" : "Out of Stock"
          );
        } else {
          addHiddenDiv(
            "custom-attr-product-availability-text", "Out of Stock"
          );
        }
        if (selectedFinish) {
          const variants = dataLayer.finishes.map((finish) => finish.finish);
          const variations = (dataLayer.variations || [])[0];
          const productVariations = variations
            ? variations.variationProducts.map((item) => item.variationName)
            : [];
          const productVariantsEle = document.createElement("ul");
          [...variants, ...productVariations].forEach((x) => {
            const liEle = document.createElement("li");
            liEle.textContent = x;
            productVariantsEle.appendChild(liEle);
          });
          productVariantsEle.style.display = "none";
          productVariantsEle.id = "custom-attr-product-variants";
          document.body.appendChild(productVariantsEle);

          if (variants) {
            addHiddenDiv(
              "custom-attr-product-variants-count",
              variants.length + productVariations.length
            );
          }

          addHiddenDiv(
            "custom-attr-product-first-variant",
            productVariations[0] || variants[0]
          );

          const pdfIterator = document.evaluate(
            "//div[@id='manufacturer-resources']//a[contains(@class, 'js-view-pdf')]/@data-href",
            document,
            null,
            XPathResult.ANY_TYPE
          );
          const pdfNode = pdfIterator.iterateNext();
          if (pdfNode) {
            addHiddenDiv("custom-attr-product-pdfs", "Yes");
          }

          const productFinish = selectedFinish.finish;
          const productVariation = dataLayer.variations.length
            ? dataLayer.variations[0].currentVariation
            : null;
          addHiddenDiv(
            "custom-attr-product-variants-info",
            productVariation || productFinish
          );
        }

        // Feature Bullets
        await new Promise((resolve, reject) => setTimeout(resolve, 6000));
        const descriptionHeaders = document.querySelectorAll(
          "div.description p"
        );
        descriptionHeaders.forEach((header) => {
          if (header.textContent.toLowerCase().includes("feature")) {
            const list = header.nextSibling;
            if (list) {
              const featureBullets = document.createElement("ul");
              featureBullets.id = "custom-attr-product-feature-bullets";
              featureBullets.style.display = "none";
              const liItems = list.getElementsByTagName("li");
              for (const li of liItems) {
                const liEle = document.createElement("li");
                liEle.textContent = li.textContent;
                featureBullets.appendChild(liEle);
              }
              document.body.appendChild(featureBullets);
            }
          }

          if (header.textContent.toLowerCase().includes("specification")) {
            const list = header.nextSibling;
            if (list) {
              const featureBullets = document.createElement("ul");
              featureBullets.id =
                "custom-attr-product-additional-desc-bullets";
              featureBullets.style.display = "none";
              const liItems = list.getElementsByTagName("li");
              for (const li of liItems) {
                const liEle = document.createElement("li");
                liEle.textContent = li.textContent;
                featureBullets.appendChild(liEle);
              }
              document.body.appendChild(featureBullets);
            }
          }
        });

        // const vidsDuration = document.createElement("ul");
        // vidsDuration.id = "custom-attr-product-video-durations";
        // vidsDuration.style.display = "none";
        // const vids = document.querySelectorAll("div#product-images-container video[src^=https]");
        // vids.forEach(async x => {
        //     x.play();
        //     const vidLi = await new Promise(function (resolve, reject) {setTimeout(function() {
        //       if(x.readyState > 0) {
        //         let liItem = document.createElement("li");
        //         const minutes = parseInt(x.duration / 60, 10);
        //         const seconds = Math.ceil(x.duration % 60);
        //         console.log(minutes, seconds);
        //         liItem.textContent = `${minutes}:${seconds}`;
        //         resolve(liItem);
        //         x.pause();
        //         clearInterval(i);
        //         resolve();
        //       }
        //     }, 200)});
        //     vidsDuration.appendChild(vidLi);
        // });
        // document.body.appendChild(vidsDuration);
      } catch (error) {
        console.log("Error: ", error);
      }
    });

    // await preparePage(j, variantLength);
    // if (j !== variantLength - 1) {
    //   await context.extract(data, { transform }, { type: "APPEND" });
    // }

    return await context.extract(data, { transform });
  },
};
