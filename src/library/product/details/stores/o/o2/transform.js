/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image && row.image.length) {
        row.image.map((item) => {
          if (item.text.indexOf('https') === -1) {
            item.text = "https:" + item.text
          }
        });
      }
      if (row.manufacturerImages && row.manufacturerImages.length) {
        row.manufacturerImages.map((item) => {
          if (item.text.indexOf('https') === -1) {
            item.text = "https:" + item.text
          }
        });
      }
      if (row.alternateImages && row.alternateImages.length) {
        row.alternateImages.map((item) => {
          if (item.text.indexOf('https') === -1) {
            item.text = "https:" + item.text
          }
        });
      }
      if (row.listPrice && row.listPrice.length) {
        row.listPrice.map((item) => {
          if (item.text === "##DEVICE_COST##")
            item.text = "";
          else
            item.text.replace('.', ',');
        });
      }
      if (row.price && row.price.length) {
        row.price.map((item) => {
          if (item.text === "##DEVICE_COST##")
            item.text = "";
          else
            item.text.replace('.', ',');
        });
      }
      if (row.availabilityText && row.availabilityText.length) {
        row.availabilityText.map((item) => {
          if (item.text.toLowerCase() === "pre-order") {
            item.text = "In Stock";
          } else if (item.text.toLowerCase() === "in stock" || item.text.toLowerCase() === "instock") {
            item.text = "In Stock";
          }
        });
      } else {
        row.availabilityText = [{
          text: 'Out Of Stock',
          xpath: ''
        }];
      }
      if (row.specifications && row.specifications.length) {
        let spec = '';
        let flag = false;
        row.specifications.map((item, index) => {
          flag = !flag;
          if (flag) {
            spec += `${item.text} : ${row.specifications[++index].text} || `;
          }
        });
        row.specifications = [{ text: spec, xpath: '' }];
      }
    }
  }
  return data;
};

module.exports = { transform };