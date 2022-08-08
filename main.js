var Robot = require('./robot.js')
var commandsList = require("./commands.json");


const TOKEN = process.env.TOKEN;
const clientID = process.env.CLIENT_ID;
const commandsID = 
{
    general_channel_id: process.env.GENERAL_CHANNEL_ID,
    product_channel_id: process.env.PRODUCT_CHANNEL_ID
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