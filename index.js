const {Client, GatewayIntentBits } = require("discord.js");
var Vinted_Class = require("./vinted")
var value = require("./config.json"); 


class Robot
{
    GENERAL_CHANNEL;
    PRODUCT_CHANNEL;
    client;
    static_value;

    //constantes

    
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

    constructor(static_value)
    {
        this.static_value = static_value;    
        this.client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]}); 
      
        this.__init__();       
    }
    


    __init__()
    {   
        this.client.login(value.TOKEN);
        this.client.once("ready", ()=>
        {
            this.client.user.setStatus("online");
            this.client.user.setActivity("En train de se faire créer.")      
            this.PRODUCT_CHANNEL = this.client.channels.cache.get(this.static_value.product_channel_id);
            this.GENERAL_CHANNEL = this.client.channels.cache.get(this.static_value.general_channel_id); 
            console.log("Bot connecté");
            this.sendMessage("Je suis connecté",this.PRODUCT_CHANNEL)
        });      
           
                              
    }
    sendMessage(message, channel)
    {
        channel.send(message)
    }

    

}

var robot = new Robot(value);
var vintedObj = new Vinted_Class();
setTimeout(
    ()=>
    {
        vintedObj.randomlyMoveMouse();
        while(true)
        {

        }
    },
    10000)
robo
