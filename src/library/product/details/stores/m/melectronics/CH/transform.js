const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.pageTimestamp) {
                var d = new Date();
                row.pageTimestamp = d.toISOString();
            }

            if (row.technicalInformationPdfPresent) {
                row.technicalInformationPdfPresent = 'No';
            }

            if (row.Image360Present) {
                row.Image360Present = 'No';
            }
            if (row.descriptionBullets) {
                row.descriptionBullets= row.descriptionBullets.length
            }
  
            if (row.specifications) {
              row.specifications.forEach(item => {
                  item.text  = item.text.replace(/(\s*\n\s*)/g, ' | ').trim();
              });
          }
  
  
  
        }
      }
      return data;
  };
  
  module.exports = { transform } 