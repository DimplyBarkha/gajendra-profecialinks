
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
      if (row.additionalDescBulletInfo) {
        let bullet_count = '';
        row.additionalDescBulletInfo.forEach(item => {
          bullet_count = item.text.split(/\n/g).length;
          item.text = "| " + item.text.replace(/\n/g, ' | ').trim();
        });
        row.descriptionBullets = [{"text":bullet_count}];
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
      if (row.alternateImages) {
        let info = [];
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/cart\./g, 'zoom-desktop.').trim();
        });
      }
      if (row.variants) {
        let variations = [];
        let v_info = [];
        let color = null;
        row.variants.forEach(item => {
          let data = JSON.parse(item.text);
          if (data['variations']) {
            data['variations'].forEach(variation => {
              variations.push(variation['sku']);
              v_info.push(variation['color']);
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
        if(v_info.length){
          row.variantInformation = [{ "text": v_info.join(' | ') }];
        }
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text + " - " + row.name[0]["text"];
        });
      }
      if (row.description) {
        let description_ar = [];
        row.description.forEach(item => {
          description_ar.push(item.text);
        });
        if(description_ar.length){
          row.description = [{"text": "|| " + description_ar.join(" || ")}]
        }
      }      
    }
  }
  return data;
};

module.exports = { transform };