var Robot = require('./robot.js')
var commandsList = require("./commands.json");


const TOKEN = "MTAwMjMyODkyODk2ODUyNzkwMg.GR2KYk.ozTfOHNum2N0jO2yNvJj9gFgJ7K27374Jr2l3w";//process.env.TOKEN;
const clientID = "1002328928968527902";//process.env.CLIENT_ID;
const commandsID = 
{
    general_channel_id:"1002330996756201555",
    product_channel_id:"1004733860807966751"
}
var robot = new Robot(commandsID,commandsList,TOKEN,clientID);
robot.__init__(()=>
{
    robot.intervalID = setInterval(()=>
    {
        robot.getProducts();
        var today= new Date().toLocaleString('fr-FR', { timeZone: 'UTC' });
        console.log("refresh at " + today)
    },20000);
});