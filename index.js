const {Client} = require("discord.js");
//var Vinted_Class = require("./vinted")
const client = new Client({intents: 8});
const {TOKEN} = require("./config.json");

client.once("ready", ()=>
{
    console.log("Bot connecté !");
    client.user.setStatus("online");
    client.user.setActivity("En train de se faire créer.");    
    //var vintedObject = new Vinted_Class();
    
});
console.log(TOKEN);
client.login(TOKEN);