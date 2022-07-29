const puppeteer = require('puppeteer');

class Vinted_Class
{
    constructor()
    {
       this.__init__();
    }

    randomlyMoveMouse(mouse)
    {
        mouse.move(Math.random()*400,Math.random()*400);
    }

    getElement(page, element)
    {
        return page.$eval(element, result =>
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

    getElements(page, element)
    {
        return page.$$eval(element, results =>
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
    clickOnElement(mouse, element)
    {
        var buttonX = element.offsetLeft + element.offsetWidth/2;
        var buttonY = element.offsetTop + element.offsetHeight/2;
        mouse.move(buttonX,buttonY);
        mouse.click(buttonX,buttonY, { button: 'left' })
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
            const page = await browser.newPage();
            await page.setViewport({ width: 1200, height: 800 })
            await page.setCacheEnabled(false);
            await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36")
            await page.goto('https://www.vinted.fr/vetements?catalog[]=5&order=newest_first');
                
            await page.once('load', () => console.log('Page loaded!'));
            await page.screenshot({path: 'C:\\Users\\axelr\\Downloads\\exemple.png'});
            await page.waitForTimeout(1000);            
            await this.randomlyMoveMouse(page.mouse);
            var button = JSON.parse(await this.getElement(page,"#onetrust-accept-btn-handler"));
            if(typeof(button) == "undefined")
            {
                await browser.close();
            }     
            
            await this.clickOnElement(page.mouse, button);
            var list = await this.getElements(page,".feed-grid__item");
            list.forEach(element => {
                var object = JSON.parse(element);
                console.log(object.innerText);
            });
    
            await page.waitForTimeout(4000);            
            await browser.close();
         })()
    }

}

 
module.exports = Vinted_Class;
 







