const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.id) {
                row.id.forEach(item => {
                    var myRegexp = /de\/p\/(\d+\/)/g;
                    var match = myRegexp.exec(item.text);
                    if(match){
                        if(match.length){                            
                            match[1] = match[1].replace(/\//g, '')
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
                    item.text = 'https://www.melectronics.ch'.concat(item.text);
                });
            }
            if(row.name) {
                row.name.forEach(item => {
                    item.text = row.brandText[0].text.concat(' ',item.text)
                });
            }
        }
    }
    return data;
  };  
  module.exports = { transform } 