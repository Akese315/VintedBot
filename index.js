const {Client} = require("discord.js");
var Vinted_Class = require("./vinted")
const client = new Client({intents: 8});
const value = require("./config.json");

client.once("ready", ()=>
{
    console.log("Bot connecté !");
    client.user.setStatus("online");
    client.user.setActivity("En train de se faire créer.")    
});
console.log(value.TOKEN);
client.login(value.TOKEN);

console.log(client.guilds.channels)