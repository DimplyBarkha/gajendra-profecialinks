const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.id) {
                 var string = row.id[0].text.split('/').splice(-4).toString();
                 var lastIndex = string.lastIndexOf(",");
                 var text = string.substring(0, lastIndex);
                row.id = text.replace(/,/g , '');
            }

            if(row.productUrl) {
                row.productUrl = 'https://www.milar.es'.concat(row.productUrl[0].text)
            }
        }
      }
      return data;
  };
  
  module.exports = { transform } 
  