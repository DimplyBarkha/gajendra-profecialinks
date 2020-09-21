
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = "|| " + item.text.replace(/\n/g, ' || ').trim();
        });
      }
      if (row.category) {
        var category_arr = [];
        row.category.forEach(item => {
          var category = item.text.replace(/\s*\n\s*\n\s*/g, '').trim();
          category_arr = category.split(" >");
          category_arr.splice(0, 1);
          category_arr.splice(category_arr.length - 1, 1);
        });
        if (category_arr.length) {
          row.category = [];
          category_arr.forEach(item => {
            row.category.push({ "text": item });
          });
        }
      }
      if (row.variantInformation) {
        let info = [];
        row.variantInformation.forEach(item => {
          info.push(item.text);
        });
        if (info.length) {
          row.variantInformation = [{ "text": info.join(' | ') }];
        } else {
          delete row.variantInformation;
        }
      }
      if (row.alternateImages) {
        let info = [];
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/cart\./g, 'zoom-desktop.').trim();
        });
      }
      if (row.variants) {
        let variations = [];
        let color = null;
        row.variants.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['variations']) {
            data['variations'].forEach(variation => {
              variations.push(variation['sku']);
              if(variation['sku'] == row.sku[0]['text']){
                row.firstVariant = [{ "text": variation['sku'] }];
              }
            });
          }
          color = data['attributes']['color'];
        });
        if (color) {
          row.color = [{ "text": color }];
        }
        if (variations.length) {
          row.variantCount = [{ "text": variations.length }];
          row.variants = [{ "text": variations.join(' | ') }];
        } else {
          delete row.variants;
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text;
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text;
          });
        }
      }
    }
  }
  return data;
};

module.exports = { transform };