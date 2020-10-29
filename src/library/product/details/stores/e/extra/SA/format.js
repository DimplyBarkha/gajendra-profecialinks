
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {

        if(row.manufacturerDescription) {
            let result = '';
            let xpath = '';
            row.manufacturerDescription.forEach(item => {
                result += `${item.text} `;
                xpath = item.xpath;
              });
            row.manufacturerDescription = [{ text: result, xpath: xpath }];
        }

        if(row.specifications) {
            let result = '';
            let xpath = '';
            row.specifications.forEach(item => {
                result += `${item.text} || `;
                xpath = item.xpath;
              });
            row.specifications = [{ text: result.slice(0, -4), xpath: xpath }];
        }

        if(row.price) {
          row.price = [{ text: row.price[0].text.concat(' ', row.price[1].text), xpath: row.price[0].xpath}];
        }

        if(row.listPrice) {
          row.listPrice[0].text = row.listPrice[0].text.replace(/\n/g,'');
          row.listPrice[0].text = row.listPrice[0].text.replace(/\t/g,'');
        }

        if(row.quantity) {
          row.quantity[0].text = (row.quantity[0].text.split(':')[1]).trim();
        }

        if(row.color) {
          row.color[0].text = (row.color[0].text.split(':')[1]).trim();
        }

        if(row.weightNet) {
          row.weightNet[0].text = (row.weightNet[0].text.split(':')[1]).trim();
        }

        if(row.shippingDimensions) {
          let result = '';
          let xpath = ''; 
          row.shippingDimensions.forEach(item => {
            item.text = (item.text.split(':')[1]).trim();
            result += `${item.text} x `;
            xpath = item.xpath;
          });
          row.shippingDimensions = [{ text: result.slice(0, -4), xpath: xpath }];
        }

        if (row.manufacturerImages) {
          let url = "https:";
          row.manufacturerImages.forEach(item => {
              if (!item.text.includes("https")) {
                  item.text = url.concat(item.text);
              }
          });
        }

        if (row.videos) {
          var lookup = {};
          var items = row.videos;
          var result = [];

          for (var item, i = 0; item = items[i++];) {
            var text = item.text;

            if (!(text in lookup)) {
              lookup[text] = 1;
              result.push({text: item.text, xpath: item.xpath});
            }
          }
          row.videos = result;
        }

        if(row.alternateImages) {
          var result = [];
          let url = "https:";
          row.alternateImages.forEach(item => {
            if (!item.text.includes("https")) {
              item.text = url.concat(item.text);
            }
            if (item.text.includes("/i/")) {
              result.push(item);
            }
          });
          row.alternateImages = result;
          row.secondaryImageTotal = [{text: row.alternateImages.length}];
        }

        if (row.brandText) {
          if (row.brandText.length > 1) {
            row.brandText = [{ text: row.brandText[1].text, xpath: row.brandText[1].xpath }];
          }
          row.manufacturer = row.brandText;
        }

        row.variantCount = [{text: 1}];
        row.imageZoomFeaturePresent = [{text: "Yes"}];
        row.shippingInfo = [{text: "Extra Stores"}];
      }
    }
    return data;
  };
  
  module.exports = { transform };
  