const {Client, GatewayIntentBits, Routes, EmbedBuilder} = require("discord.js");
const { REST } = require('@discordjs/rest');
var Vinted_Class = require("./vinted");
var Database = require("./database");



class Robot
{
    GENERAL_CHANNEL;
    PRODUCT_CHANNEL;
    client;
    vintedObj;
    db;
    rest;
    commandsID;
    intervalID;
    IsRunning = false;
    botToken;
    clientID;
    //commands

    commands = 
    [
        
    ]

    //constantes

    
    

    constructor(commandsID, commandList, botToken, clientID)
    {
        this.clientID = clientID;
        this.botToken = botToken;
        this.commandsID = commandsID;    
        this.vintedObj = new Vinted_Class();
        this.db = new Database();
        this.client = new Client(
            {
            sweepers: {interval : 300},
            intents : [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
            }); 
        this.rest = new REST({ version: '10' }).setToken(this.botToken);
        this.commands.push(commandList.PRICE_COMMAND);
        this.commands.push(commandList.SIZE_COMMAND);
        this.commands.push(commandList.STATE_COMMAND);   
        this.commands.push(commandList.DATABASE_COMMAND); 
        this.commands.push(commandList.BRAND_COMMAND);
    }
    


    async __init__(callback)
    { 
        await this.createDatabase();
        await console.log("database online");
        this.client.login(this.botToken);
            
        this.client.on("ready", async()=>
            {
                
                await this.client.user.setStatus("online");
                await this.client.user.setActivity("En train de se faire coder.")      
                this.PRODUCT_CHANNEL = await this.client.channels.cache.get(this.commandsID.product_channel_id);
                this.GENERAL_CHANNEL = await this.client.channels.cache.get(this.commandsID.general_channel_id); 
                await console.log("Bot connecté");
                await this.vintedObj.__init__();   
                await console.log("Vinted scrapper connecté");                           
                await this.createAllCommands();
                await console.log("Commands created");
                await this.createListeners();
                await console.log("Command listeners created");
                await callback();
            });           
    }
    async sendMessage(message, channel)
    {
        channel.send(message)
    }
    createAllCommands()
    {
        this.rest.put(
            Routes.applicationCommands(this.clientID),
            { body: this.commands },
        );        
    }

    createDatabase()
    {        
        return this.db.__init__();
    }

    async sendPurchasedProduct(list)
    {
        if(list.length == 0)
        {
            this.GENERAL_CHANNEL.send("pas d'achats enregistré.")
            return;
        }
        for(var i = 0; i<list.length; i++)
        {
            this.GENERAL_CHANNEL.send("commande :")
        }
    }

    async sendProduct(product)
    {   
        const productMessage = await new EmbedBuilder();
        productMessage.setColor(0x0099FF);
        productMessage.setURL(product.url);
        productMessage.setTitle('Acheter cet article');
        productMessage.setImage(product.image);
        if(product.price !== "")
        {
            productMessage.addFields(
                { name: 'Prix:', value: product.price, inline : false}, 
            );
        }
        if(product.size !== "")
        {
            productMessage.addFields(
                { name: 'Taille:', value: product.size, inline : false}, 
            );
        }
        if(product.brand !== "")
        {
            productMessage.addFields(
                { name: 'Marque:', value: product.brand, inline : false}, 
            );
        }
        
       
        return this.PRODUCT_CHANNEL.send({ embeds: [productMessage] });
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
                        this.vintedObj.setPrice(price_from,price_to)
                        break;
                    case 'set-size':
                        var value = interaction.options.get('size').value;
                        interaction.reply("Taille sélectionnée "+value+".");
                        this.vintedObj.setSize(value)
                        break;
                    case 'set-state':
                        var value = interaction.options.get('state').value;
                        interaction.reply("Etat sélectionné : "+value+".");
                        this.vintedObj.setState(value)
                        break;
                    case 'search-brand':
                        var value = interaction.options.get('brand').value;
                        interaction.reply("Marque sélectionné : "+value+".");
                        this.vintedObj.searchBrand(value);
                        break;
                    case 'database':
                        var value = interaction.options.get('actions').value;
                        interaction.reply("base de donnée : "+value+".");
                        switch(value)
                        {
                            case "supprimer":
                                this.db.deleteAllProduct();
                                this.GENERAL_CHANNEL.send("base de donné supprimé");
                                break;
                            case "afficher les achats":
                                this.sendPurchasedProduct(this.db.findPurchased());
                                break;
                        }
                        break;
                }
            }
            
        });
    }

    async getProducts()
    {
        if(this.IsRunning)
        {
            console.log("is running...")
            return;
        }
        this.IsRunning = await true;
        var now = Date.now();
        var list = await this.vintedObj.getCatalogue();
        var delta = (Date.now() -now)/1000;
        //console.log(list);
        console.log("temps écoulé : " + delta + "s");
        await console.log("collecté : "+list.length)
        if(list.length === 0)
        {
            this.IsRunning = await false;
            return;
        }
        var productNumber = await 0;
        for(var i = list.length-1; i>=0; i--)
        {
            var value = await this.db.urlExists(list[i].url)
            if(value !==null)
            {
                continue;
            }
            await this.sendProduct(list[i]).catch(()=>
            {
                console.log("error when sent")
                return;
            })
            
            await this.db.addProduct(list[i].url);
            await productNumber++;            

        }
        await console.log("Envoyé : "+productNumber);
        this.IsRunning = await false;
    }    

}


module.exports = Robot;



