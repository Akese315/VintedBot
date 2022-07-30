const puppeteer = require('puppeteer');

class Vinted_Class
{
    page;

    constructor()
    {
       this.__init__();
    }

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

    getElements(element)
    {
        return this.page.$$eval(element, results =>
            {          
                var list = [];
                results.forEach(element => {
                    var object = JSON.stringify
                    ({
                    offsetLeft: element.getBoundingClientRect().left,
                    offsetTop: element.getBoundingClientRect().top,
                    offsetHeight: element.offsetHeight,
                    offsetWidth: element.offsetWidth,
                    innerText: element.innerText
                    });
                    console.log(object);
                    list.push(object);
                });
                return list;
            });
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
        await browser.close();
    }

    __init__()
    {
        (async () => {
            
            const browser = await puppeteer.launch(
                {
                    headless : true,
                    args: [
                    '--window-size=1200,800',]
                
                });
            this.page= await browser.newPage();
            await this.page.setViewport({ width: 1200, height: 800 })
            await this.page.setCacheEnabled(false);
            await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")
            await this.page.goto('https://www.vinted.fr/vetements?catalog[]=5&order=newest_first');
                
            await this.page.once('load', () => console.log('this.page loaded!'));
            await this.page.screenshot({path: 'C:\\Users\\axelr\\Downloads\\exemple.png'});
            await this.page.waitForTimeout(1000);            
            await this.randomlyMoveMouse();
            var button = JSON.parse(await this.getElement("#onetrust-accept-btn-handler"));
            if(typeof(button) == "undefined")
            {
                await browser.close();
            }     
            
            await this.clickOnElement(button);
            var list = await this.getElements(".feed-grid__item");
            list.forEach(element => {
                var object = JSON.parse(element);
                console.log(object.innerText);
            });
            
           
         })()
    }

}

 
module.exports = Vinted_Class;
 







