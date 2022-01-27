const util = require('util');
const fs = require('fs');
const Discord = require('discord.js');
const Permissions = require('discord.js');
const Canvas = require('canvas'); //Join message image creation tool
const { prefix, token } = require('./config.json'); //Stores information about command prefix and token of AstroBot
const db = require("quick.db"); //Database for storing information.
const track = require("novelcovid") //Novel COVID-19 API
const { create, all } = require('mathjs') // Differential Equation MATH Functions
const math = create(all) // Math functions require
const axios = require('axios') // Axios API fetch



const bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
bot.commands = new Discord.Collection();

//const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

/*for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	bot.commands.set(command.name, command);
}*/

//Console ON message
bot.once('ready', () => {
	console.log('Ready!');
	bot.users.fetch('220281067024809984').then((user) => {
		user.send("I am now online!")
	
	});
});

//Give specific roles to user on join.
bot.on('guildMemberAdd', member => {
	
	let role = member.guild.roles.cache.get("807097868468617216");
	let second = member.guild.roles.cache.get("791481162459119636");
	let third = member.guild.roles.cache.get("799868074702536704");

	if (member.roles.cache.find(r => r.name !== "New")) {
			member.roles.add(role);
	}
	if (member.roles.cache.find(r => r.name !== "⁣	 	 	 	NOTIFICATIONS")) {
        	member.roles.add(second);
    }
	if (member.roles.cache.find(r => r.name !== "Member")) {
        	member.roles.add(third);
    }
});


bot.on('message' , async message => {


	if (!message.content.startsWith(prefix) || message.author.bot) return; // If The message doesn't start w/ prefix or is sent by BOT exit process

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase(); //Shifts command to lowercase if sent in caps


	// COVID API - Using NovelCovid
	if(command === "covid") {
	     if(!args.length) {
	      return message.channel.send("Please give the name of country")
	    }

	  if(args.join(" ") === "all") {
	      let corona = await track.all() //it will give global cases

	      let embed = new Discord.MessageEmbed()
	      .setTitle("Global Cases")
	      .setColor("#ff0000")
	      .setDescription("Some case numbers may differ slightly.")
	      .addField("Total Cases", corona.cases, true)
	      .addField("Total Deaths", corona.deaths, true)
	      .addField("Total Recovered", corona.recovered, true)
	      .addField("Today's Cases", corona.todayCases, true)
	      .addField("Today's Deaths", corona.todayDeaths, true)
	      .addField("Active Cases", corona.active, true);

	      return message.channel.send(embed)
	    } else {
	      let corona = await track.countries({ country: args.join(' ')}) //change it to countries

	      let embed = new Discord.MessageEmbed()
	      .setTitle(`${corona.country}`)
	      .setColor("#ff0000")
	      .setDescription("Some case numbers may differ slightly.")
	      .addField("Total Cases", corona.cases, true)
	      .addField("Total Deaths", corona.deaths, true)
	      .addField("Total Recovered", corona.recovered, true)
	      .addField("Today's Cases", corona.todayCases, true)
	      .addField("Today's Deaths", corona.todayDeaths, true)
	      .addField("Active Cases", corona.active, true);

	      return message.channel.send(embed);


	    }
	
	// NASA APOD (REST API) using AXIOS alternative
	} else if (command === "apod") {
		
		let getAPOD = async () => {
        		let response = await axios.get('https://api.nasa.gov/planetary/apod?api_key=(API-KEY')
        		let APOD = response.data
        		return APOD
   		 }
		
    		let apodValue = await getAPOD();
    		let title = apodValue.title;
    		let date = apodValue.date;
   		let explanation = apodValue.explanation
    		let copyright = apodValue.copyright
    		let hdurl = apodValue.hdurl
    
    		let embed = new Discord.MessageEmbed()
    		.setTitle(`${title} | ${date}`)
    		.setDescription(`${explanation}`)
    		.setColor("#ff0000")
   		.addField("Credits", copyright)
    		.setImage(`${hdurl}`)
    
    		return message.channel.send(embed)
		
	//QUICK.DB Database Storage for Punishments
	} else if (command === "bad") { //Punish someone with a warning
	    if(!message.member.hasPermission("ADMINISTRATOR")) {
	      return message.channel.send("You do not have Mod Squad rank... ")
	    }

	    const user = message.mentions.members.first()

	     if(!user) {
	      return message.channel.send("Please Mention the person to who you want to warn - !bad @mention <reason>")
	     }
		if(message.mentions.users.first().bot) {
	      return message.channel.send("You can not warn my homies {aka. bots}")
	    }
		if(message.author.id === user.id) {
	      return message.channel.send("Why are you trying to warn yourself?")
	    }
	    const reason = args.slice(1).join(" ")

	      if(!reason) {
		  return message.channel.send("Please provide reason to warn - !bad @mention <reason>")
		}
		let warnings = db.get(`warnings_${message.guild.id}_${user.id}`) //Creating warn in quick.db

	     if(warnings === null) {
		  db.set(`warnings_${message.guild.id}_${user.id}`, 1)
		  user.send(`You have been warned in **${message.guild.name}** for ${reason}`)
		  await message.channel.send(`You warned **${message.mentions.users.first().username}** for ${reason}`)
		} else if(warnings !== null) {
		db.add(`warnings_${message.guild.id}_${user.id}`, 1)
	       user.send(`You have been warned in **${message.guild.name}** for ${reason}`)
	      await message.channel.send(`You warned **${message.mentions.users.first().username}** for ${reason}`) 
	    }

	} else if (command === "violations") { //How many violations does user have?
	    const user = message.mentions.members.first() || message.author
		let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
		if (warnings === null) warnings = 0;
		message.channel.send(`${user} has **${warnings}** warning(s)`)

	} else if (command === "resetbad") { //Resets punishments.
		if(!message.member.hasPermission("ADMINISTRATOR")) {
	      return message.channel.send("You are not a Mod Squad member, try again next year <3")
	    }

	    const user = message.mentions.members.first()

	    if(!user) {
	    return message.channel.send("Please mention a user - !resetbad @mention")
	    }

	    if(message.mentions.users.first().bot) {
	      return message.channel.send("Bot are not allowed to have warnings")
	    }
		if(message.author.id === user.id) {
	      return message.channel.send("You are not allowed to reset your warnings")
	    }

	    let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)

		if(warnings === null) {
	      return message.channel.send(`**${message.mentions.users.first().username}** has no warnings`)
	    }
	     db.delete(`warnings_${message.guild.id}_${user.id}`)
		user.send(`Your warnings were reset by ${message.author.username} from ${message.guild.name}`)
		await message.channel.send(`All warnings of **${message.mentions.users.first().username}** have been cleared.`)

	//Differential Initial Value Problem Calculator.
	} else if (command === 'ivp') {

		var funct = args[0];
		var tArg = parseFloat(args[1]);
		var yArg = parseFloat(args[2]);
		var h = parseFloat(args[3]);
		var numIt = parseFloat(args[4]);
		//var j = 0;

	    if (args.length < 5 ) {
		let embed = new Discord.MessageEmbed()
		.setTitle('IVP Numerical Solutions')
		.setDescription('Please use command !ivp {function} {t0} {y0} {h} {n}')
		.addField('{function}', 'Define the DE using * for multiplication / for division ^ for caret.')
		.addField('{t0}', 'initial time, typically 0.')
		.addField('{y0}', 'Initial Position "space".')
		.addField('{h}', 'The Step-Size, recommended 0.01')
		.addField('{n}', 'How many iterations do you want to run this for?')
		.setColor(0xFF0000)
		message.channel.send(embed)
	    } else {

		for (var i = 0; i < numIt; i++) {
		    let scope = {
			t: tArg,
			y: yArg
		    };

		    var k = math.evaluate(funct, scope); //@ t and y
		    yArg = (h*k)+yArg;
		    tArg = tArg + h;
		}
			let embed2 = new Discord.MessageEmbed()
		.setTitle('IVP Numerical Solutions')
		.setDescription('We were able to find a value!')
		.addField('The function you inputted:', funct)
		.addField('The t value calculated:', tArg)
		.addField('The y value calculated:', yArg)
		.addField('The step size:', h)
		.addField('The number of iterations:', numIt)
		.setColor("#ff0000")
		message.channel.send(embed2)
	    }

	//Rock Paper Scissors game.
	} else if (command === 'rps') {
		var art = message.content.slice(prefix.length).trim().split(' '); //Pull Arg from msg
		var ai = Math.floor(Math.random() * 3); // 0-2 (0,1,2)
		var choice = art[1]
		//Change user input to UNICODE
		if (choice === "r" || choice === "rock" || choice === "Rock") {
			choice = "🌑"
		} else if (choice === "p" || choice === "paper" || choice === "Paper") {
			choice = "📰"
		} else if (choice === "s" || choice === "scissors" || choice === "Scissors") {
			choice = "✂️"
		} else {
			return message.channel.send("Please use !rps r, p or s. (ex. !rps r)") //Return if false
		}
		//Change AI to UNICODE
			if (ai === 0) { 
				ai = "🌑";
			} else if (ai === 1) {
				ai = "📰";
			} else if (ai === 2) {
				ai = "✂️";
			} 

		 if (choice == "🌑" && ai == "🌑") { //Check to see who winner is
			var fate = "Tie";
		} else if (choice == "🌑" && ai == "📰") {
			var fate = "You lost!";
		} else if (choice == "🌑" && ai == "✂️") {
			var fate = "Winner!";
		} else if (choice == "📰" && ai == "🌑") {
			var fate = "Winner!";
		} else if (choice == "📰" && ai == "✂️") {
			var fate = "You lost!";
		} else if (choice == "📰" && ai == "📰") {
			var fate = "Tie";
		} else if (choice == "✂️" && ai == "✂️") {
			var fate = "Tie"
		} else if (choice == "✂️" && ai == "📰") {
			var fate = "You won!"
		} else if (choice == "✂️" && ai == "🌑") {
			var fate = "You lost!"
		}
		const user = message.mentions.users.first() || message.author ;
		let embed = new Discord.MessageEmbed()
		.setTitle('AstroBot 🌑📰✂️')
		.addField(`${user.username}:`, `${choice}`)
		.addField('AstroBot:', `${ai}`)
		.addField('Results:', `${fate}`)
		.setColor(0xFF0000)
		.setThumbnail('https://imgur.com/BWbS1Dx.png')

		message.channel.send(embed);


	//Deletes a specific amount of messages from a specific user within the past 2 weeks.	
	} else if (command === 'purge') {
	    if(!message.member.hasPermission("MANAGE_MESSAGES")) {
	      return message.channel.send("You have not be given Mod Squad Rank... sorry champ!")
	    }
		const user = message.mentions.users.first();
		// Parse Amount
		const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
			if (!amount) return message.reply('Must specify an amount to delete!');
			if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
		// Fetch 100 messages (will be filtered and lowered up to max amount requested)
		    message.channel.messages.fetch({
		     limit: 100,
		}).then((messages) => {
		 if (user) {
			const filterBy = user ? user.id : Client.user.id;
			messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
		 }
			message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
		});


	} else if (command === 'reminders') {
		let embed = new Discord.MessageEmbed()
		.setTitle('React to recieve Notifications')
		.setDescription('Are you interested in recieving notifications for specific classes? The #reminders channel will send messages and ping you regarding upcoming assignment & deadlines.')
		.addField('Quantum Mechanics 1', '(PHYS 234) | 🧘')
		.addField('Computer Science Intro 1', '(CS 115) | 💻')
		.addField('Differential Equations', '(MATH 228) | 📝')
		//.addField('Modern Physics', '(PHYS 124) | 🚀')
		//.addField('Waves, Electricity, Magnets', '(PHYS 122) | 🧲')
		.addField('General Waterloo Notifications', 'Info and Important Dates | 📢')
		.setColor(0xFF0000)
		.setThumbnail('https://imgur.com/H0XrMkP.jpg')
		let msgEmbed = await message.channel.send(embed)
		msgEmbed.react('🧘')
		msgEmbed.react('💻')
		msgEmbed.react('📝')
		//msgEmbed.react('🚀')
		//msgEmbed.react('🧲')
		msgEmbed.react('📢')

	} else if (command === 'gender') {
		let embed = new Discord.MessageEmbed()
		.setTitle('React for the following roles!')
		.addField('Pronouns', '🔵he/him | 🔴she/her | 🟡they/them')
		.addField('Are you...', '🏫On Campus? | 🏡Off Campus?')
		.setColor(0xFF0000)
		.setThumbnail('https://imgur.com/6hMkuus.jpg')
		let msgEmbed = await message.channel.send(embed)
		msgEmbed.react('🔵')
		msgEmbed.react('🔴')
		msgEmbed.react('🟡')
		msgEmbed.react('🏫')
		msgEmbed.react('🏡')


	//Removes a specific amount of messages.
	} else if (command === 'prune') {
		const amount = parseInt(args[0]);
			if (!message.member.hasPermission('MANAGE_MESSAGES')) {
				return message.reply('You\'re not cool enough');
			} else if (isNaN(amount)) {
				return message.reply('that doesn\'t seem to be a valid number.');
			} else if (amount < 2 || amount > 100) {
				return message.reply('you need to input a number between 2 and 100.');
			}	
		message.channel.bulkDelete(amount);	
		message.channel.send('The Moderators decided that some of this information was junk! So we yeeted it.');	

	//Fun Command
	} else if (command === 'feds') {
		message.channel.send('In case of an investigation by any federal entity or similar, I do not have any involvement with this group or with the people in it, I do not know how I am here, probably added by a thrid party, I do not support any actions by the member of this group.');

	//Rules of the server, sent in EMBDED message.
	} else if (command === 'rules'){

		const embedd = new Discord.MessageEmbed()
		.setTitle('General Rules')
		.setDescription('Please read over the following rules carefully. Not following these rules can or will result in your removal from the server. Any questions to these rules, please consult a Mod (green on player list)')
		.setColor(0xFF0000)
		.addField('Rule #1' , 'Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.')
		.addField('Rule #2' , 'No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.')
		.addField('Rule #3' , 'Do not break policy 71. Please run \"!71\" through chat for more information. If you\'re unsure if something is a violation of policy 71 please ask a Mod before sending')
		.addField('Rule #3.1' , 'This includes images of answers or any written or typed final solution (incorrect or not) for any graded component of a course.')
		.addField('Rule #4' , 'Respect all members of this community regardless of their program, grades or path to achieve their degree.')	
		.addField('Rule #5' , 'Have fun!')
		.addField('Disclaimer' , 'Rules are subject to change at any time.')
		.setFooter('AstroBot by Rye')
		.setThumbnail('https://cdn.discordapp.com/avatars/768186864971677707/748996992605d1866d670c2dd8fcfa11.png?size=1024')
		.setTimestamp()

		message.channel.send(embedd)

	// Variable and Arguement storage to produce Discord Embed Message
	} else if (command === 'announce'){
		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			return message.reply('You\'re not cool enough');
		}
		let rChannel = message.guild.channels.cache.get(args[0])
		if(!rChannel) {
			return message.channel.send('Enter a channel name')
		}
		console.log(rChannel)
		let MSG = message.content.split(`!announce ${rChannel.id} `).join("")

		if (!MSG){
			return message.channel.send('You did not enter a message. Redo!')
		}
		const embed = new Discord.MessageEmbed()
			.setTitle(`**Announcement**`)
			.setDescription(`${MSG}`)
			.setColor("0xFF0000")
			.setFooter('Approved by AstroBot')
			.setTimestamp()
		rChannel.send(embed)
		message.delete()


	//Course Information Command (University)
	} else if (command === 'uwflow') {
		const args = message.content.slice(prefix.length).trim().split(' ');
		if(args === 'undefined') {
			return message.channel.send ('Please enter a course code Ex. (math114, chem123, cs100 etc..)')
		} 
		message.channel.send(`https://uwflow.com/course/${args[1]}`);

	//Information about AstroBot	
	} else if (command === 'admin') {
		message.channel.send(`Watching over ${bot.guilds.cache.size} servers and ${bot.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} members.`);


	//Information about specific Discord User Profiles
	} else if (command === 'userinfo'){
		const user = message.mentions.users.first() || message.author ;
		const embed = new Discord.MessageEmbed()
		.setTitle('User Information')
		.setDescription('Here is all the information I could dig up')
		.setColor(0xFF0000)
		.addField('Username' , user.username)
		.addField('Account Created at' , user.createdAt.toLocaleDateString())
		.setThumbnail(user.displayAvatarURL())
		.setFooter('AstroBot by Rye')
		.setTimestamp()

		message.channel.send(embed)

	//School Policies
	} else if (command === '71') {
			message.channel.send('Hold on! Youre in danger of violating policy 71. Please refer to this link for more information; https://uwaterloo.ca/secretariat/policies-procedures-guidelines/policy-71');

	// Make bot think user has joined server. Testing purposes.
	} else if (command === 'fakejoin') {
		if (!message.member.hasPermission('MANAGE_MESSAGES')) {
			return message.reply('You\'re not cool enough');
		}
		bot.emit('guildMemberAdd', message.member);


	}

})

//Reaction Role (GIVE ROLE)
bot.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();

	if (user.bot) return;
	if (!reaction.message.guild) return;
	if (reaction.message.channel.id === "752947541703917619") {
		if (reaction.emoji.name === '🧘') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("836794887256932352")
		} else if (reaction.emoji.name === '💻') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481750810394656")
		} else if (reaction.emoji.name === '📝') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481814848897044")
		/*} else if (reaction.emoji.name === '📝') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481814848897044")
		} else if (reaction.emoji.name === '🚀') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791482040637325342")
		} else if (reaction.emoji.name === '🧲') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481957850677278")*/
		} else if (reaction.emoji.name === '📢') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("800549604802035743")
		} else if (reaction.emoji.name === '🔵') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("753812825822068908")
		} else if (reaction.emoji.name === '🔴') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("753813036862799963")
		} else if (reaction.emoji.name === '🟡') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("751222603070439569")
		} else if (reaction.emoji.name === '🏫') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("752947322010206368")
		} else if (reaction.emoji.name === '🏡') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("752947363861233765")
		}

	}
})

//Reaction Roles (TAKE ROLE)
bot.on("messageReactionRemove", async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();

	if (user.bot) return;
	if (!reaction.message.guild) return;
	if (reaction.message.channel.id === "752947541703917619") {
		if (reaction.emoji.name === '🧘') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("836794887256932352")
		} else if (reaction.emoji.name === '💻') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481750810394656")
		} else if (reaction.emoji.name === '📝') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481814848897044")
		/*} else if (reaction.emoji.name === '📝') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481814848897044")
		} else if (reaction.emoji.name === '🚀') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791482040637325342")
		} else if (reaction.emoji.name === '🧲') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481957850677278")*/
		} else if (reaction.emoji.name === '📢') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("800549604802035743")
		} else if (reaction.emoji.name === '🔵') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("753812825822068908")
		} else if (reaction.emoji.name === '🔴') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("753813036862799963")
		} else if (reaction.emoji.name === '🟡') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("753812690979258369")
		} else if (reaction.emoji.name === '🏫') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("752947322010206368")
		} else if (reaction.emoji.name === '🏡') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("752947363861233765")
		}
	}
})

//File input for specific commands (coming soon)

/*if (!bot.commands.has(command)) return;
	try {
		bot.commands.get(command).execute(message, args);
		} catch (error) { 
		console.error(error);
		message.reply('someone had an oopsie! Didnt work...');
	}
*/

//Gives bots pressence and sends message to Rye#6662 about status.
bot.on("ready", () =>{
    console.log(`AstroBot is ready to rumble!`);
	bot.user.setActivity(`${bot.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} scientists`, {type : "WATCHING"});
 });

//Logs the bot on, token is pulled at top.
bot.login(token); 
