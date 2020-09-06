
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {

      if (row.specifications) {
        let txtArr = row.specifications.map(item => {
          return item.text.replace(/\n \n/g, ': ');
        });
        row.specifications = [
          {
            text: txtArr.join(' || ')
          },
        ];
      }

      if (row.alternateImages) {
        let txtArr = row.alternateImages.map(item => {
          return item.text;
        });
        row.alternateImages = [
          {
            text: txtArr.join(' | ')
          },
        ];
      }

      if (row.productOtherInformation) {
        let txtArr = row.productOtherInformation.map(item => {
          return item.text;
        });
        row.productOtherInformation = [
          {
            text: txtArr.join(' | ')
          },
        ];
      }

      
      if (row.category) {
        let txtArr = row.category.map(item => {
          return item.text;
        });
        row.category = [
          {
            text: txtArr.join(' > ')
          },
        ];
      }

      if (row.variants) {
        let txtArr = row.variants.map(item => {
          return item.text;
        });
        row.variants = [
          {
            text: txtArr.join(' | ')
          },
        ];
      }

      if (row.availabilityText) {
        let text = 'In Stock';
        row.availabilityText = row.availabilityText.map(item => {
          let regex = new RegExp(/^.*unavailable|out of stock.*$/i)
          if (regex.test(item.text)) {
            text = "Out of Stock"
          }
          // if (item.text.toLowerCase().includes("out of stock") || item.text.toLowerCase().includes("unavailable")) {
          // }
        });
        row.availabilityText = [
          {
            text: text
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
