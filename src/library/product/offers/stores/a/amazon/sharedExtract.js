const appendOffers = async function ({ context, domain, id }) {

    const getOffers = async (domain, id, page) => {
        console.log('getting offers')
        return await context.evaluate(async (domain, id, page) => {
            let response = await fetch(`https://www.${domain}/gp/aod/ajax/ref=olp_dp_redir?asin=${id}&pc=dp&filters=%257B%2522all%2522%253Atrue%252C%2522new%2522%253Atrue%257D&pageno=${page}&isonlyrenderofferlist=true`)
                .then(response => response.text())
                .then(text=>{return text})
            return response;
        }, domain, id, page);
    }

    const getPages = async () => {
        return await context.evaluate(async () => {
            let pagesRaw = document.querySelector('#aod-filter-offer-count-string') || 0;
            let offers = parseInt(pagesRaw.innerText) || 0;
            let pages = Math.ceil(offers/10) || 0;
            return pages
        });
    }

    const appendOffers = async (offers) => {
        await context.evaluate(async (offers) => {
            let div = document.createElement('div');
            div.innerHTML = offers;
            document.body.appendChild(div);
        }, offers);
    }

    let pages = await getPages();

    for(i=1;i<pages;i++){
        let response = await getOffers(domain, id, i+1)
        await appendOffers(response);
    }

  };
  module.exports = { appendOffers };
  