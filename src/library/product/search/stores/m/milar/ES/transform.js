const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.id) {
                row.id.forEach(item => {
                    var myRegexp = /productos\/00\/00\/(\d+\/\d+\/\d+\/)/g;
                    var match = myRegexp.exec(item.text);
                    if(match){
                        if(match.length){
                            match[1] = match[1].replace('/','');
                            item.text = match[1].trim();
                        }else{
                            delete item.text;
                        }
                    }
                    else{
                        delete item.text;
                    }
                 });
            }  
            if(row.productUrl) {
                row.productUrl.forEach(item => {
                    item.text = 'https://www.milar.es'.concat(item.text);
                });
            }
        }
    }
    return data;
  };  
  module.exports = { transform } 
  