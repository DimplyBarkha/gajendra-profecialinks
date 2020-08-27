
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
      }
    }
    return data;
  };
  
  module.exports = { transform };
  