/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
      .replace(/\r\n|\r|\n/g, " ")
      .replace(/&amp;nbsp;/g, " ")
      .replace(/&amp;#160/g, " ")
      .replace(/\u00A0/g, " ")
      .replace(/\s{2,}/g, " ")
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, " ")
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, "")
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, " ");
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        })
      )
    )
  );

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.aggregateRating) {
          var baseObject = JSON.parse(row.aggregateRating[0].text);

          var baseObj = baseObject.aggregateRating.ratingValue;
          var finalRating = baseObj.replace(".", ",");
          // console.log(finalRating);
          row.aggregateRating = [{ text: finalRating }];
        }
        if (row.availabilityText) {
          if (row.availabilityText[0].text == "- + Añadir al carrito Añadir a favoritos") {
            // console.log("Out of stock");
            row.availabilityText = [{ text: "In Stock" }];
          }
        }
        if (row.category) {
          let x = row.category[0].text;
          var rat = x.replace(
            'window.dataLayer = window.dataLayer || []; window.dataLayer.push({"ecommerce":{"currencyCode":"EUR"},"pageType":"catalog_product_view","list":"detail"}); window.dataLayer.push(',
            ""
          );
          var semi = rat.replace(
            `); (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-NQDSNPL');`,
            ``
          );
          var obj = JSON.parse(semi);
          row.category = [{ text: obj.product.category }];
        }
        if (row.variantId) {
          let x = row.variantId[0].text;
          var rat = x.replace(
            'window.dataLayer = window.dataLayer || []; window.dataLayer.push({"ecommerce":{"currencyCode":"EUR"},"pageType":"catalog_product_view","list":"detail"}); window.dataLayer.push(',
            ""
          );
          var semi = rat.replace(
            `); (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','GTM-NQDSNPL');`,
            ``
          );
          var obj = JSON.parse(semi);
          row.variantId = [{ text: obj.product.id }];
        }
        // if (row.alternateImages) {
        //   var i,j;
        //   var objects = [];
        //   var finalObjects = [];
        //     for (i = 0; i < row.alternateImages.length; i++) {
              
        //         var obj = row.alternateImages[i].text;
        //         var object = obj.split("?")[0];
        //         objects.push(object);
        //         finalObjects.push(objects.concat());
        //         console.log("working");
        //     console.log(objects);

        //     }
        // //     // console.log(finalObjects);
        // //     // row.alternateImages = [{ text: object }];
          
        // }
      } catch (exception) {
        console.log("Error in transform", exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
