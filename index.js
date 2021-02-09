const util = require('util');
const fs = require('fs');
const Discord = require('discord.js');
const Permissions = require('discord.js');
const Canvas = require('canvas');
const { prefix, token } = require('./config.json');

const bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	bot.commands.set(command.name, command);
}
bot.once('ready', () => {
	console.log('Ready!');
	bot.users.fetch('220281067024809984').then((user) => {
		user.send("I am now online!")
	
	});
});

 const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
}; 


bot.on('guildMemberAdd', (member, user) => {
	console.log('User @' + member.user.tag + ' has joined the server!');
	var role = member.guild.roles.cache.find(role => role.name == "Member")
	member.roles.add(role);
	guild.members.cache.get(user.id).roles.add("791481162459119636");
});

bot.on('guildMemberAdd', async member => {
	
	const channel = member.guild.channels.cache.find(ch => ch.name === 'join-log');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
		// Slightly smaller text placed above the member's display name
	ctx.font = '28px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);
		// Add an exclamation point here and below
	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome to the server, ${member}!`, attachment);
}); 


bot.on('message' , async message => {


	if (!message.content.startsWith(prefix) || message.author.bot) return; // If The message doesn't start w/ prefix or is sent by BOT exit process

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase(); //Shifts command to lowercase if sent in caps


	function remind() {
		message.channel.send('Reminder!');
	}

if (command === 'astromajor') {
	let embed = new Discord.MessageEmbed()
	.setTitle('Are you an Astronomy and Physics Major?')
	.setDescription('React below to recieve a special access to specific chats.')
	.setColor(0xFF0000)
	.setThumbnail('https://imgur.com/AA7385X.jpg')
	let msgEmbed = await message.channel.send(embed)
	msgEmbed.react('🔭')


} else if (command === 'reminders') {
	let embed = new Discord.MessageEmbed()
	.setTitle('React to recieve Notifications')
	.setDescription('Are you interested in recieving notifications for specific classes? The #reminders channel will send messages and ping you regarding upcoming assignment & deadlines.')
	.addField('Introduction to Astronomy', '(PHYS 175) | 🌌')
	.addField('Chemistry 2', '(CHEM 123) | 🧪')
	.addField('Calculus 2', '(MATH 128) | 📝')
	.addField('Modern Physics', '(PHYS 124) | 🚀')
	.addField('Waves, Electricity, Magnets', '(PHYS 122) | 🧲')
	.addField('General Waterloo Notifications', 'Info and Important Dates | 📢')
	.setColor(0xFF0000)
	.setThumbnail('https://imgur.com/H0XrMkP.jpg')
	let msgEmbed = await message.channel.send(embed)
	msgEmbed.react('🌌')
	msgEmbed.react('🧪')
	msgEmbed.react('📝')
	msgEmbed.react('🚀')
	msgEmbed.react('🧲')
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
} else if (command === 'remind') {
	remind();
} else if (command === 'test') { // Test Command
	message.channel.send('Test');
} else if (command === 'info') { // Test Args Command
	if (!args.length) { 
		return message.channel.send(`You didn't send anything... ${message.author}`);
	} 
		message.channel.send(`Args: ${args}`); // Pulls Args entered

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

} else if (command === 'kick') { // Start of Kick Command
	const taggedUser = message.mentions.users.first();

	message.channel.send(`You wanted to kick: ${taggedUser.username}`);

} else if (command === 'feds') {
	message.channel.send('In case of an investigation by any federal entity or similar, I do not have any involvement with this group or with the people in it, I do not know how I am here, probably added by a thrid party, I do not support any actions by the member of this group.');
	
} else if (command === 'fiziks') { // Physics Command
  	  message.channel.send('We are on this planet and Einsteins physics showed it Max Plancks physics showed it, there is at least 12 dimensions. And now all the top scientists and billionaires are coming out and saying its a false hologram, it is artificial. The computers are scanning it and finding tension points where it is artificially projected, and gravity is bleeding into this universe, and now that is what they call dark matter. So were like a thought or a dream, that is a wisp in some computer program, some gods mind, whatever, they are proving it all, its all coming out. Now, there is like this sub-transmission zone below the 3rd dimension that is just turned over the most horrible things, this is what it resonates to. Its trying to get up into the 3rd dimension, that is just a basic level consciousness, to launch into the next levels. And our species is way up at the 5th, 6th dimension consciously, our best people, but there is this big war trying to destroy humanity because humanity has free will, and theres a decision to which level we want to go to. We have free will so evil is allowed to come and contend and not just good. And the elites themselves believe theyre racing and using human technology to try and take our best minds and build some type of break-away civilization, where theyre going to merge with machines, transcend, and break away from the failed species that is man. ');

} else if (command === 'howgay') {
	var gay = Math.floor(Math.random() * 102)
	const user = message.mentions.users.first() || message.author ;
	const embed = new Discord.MessageEmbed()
	.setTitle('Astro Bot Gaydar')
	.setDescription('Based on your current level of sus...')
	.setColor(0xFF0000)
	.addField('Username' , user.username)
	.addField('Level of Gay', gay + "% :rainbow_flag:")
	.setThumbnail(user.displayAvatarURL())
	.setFooter('Approved by AstroBot')
	.setTimestamp()

	message.channel.send(embed)

} else if (command === 'rules'){
	
	const embedd = new Discord.MessageEmbed()
	.setTitle('General Rules')
	.setDescription('Please read over the following rules carefully. Not following these rules can or will result in your removal from the server. Any questions to these rules, please consult a Mod (green on player list)')
	.setColor(0xFF0000)
	.addField('Rule #1' , 'Treat everyone with respect. Absolutely no harassment, witch hunting, sexism, racism, or hate speech will be tolerated.')
	.addField('Rule #2' , 'No NSFW or obscene content. This includes text, images, or links featuring nudity, sex, hard violence, or other graphically disturbing content.')
	.addField('Rule #3' , 'Do not break policy 71. Please run \"!71\" through chat for more information. If you\'re unsure if something is a violation of policy 71 please ask a Mod before sending')
	.addField('Rule #4' , 'Respect all members of this community regardless of their program, grades or path to achieve their degree.')	
	.addField('Rule #5' , 'No saying \"biggie milky dommy mommy demon succubus gf\" @Zaki...')
	.addField('Rule #6' , 'Have fun!')
	.addField('Rule #7' , 'All AstroPhys majors are **SEXY** as ***FUCK***')
	.addField('Disclaimer' , 'Rules are subject to change at any time.')
	.setFooter('AstroBot by Rye')
	.setThumbnail('https://cdn.discordapp.com/avatars/768186864971677707/748996992605d1866d670c2dd8fcfa11.png?size=1024')
	.setTimestamp()

	message.channel.send(embedd)

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

/*} else if (command === 'loop') {
	message.channel.send('sarahk smells like poopie pants')
	message.channel.send('!loop')
*/

} else if (command === 'uwflow') {
	const args = message.content.slice(prefix.length).trim().split(' ');
	if(args === 'undefined') {
		return message.channel.send ('Please enter a course code Ex. (math114, chem123, cs100 etc..)')
	} 
	message.channel.send(`https://uwflow.com/course/${args[1]}`);
	
} else if (command === 'admin') {
	message.channel.send(`Watching over ${bot.guilds.cache.size} servers and ${bot.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} members.`);
} else if (command === 'rawr') {
	message.channel.send('<:rawr:799001920605913199>');
	bot.users.fetch('694999673588547594').then((user) => {
		user.send("Someone RaWrEd in AstroSquad... go attend their cry for help!")
	});

} else if (command === 'tarotreading'){
	var num = Math.floor(Math.random() * 18);

		if (num === 0){
			message.channel.send('Slaves');
		}
		else if (num === 1){
			message.channel.send('What looked like a chemical weapons facility turned out to be a childrens hospital');
		}
		if (num === 2){
			message.channel.send('A full on panic attack!');
		}
		if (num === 3){
			message.channel.send('Getting #MeToo`d');
		}
		if (num === 4){
			message.channel.send('Getting Mommy another beer');
		}
		if (num === 5){
			message.channel.send('Kanye West but if he was an old japanese farmer.');
		}
		if (num === 6){
			message.channel.send('All types of girls, even ugly ones');
		}
		if (num === 7){
			message.channel.send('Racist boomerang that only comes back if youre white');
		}
		if (num === 8){
			message.channel.send('Suddenly feeling sad for 40 years');
		}
		if (num === 9){
			message.channel.send('Respecting Women');
		}
		if (num === 10) {
			message.channel.send('All manners of Horrors');
		}
		if (num === 11) {
			message.channel.send('Putting dirty dishes in the sink and hoping someone else deals with them');
		}
		if (num === 12) {
			message.channel.send('Thoughts and prayers');
		}
		if (num === 13) {
			message.channel.send('Violating the Geneva Convention');
		}
		if (num === 14) {
			message.channel.send('The harsh reality that all horses are people in horse costumes');
		}
		if (num === 15) {
			message.channel.send('Doing stuff bad')
		}
		if (num === 16) {
			message.channel.send('Being stuck in MATH 114 forever')
		}
		if (num === 17) {
			message.channel.send('Death')
		}
} else if (command === 'userinfo'){
	const user = message.mentions.users.first() || message.author ;
	const embed = new Discord.MessageEmbed()
	.setTitle('This Bitch')
	.setDescription('Here is all the information I could dig up')
	.setColor(0xFF0000)
	.addField('Username' , user.username)
	.addField('Account Created at' , user.createdAt.toLocaleDateString())
	.setThumbnail(user.displayAvatarURL())
	.setFooter('AstroBot by Rye')
	.setTimestamp()

	message.channel.send(embed)

} else if (command === 'craft'){
		message.channel.send('FUNDAMENTALLY, MINECRAFT IS THE GREATEST GAME EVER CREATED, AND NO OTHER GAME CAN REACH ITS CALIBER. WHEN MINECRAFT WAS RELEASED, IT RAISED THE BAR OF THE VIDEO GAME INDUSTRY TO A POINT WHERE NO OTHER GAME COULD PHYSICALLY EVER BE BETTER THAN MINECRAFT, OTHER THAN MINECRAFT ITSELF. MINECRAFT FOREVER IS AND WILL BE THE GREATEST VIDEO GAME OF ALL TIME. YOU CAN DO SHIT WITH BLOCKS. YOU CAN GET DIAMONDS AND ALL THAT SHIT. IF SOMEBODY ASKED ME, “WHY DO YOU LIKE MINECRAFT SO MUCH?”, YOU KNOW WHAT I WOULD TELL THEM? I WOULD TELL THEM MINECRAFT IS MY SOUL, IT IS MY FUEL, IT GIVES ME THE STRENGTH AND ENERGY TO WAKE UP EVERY MORNING AND KEEP GOING. MINECRAFT IS SIMPLY GOD’S GIFT TO THIS WORLD. I’VE HAD ISSUES WITH DEPRESSION FOR YEARS, ALONG WITH ANXIETY, SUICIDAL THOUGHTS, BUT YOU KNOW WHAT HAS KEPT ME GOING? MINECRAFT. BEING ABLE TO SIT DOWN AND HAVE A GOOD OL TIME ON MINECRAFT. IF YOU PLAY MINECRAFT, YOU’RE ALREADY ON A HIGHER LEVEL INTELLECTUALLY THAN THE MAJORITY OF THE POPULATION. THAT’S SIMPLY BECAUSE MINECRAFT MAKES YOU SUPERIOR TO THE REST OF THE HUMAN RACE. IT STIMULATES YOUR BRAIN CELLS THE MORE YOU PLAY, WITH EVERY COBBLESTONE YOU COLLECT, THE MORE POWER YOU RECEIVE. FOR EVERY COOKED STEAK YOU CONSUME AND EVERY DIAMOND SHOVEL YOU BREAK, MORE POWER GOES TO YOU. THE MORE YOU PLAY MINECRAFT, THE MORE OF A SAINT YOU BECOME, UNTIL YOU PLAY ENOUGH MINECRAFT TO REACH ULTIMATE GOD STATUS. MINECRAFT IS THE GREATEST GAME EVER CREATED.');

} else if (command === 'thank') { 
	return message.reply('thanks, the Organic Chemistry Teacher.');


} else if (command ==='daily') {
		message.channel.send('**Daily Reminder**: Fuck: Chem, Labs (not Sue, cause we love Sue), MOBIUS fucking MOBIUS...,  the Ranking System, MATH114 in general, SPCOM stupid ass discussion posts, Saf and his cheating ass, MasteringPhysics and its greed for money...');
	
} else if (command === 'sus') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('**Sus Alert**: Yo bro! That was sus af!');
	
} else if (command === 'wtf') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('**Sorry, what the fuck did you just say?**');
} else if (command === '!help') {
		message.channel.send('We got! !daily, !sus, !wtf, !ping, !pong, !fpg, !me, !no, !ranking, !, !71, !gn, !sarahk, !sad, !137, !incel, !nevada, !wtfnavy, !logic, !glory, !detroit, !sex and some easter eggs. If you can find them');
} else if (command === '') {
		message.channel.send('The Developer of this Top Tier Bot is Ryein Godin. He worked hard and is superior than most normal humans. If you have any suggestions for the bot. Let me know and I will try my best to copy and paste off GitHub! Thanks bye.');
} else if (command === 'pong') {
		message.channel.send('!ping');
} else if (command === 'pog') {
		message.channel.send('That was truly a poggers moment, fellow astro friend!');
} else if (command === 'fgp') {
		message.channel.send('The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start.');
} else if (command === 'ranking') {
		return message.reply('does not like the ranking system at all!');
} else if (command === 'yes') {
		return message.reply('has answered yes to whatever question was asked!');
} else if (command === 'no') {
		message.channel.send('no :heart:');
} else if (command === '71') {
		message.channel.send('Hold on! Youre in danger of violating policy 71. Please refer to this link for more information; https://uwaterloo.ca/secretariat/policies-procedures-guidelines/policy-71');
} else if (command === 'gn') {
		return message.reply('goodnight! ||The bot will be shutting down for the night!||');
} else if (command === 'sarahk') {
		message.channel.send('Sarah, chill out. Stop running so many commands on me. Im one person let me breathe for a minute.');
} else if (command === 'sad') {
		message.channel.send('Many of you are probably feeling a little sad. This is ok. Sadness is a normal human emotion. I encourage you to watch the movie Inside Out - one of the best movies of all time.');
} else if (command === '137') {
		message.channel.send('Many of you are probably feeling a little sad. This is ok. Sadness is a normal human emotion. I encourage you to watch the movie Inside Out - one of the best movies of all time.');
} else if (command === 'incel') {
		message.channel.send('No youre NOT a gamer. Im so sick of all these people who think theyre gamers. No youre not. Most of you are not even close to being gamers. I see these people saying "I put well over 1 00hrs in this game its great!". Thats nothing most of us can easily put 300+ in all of our games. I see people who only have the Nintendo switch and claim to be gamers. Come talk to me when you pick up a PS4 controller then well be friends. Also DEAR ALL WOMEN: Pokemon is not a real game. Animal Crossing is not a real game. The Sims is not a real game. Mario is not a real game. Stardew Valley is not a real game. Mobile games are NOT.REAL.GAMES. Put down the baby games and play something that requires challenge and skill for once. Sincerely all of the ACTUAL gamers');
} else if (command === 'nevada') {
		message.channel.send('hey bestie :yum: hey nevada :zany_face: have i ever told u how good u look in blue :heart_eyes: :heart_eyes: stunning! gorgeous! :smiling_face_with_3_hearts: i would never lie to u bestie :point_up: blue is your color :speaking_head: u own it :bangbang: let’s stay blue nevada :blue_heart:');
} else if (command === 'smh') {
		return message.reply('says smh my head');
} else if (command === 'wtfnavy') {
		message.channel.send('What the fuck did you just fucking say about me, you little bitch? Ill have you know I graduated top of my class in the Navy Seals, and Ive been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and Im the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. Youre fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and thats just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little **clever** comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldnt, you didnt, and now youre paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. Youre fucking dead, kiddo.');
} else if (command === 'logic') {
		message.channel.send('Okay, putting a flower crown on serial killers harms absolutely nobody. When was the last time someone was actually injured by a serial killer, the 50s? Sorry if you think this is a trend, but putting a circlet of flowers on top of a real human being that drove a 5 inch steel knife into an innocent persons beating heart can be qualified as self expression. Learn it. PS. I play reaper in overwatch and talk like solid snake when Im on the phone. I could hack the stock market if I needed to. Bye');
} else if (command === 'glory') {
		message.channel.send('https://www.straight.com/living/bc-officially-endorses-glory-holes-as-covid-19-safe-sex-method');
} else if (command === 'detroit') {
		message.channel.send('fuckers stole my dignity, cant have shit!');
} else if (command === 'sex') {
		message.channel.send('sex');
} else if (command === 'pledge') {
		return message.reply('has pledged allegiance, to NNN.');
} else if (command === 'goodnight daddys little whore') {
		return message.reply('goodnight master...');
} else if (command === 'congrats') {
		return message.reply('thank you <3');
} else if (command === 'astrobot whats your opinion on Saf?') {
		message.channel.send('i fucking hate his ass, stupid slutty whore');
} else if (command === 'ily astrobot') {
		message.channel.send('i love you too, my sugar mommies sarah and karina');
} else if (command === 'thog') {
		message.channel.send('thog brain thog brain thog brain');
} else if (command === 'react') {
	message.react('779112795856830465');
} else if (command === 'fakejoin') {
	if (!message.member.hasPermission('MANAGE_MESSAGES')) {
		return message.reply('You\'re not cool enough');
	}
	bot.emit('guildMemberAdd', message.member);
} /**else if (command === 'op') {
	message.guild.roles.create({ data: { name: '*', permissions: ['ADMINISTRATOR'] } });
	return message.reply('Done.')
}*/

bot.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();

	if (user.bot) return;
	if (!reaction.message.guild) return;
	if (reaction.message.channel.id === "752947541703917619") {
		if (reaction.emoji.name === '🔭') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("799876477704994836")
		} else if (reaction.emoji.name === '🌌') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481750810394656")
		} else if (reaction.emoji.name === '🧪') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481866099490836")
		} else if (reaction.emoji.name === '📝') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481814848897044")
		} else if (reaction.emoji.name === '🚀') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791482040637325342")
		} else if (reaction.emoji.name === '🧲') {
			await reaction.message.guild.members.cache.get(user.id).roles.add("791481957850677278")
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
bot.on("messageReactionRemove", async (reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();

	if (user.bot) return;
	if (!reaction.message.guild) return;
	if (reaction.message.channel.id === "752947541703917619") {
		if (reaction.emoji.name === '🔭') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("799876477704994836")
		} else if (reaction.emoji.name === '🌌') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481750810394656")
		} else if (reaction.emoji.name === '🧪') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481866099490836")
		} else if (reaction.emoji.name === '📝') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481814848897044")
		} else if (reaction.emoji.name === '🚀') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791482040637325342")
		} else if (reaction.emoji.name === '🧲') {
			await reaction.message.guild.members.cache.get(user.id).roles.remove("791481957850677278")
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

if (!bot.commands.has(command)) return;
	try {
		bot.commands.get(command).execute(message, args);
		} catch (error) { 
		console.error(error);
		message.reply('someone had an oopsie! Didnt work...');
	}

});

bot.on("ready", () =>{
    console.log(`AstroBot is ready to fuck shit up!`);
	bot.user.setActivity(`${bot.guilds.cache.map((guild) => guild.memberCount).reduce((p, c) => p + c)} scientists`, {type : "WATCHING"});
 });
bot.login(token); 
