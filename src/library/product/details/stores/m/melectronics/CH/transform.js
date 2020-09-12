const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.descriptionBullets) {
                row.descriptionBullets= [{ "text" : row.descriptionBullets.length}]
            }
            if (row.specifications) {
              row.specifications.forEach(item => {
                  item.text  = item.text.replace(/(\s*\n\s*)/g, ' | ').trim();
              });
            }
            if (row.category) {
              row.category.forEach(item => {
                  item.text  = item.text.replace(/(\s*\n\s*)/g, ' > ').trim();
              });
            }
        }
    }
      return data;
  };
  module.exports = { transform } 