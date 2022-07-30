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
        this.client = new Client({intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]}); 
        this.rest = new REST({ version: '10' }).setToken(this.static_value.TOKEN);
        this.commands.push(commandList.PRICE_COMMAND);
        this.commands.push(commandList.SIZE_COMMAND);
        this.commands.push(commandList.STATE_COMMAND);
        this.__init__();       
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
            this.createAllCommands();
            this.createListeners();
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
                        interaction.reply("Prix appliqué minimum de : "
                        +interaction.options.get('min-price').value+ "€ et maximum à : "
                        +interaction.options.get('max-price').value+"€.");
                        break;
                    case 'set-size':
                        interaction.reply("Taille sélectionnée "+interaction.options.get('size').value+".");
                        break;
                    case 'set-state':
                        interaction.reply("Etat sélectionné : "+interaction.options.get('state').value+".");
                        break;
                }
            }
            
        });
    }
    

}

var robot = new Robot(constants,commandsList);
//var vintedObj = new Vinted_Class();
setTimeout(
    ()=>
    {
        //vintedObj.randomlyMoveMouse();
        var online = true;
        //vintedObj.closeSession();
    },
    10000)

