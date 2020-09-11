const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.id) {
                var string= row.id[0].text.split('/').slice(-4)
                row.id = string.slice(0,3).toString().replace(/,/g, "")
            }

            if(row.productUrl) {
                row.productUrl = 'https://www.milar.es'.concat(row.productUrl[0].text)
            }
        }
      }
      return data;
  };
  
  module.exports = { transform } 
  