const {Client, GatewayIntentBits, Routes} = require("discord.js");
const { REST } = require('@discordjs/rest');
var Vinted_Class = require("./vinted")
var constants = require("./config.json"); 
var commandsList = require("./commands.json")


class Robot
{
    GENERAL_CHANNEL;
    PRODUCT_CHANNEL;
    client;
    vintedObj;
    rest;
    static_value;

    //commands

    commands = 
    [
        
    ]

    //constantes

    
    

    constructor(static_value, commandList)
    {
        this.static_value = static_value;    
        this.vintedObj = new Vinted_Class();
        this.client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]}); 
        this.rest = new REST({ version: '10' }).setToken(this.static_value.TOKEN);
        this.commands.push(commandList.PRICE_COMMAND);
        this.commands.push(commandList.SIZE_COMMAND);
        this.commands.push(commandList.STATE_COMMAND);      
    }
    


    __init__()
    { 
        this.client.login(this.static_value.TOKEN,);
        
        this.client.once("ready", ()=>
        {
            this.client.user.setStatus("online");
            this.client.user.setActivity("En train de se faire créer.")      
            this.PRODUCT_CHANNEL = this.client.channels.cache.get(this.static_value.product_channel_id);
            this.GENERAL_CHANNEL = this.client.channels.cache.get(this.static_value.general_channel_id); 
            console.log("Bot connecté");
            this.vintedObj.__init__().then(()=>{this.createAllCommands(); this.createListeners();});            
        });      
           
                              
    }
    sendMessage(message, channel)
    {
        channel.send(message)
    }
    createAllCommands()
    {
        this.rest.put(
            Routes.applicationCommands(this.static_value.CLIENT_ID),
            { body: this.commands },
        );        
    }

    createListeners()
    {
        this.client.on('interactionCreate', interaction => {
            if(interaction.isChatInputCommand())
            {
                switch(interaction.commandName)
                {
                    case "set-price":

                        var price_from = interaction.options.get('min-price').value;
                        var price_to = interaction.options.get('max-price').value;

                        interaction.reply("Prix appliqué minimum de : "+price_from + "€ et maximum à : "+price_to+ "€.");
                        // this.vintedObj.setPrice(price_from,price_to)
                        break;
                    case 'set-size':
                        var value = interaction.options.get('size').value;
                        interaction.reply("Taille sélectionnée "+value+".");
                        //this.vintedObj.setSize(value)
                        break;
                    case 'set-state':
                        var value = interaction.options.get('state').value;
                        interaction.reply("Etat sélectionné : "+value+".");
                        this.vintedObj.setState(value)
                        break;
                }
            }
            
        });
    }

    getProducts()
    {
        var list = this.vintedObj.getCatalogue();
        console.log(JSON.parse(list))
    }
    

}

var robot = new Robot(constants,commandsList);
robot.__init__(); 

setInterval(()=>
{
    //robot.getProducts();
},20000);

