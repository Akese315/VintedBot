const puppeteer = require('puppeteer');


class Vinted_Class
{
    page;
    browser;
    adresse = "";
    oldAdresse;
    IsCookieSet = false;
    isOpen = false;
    Cookies;

    categorie_vetement_homme = "vetements?catalog[]=2050";
    size_S = "size_id[]=207";    
    size_M = "size_id[]=208";
    size_L = "size_id[]=209";
    size_XL = "size_id[]=210";
    state_new = "status[]=1&status[]=6";
    state_really_good = "status[]=2";
    state_good = "status[]=3";
    newest_first = "order=newest_first"
    price_from = "price_from=";
    price_to = "price_to=";
    money = "currency=EUR";
    searchText = "search_text=";

    size ="";
    state ="";
    price = "";
    search ="";

    randomlyMoveMouse()
    {
        this.page.mouse.move(Math.random()*400,Math.random()*400);
    }

    getElement(element)
    {
        return this.page.$eval(element, result =>
                {          
                return JSON.stringify(
                    {
                        offsetLeft: result.getBoundingClientRect().left,
                        offsetTop: result.getBoundingClientRect().top,
                        offsetHeight: result.offsetHeight,
                        offsetWidth: result.offsetWidth,
                        innerText: result.innerText            
                    });
                });
    }

    async getElements(element)
    {
        return await this.page.$$eval(element,(result)=>
        {
            var list = []
            result.forEach(element => {
                var object = JSON.stringify
                ({
                    offsetLeft: element.getBoundingClientRect().left,
                    offsetTop: element.getBoundingClientRect().top,
                    offsetHeight: element.offsetHeight,
                    offsetWidth: element.offsetWidth,
                    innerText: element.innerText
                });
                list.push(JSON.parse(object));
            });
            return list;           
        })
    }

    async clickOnElement(element)
    {
        var buttonX = element.offsetLeft + element.offsetWidth/2;
        var buttonY = element.offsetTop + element.offsetHeight/2;
        await this.page.mouse.move(buttonX,buttonY);
        return this.page.mouse.click(buttonX,buttonY, { button: 'left' })
    }

    closeSession()
    {
        this.browser.close();
    }

    setSize(TempSize)
    {        
        switch(TempSize)
        {
            case "S":
                this.size = this.size_S;
                break;
            case "M":
                this.size = this.size_M;
                break;
            case "L":
                this.size = this.size_L;
                break;
            case "XL":
                this.size = this.size_XL;
                break;
            case "tout":
                this.size = this.size_S+"&"+this.size_M+"&"+this.size_L+"&"+this.size_XL;
                break;
            case "aucun":
                this.state = "";
                break;
        }
        console.log(this.size)
        this.setNewUrl();
    }

    searchBrand(brand)
    {
        this.search = this.searchText + brand;
        this.setNewUrl();
    }

    setState(tempState)
    {
        switch(tempState)
        {
            case "neuf":
                this.state = this.state_new;
                break;
            case "très bon état":
                this.state = this.state_really_good;
                break;
            case "bon état":
                this.state = this.state_good;
                break;
            case "tout":
                this.state = this.state_new+"&"+this.state_really_good+"&"+this.state_good;
                break;
            case "aucun":
                this.state = "";
                break;
        }
        console.log(this.state)
        this.setNewUrl();
    }

    setPrice(from, to)
    {
        this.price = this.price_from +from + "&"+ this.price_to + to;
        this.setNewUrl();
    }

    async refresh()
    {
        if(this.adresse == this.oldAdresse)
        {
            await this.page.reload();
        }else
        {
            await this.page.goto(this.adresse, {waitUntil:"load"});
            this.oldAdresse = this.adresse;
        }
        //await this.page.screenshot({path: 'exemple.png'});
        if(!this.IsCookieSet)
        {
            var button = await this.getElement("#onetrust-accept-btn-handler").catch(()=>
            {
                console.log("error")
                return;
            });
            if(typeof(button) == "undefined")
            {   
                console.log("button undefined !")
                this.IsCookieSet = await true;
                //this.closeSession();
                return;
            }else
            {
                this.IsCookieSet = await true;
                return this.clickOnElement(JSON.parse(button));
            }            
            //this.Cookies = await JSON.stringify(await this.page.cookies(), null, 2);
           
        }else
        {
           //this.page.setCookie(JSON.parse(this.Cookies));
        }
    }

    async getCatalogue()
    {   
        if(this.adresse === "")
        {
            var list = []
            return list;
        }
        await this.refresh();
        var FinalProductList = await this.page.evaluate(()=>
        {   
            var productList = [];
            var imageList = document.querySelectorAll(".feed-grid__item:not(.feed-grid__item--full-row) [class*='ItemBox_image']");
            var priceList =  document.querySelectorAll(".feed-grid__item:not(.feed-grid__item--full-row) [class*='ItemBox_title-content']");
            var brandList = document.querySelectorAll(".feed-grid__item:not(.feed-grid__item--full-row) [class*='ItemBox_details']");
            var sizeList = document.querySelectorAll(".feed-grid__item:not(.feed-grid__item--full-row) [class*='ItemBox_subtitle']");

            for(var i = 0; i < imageList.length; i++)
            {   
                try{
                    var object = JSON.stringify(
                        {
                            brand: brandList[i].innerText,
                            url: imageList[i].lastChild.href,
                            size: sizeList[i].innerText,
                            image: imageList[i].firstChild.firstChild.src,
                            price: priceList[i].innerText,
                        }
                    );
                    productList.push(JSON.parse(object));
                }catch(error)
                {
                    console.log(error)  
                }
                
            }
            return productList;
        })
        return FinalProductList;
     }


    async setNewUrl()
    {
        var tempAdresse = await "https://www.vinted.fr/";
        tempAdresse += await this.categorie_vetement_homme;
        if(this.size !== "")
        {
            tempAdresse += await"&"+this.size;       
        }
       
        if(this.state !== "")
        {
            tempAdresse += await"&"+this.state;       
        }
        
        if(this.price !== "")
        {
            tempAdresse += await "&" +this.money;
            tempAdresse += await "&"+this.price;
        }
        if(this.search !=="")
        {
            tempAdresse += await "&"+this.search;
        }
        tempAdresse += await "&"+ this.newest_first;

        await console.log(tempAdresse)
        this.adresse = tempAdresse;
    }

    async __init__()
    {
        var object = this;
        return new Promise( async function(resolve,reject )
        {
            object.browser = await puppeteer.launch(
                {
                            headless : true,
                            args: [
                            '--window-size=1200,800','--no-sandbox','--disable-setuid-sandbox']
                        
                });
            object.page= await object.browser.newPage();
            object.page.setViewport({ width: 1200, height: 800 })
            object.page.setCacheEnabled(true);
            object.page.setDefaultNavigationTimeout(0); 
            object.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")                            
            if(typeof(object.browser) !== "undefined" && typeof(object.page) !=="undefined")
            {
                resolve("ok");
            }else{
                reject("error")
            }
            await object.page.setRequestInterception(true);
            await object.page.on("request", request => {
                if (/google|cloudflare/.test(request.url())) {
                    console.log("aborted : "+ request.url())
                    request.abort();
                }
                else {
                    request.continue();
                }
              });
                  
        }) 
    }

} 

module.exports = Vinted_Class;
 







