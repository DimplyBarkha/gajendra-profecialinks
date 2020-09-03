

const transform = (data) => {
  for (const { group} of data) {
      for (const row of group) {
          if (row.additionalDescBulletInfo) {
              row.additionalDescBulletInfo.forEach(item => {
                  item.text  = item.text.replace(/(\s*\n\s\n\s*)/g, ' | ').trim();
              });
          }

          if (row.specifications) {
            row.specifications.forEach(item => {
                item.text  = item.text.replace(/(\s*\n\s\n\s*)/g, ' | ').trim();
            });
        }

   

      }
    }
    return data;
};

module.exports = { transform }