
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if(item.text.includes("Ajouter au panier")){
                item.text = "In Stock";
            }else{
                item.text = "Out of Stock";
            }
          });
        }

        if (row.category) {
          row.category.pop();
        }

        if (row.description) {
          row.description.forEach(item => {
          item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
          });
        }
        if (row.weightNet) {
          row.weightNet.forEach(item => {
          item.text = item.text.trim();
          });
        }
        if (row.brandText) {
          row.brandText.forEach(item => {
          item.text = item.text.trim();
          });
        }
        if (row.image) {
          row.image.forEach(item => {
          item.text = item.text.split('(')[1];
          item.text = item.text.split(')')[0];
          item.text = item.text.replace('"','').replace("'",'').replace(/\"/,'');
          });
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
          item.text = item.text.split('(')[1];
          item.text = item.text.split(')')[0];
          item.text = item.text.replace('"','').replace("'",'').replace(/\"/,'');
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  