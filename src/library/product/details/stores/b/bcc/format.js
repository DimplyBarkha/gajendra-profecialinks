
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
          item.text = item.text.replace(/\n \n/g, ': ');
          return item.text;
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

      if (row.videos) {
        let txtArr = row.videos.map(item => {
          if (item.text.startsWith("//")) {
            item.text = item.text.substring(2);
          }
          return item.text;
        });
        row.videos = [
          {
            text: txtArr.join(' | ')
          },
        ];
      }

      if (row.description) {
        let txtArr = row.description.map(item => {
          return item.text;
        });
        row.description = [
          {
            text: txtArr.join(' || ')
          },
        ];
      }

      if (row.additionalDescBulletInfo) {
        let txtArr = row.additionalDescBulletInfo.map(item => {
          return item.text;
        });
        row.additionalDescBulletInfo = [
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

      // if (row.category) {
      //   let txtArr = row.category.map(item => {
      //     return item.text;
      //   });
      //   row.category = [
      //     {
      //       text: txtArr.join(' > ')
      //     },
      //   ];
      // }

      if (row.directions) {
        row.directions = row.directions.map(item => {
          item.text = item.text.replace(/\n \n/g, '');
          return item;
        });
      }

      if (row.promotion) {
        row.promotion = row.promotion.map(item => {
          item.text = item.text.replace(/\n \n/g, '');
          return item;
        });
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

      if (row.variantInformation) {
        let txtArr = row.variantInformation.map(item => {
          return item.text;
        });
        row.variantInformation = [
          {
            text: txtArr.join(' / ')
          },
        ];
      }

      // if (row.energyEfficiency) {
      //   row.energyEfficiency = row.energyEfficiency.map(item => {
      //     item.text = item.text.replace(/Energielabel: /g,'');
      //     return item;
      //   });
      // }

      if (row.availabilityText) {
        let text = 'In Stock';
        row.availabilityText = row.availabilityText.map(item => {
          let regex = new RegExp(/^.*niet beschikbaar|niet leverbaar.*$/i)
          if (regex.test(item.text)) {
            text = "Out of Stock"
          }
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
