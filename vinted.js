const puppeteer = require('puppeteer');


class Vinted_Class
{
    page;
    browser;
    IsCookieSet = false;

    categorie_vetement_homme = "vetements?catalog[]=2050";
    size_S = "size_id[]=207";    
    size_M = "size_id[]=208";
    size_L = "size_id[]=209";
    size_XL = "size_id[]=210";
    state_new = "status[]=1&status[]=6";
    state_really_good = "status[]=2";
    state_good = "status[]=3";
    price_from = "price_from=";
    price_to = "price_to="
    money = "currency=EUR"

    size ="";
    state ="";
    price = "";
    

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

    clickOnElement(element)
    {
        var buttonX = element.offsetLeft + element.offsetWidth/2;
        var buttonY = element.offsetTop + element.offsetHeight/2;
        this.page.mouse.move(buttonX,buttonY);
        this.page.mouse.click(buttonX,buttonY, { button: 'left' })
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
        this.refresh();
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
        this.refresh();
    }

    setPrice(from, to)
    {
        this.price = this.price_from +from + "&"+ this.price_to + to;
        this.refresh();
    }

    async getCatalogue()
    {
        var list = await this.getElements(".feed-grid__item");
        await list.forEach(element => {
            var object = JSON.parse(element);
        });
        return list;
    }

    async refresh()
    {
        var adresse = await "https://www.vinted.fr/";
        adresse += await this.categorie_vetement_homme;
        if(this.size !== "")
        {
            adresse += await"&"+this.size;       
        }
       
        if(this.state !== "")
        {
            adresse += await"&"+this.state;       
        }
        
        if(this.price !== "")
        {
            adresse += await "&" +this.money;
            adresse += await "&"+this.price;
        }
        await console.log(adresse)
        await this.page.goto(adresse, {waitUntil: 'load'});
        await this.page.waitForTimeout(2000);  
        await this.page.screenshot({path: 'exemple.png'});
        await console.log("page load")
        if(!this.IsCookieSet)
        {
            var button = await this.getElement("#onetrust-accept-btn-handler");
            if(typeof(button) == "undefined")
            {   
                this.closeSession();
                return;
            } 
            this.IsCookieSet = await true;
            await this.clickOnElement(JSON.parse(button));
        }       
        var value;
        value = await this.getElements(".feed-grid__item");
        console.log(value)
    
       
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
                            '--window-size=1200,800',]
                        
                });
            object.page= await object.browser.newPage();
            object.page.setViewport({ width: 1200, height: 800 })
            object.page.setCacheEnabled(false);
            object.page.setDefaultNavigationTimeout(0); 
            object.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")        
            console.log("Vinted scrapper connecté")  
                    
            if(typeof(object.browser) !== "undefined" && typeof(object.page) !=="undefined")
            {
                resolve("ok");
            }else{
                reject("error")
            }
                  
        }) 
    }

}

module.exports = Vinted_Class;
 







