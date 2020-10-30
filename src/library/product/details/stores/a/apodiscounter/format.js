
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ':')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }

        if (row.category){
            row.category.forEach(item => {
                item.text = String(item.text).replace(">","");
              });
        }
        if(row.manufacturer){
            var text = row.manufacturer[0].text;
            var array = String(text).split("\n");
            console.log(array,'11111111111');
            if(array.length > 1){
                row.manufacturer[0].text = array[0].replace("Originalprodukt von","").trim()
            }
        }
        if(row.ratingCount){
            var text = row.ratingCount[0].text;
                row.ratingCount[0].text = String(text).replace("(","").replace(")","").trim();
        }
        if(row.alternateImages){
            const text = String(row.alternateImages.length);
            row.secondaryImageTotal = [{ text: text, xpath: '' }];
          }

          if (row.imageZoomFeaturePresent) {
            if (row.imageZoomFeaturePresent.length) {
              row.imageZoomFeaturePresent[0].text = 'Yes';
            } else {
              row.imageZoomFeaturePresent = [{ text: 'No', xpath: '' }];
            }
          }
          if(row.price){
            var text = row.price[0].text;
            row.price[0].text = String(text).replace("*","");
          }
          if(row.listPrice){
            var text = row.listPrice[0].text;
            row.listPrice[0].text = String(text).replace("*","");
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  