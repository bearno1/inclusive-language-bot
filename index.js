const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });

client.login('TOKEN');

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

var prefix = '=';
var helpEmbed = new EmbedBuilder()
    .setColor('#4f86f7')
    .setTitle("To interact with me pls type below command")
    .setDescription("=quiz: to start inclusive language quiz.\n=start: to start learning inclusive language.\n=fact: for quick fact of the day about inclusive language.\n=mode: enable or disable inclusive language mode in chat.");

var defaultEmbed = new EmbedBuilder()
    .setColor('#FFFFFF')
    .setDescription("Hi, this is Neutral.\nI can help you through inclusive langauage.\nFor command list pls type =command");

var quizNum;
var score=0;
var solution = [1,0,1,0,1];
var isQuiz = false;
var result;
var quizlist = [
  new EmbedBuilder()
  .setColor('#FFC0CB')
  .setTitle("Which sentence to describe this picture is more inclusive?")
  .setImage('https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?cs=srgb&dl=pexels-william-choquette-1954524.jpg&fm=jpg')
  .setDescription("🅰️:Man wearing a dark green t-shirt and a black short run on the treadmill\n🅱️:The person wearing a dark green t-shirt and a black short run on the treadmill"),
  new EmbedBuilder()
  .setColor('#FFC0CB')
  .setTitle("Which sentence is more inclusive?")
  .setDescription("🅰️:Research for the benefit of all humankind\n🅱️:Research for the benefit of all mankind"),
  new EmbedBuilder()
  .setColor('#FFC0CB')
  .setTitle("Which sentence is more inclusive?")
  .setDescription("🅰️:If customer is given poor service, he can ask for refund.\n🅱️:Customer who is given poor service can ask for refund."),
  new EmbedBuilder()
  .setColor('#FFC0CB')
  .setTitle("Which sentence is more inclusive?")
  .setDescription("🅰️:Guests who come with their partners can come to the stage to get gift card.\n🅱️:Guests who come with their wives can come to the stage to get gift card."),
  new EmbedBuilder()
  .setColor('#FFC0CB')
  .setTitle("Which sentence is more inclusive?")
  .setDescription("🅰️:Boys and girls should attend school.\n🅱️:Every children should attend school.")];

var startQuizEmbed = new EmbedBuilder()
    .setColor('#953553')
    .setTitle(`Quiz Start ${quizlist.length} questions`)
    .setDescription("To answer the question pls click on the reaction for the choice that you want to choose.");
function scoreEmbedGenerator() {
  return new EmbedBuilder()
  .setColor('#953553')
  .setTitle(`You score is ${score} out of ${quizlist.length}`)
  .setDescription(result);
} 

var factNum = 0;
var factList = [
  new EmbedBuilder()
  .setColor('#45f400')
  .setDescription("In some romance languages such as French. Noun has a gender, so inclusive languages are more complicated."),
  new EmbedBuilder()
  .setColor('#45f400')
  .setDescription("You can try using \“folk\”, \“everyone\”, and  \“team\” which does not include the meaning in terms of gender in the word."),
  new EmbedBuilder()
  .setColor('#45f400')
  .setDescription("\“Deaf\” (with capital \“D\”) and \“deaf\” (with lowercase \“d\”) is spelled the same, however; the meaning is different. \“Deaf\” is the word for people who have been deaf since birth (usually using sign language). \“deaf\” is the word for people who have hearing problems (usually not using sign language).")
];

var isTutorial = false;
var tutorialNum;
var tutorialList = [
  new EmbedBuilder()
  .setColor('#F4B400')
  .setTitle("Welcome to journey in inclusive Language.")
  .setDescription("Pls click on the ✅ to when you finish reading."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setDescription("inclusive language is language that avoids using words that stereotype or offend some people based on their gender, race, age, and other characteristics."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setDescription("The goal of inclusive language is to create environments where everyone can feel valued and included."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setTitle("If you are a moderator in a conference, what is the best way to greet?")
  .setDescription("🅰️:Good morning lady and gentlemen. Welcome to our leader conference.\n🅱️:Good morning everyone. Welcome to our leader conference"),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setDescription("🅱️ sentence is more inclusive because it use \“everyone\” instead of \“lady\” and \“gentlemen\”"),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setTitle("Which sentence is more inclusive?")
  .setDescription("🅰️:If a student got a low score on the test, he can ask for a regrading.\n🅱️:A student who got a low score on the test can ask for a regrading."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setDescription("🅱️ sentence is more inclusive. In this example, We can adapt sentence structure to use relative pronouns \“who\”."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setTitle("Which sentence is more inclusive?")
  .setDescription("🅰️:The CEO must have a good understanding of the situation he is planning.\n🅱️:The CEO must have a good understanding of the situation being planned."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setDescription("🅱️ sentence is more inclusive. In this example, We can use passive voice to avoid using gender pronouns."),
  new EmbedBuilder()
  .setColor('#F4B400')
  .setDescription("I hope you enjoy the tutorial. Inclusive language is that it requires a conscious effort to break the habit of using language that is exclusive. Keep fighting !!!")
]

var inclusiveLangMode = false;
var exclusiveLangList = ["he","she","him","her","man","woman","men","women"];
function wordFoundGenerator(str) {
  return new EmbedBuilder()
  .setColor('#b457f2')
  .setDescription(`Found using of \"${str}\"!!!`);
} 
function modeGenerator(str) {
  return new EmbedBuilder()
  .setColor('#f2579d')
  .setDescription(`Inclusive language mode: ${str}`);
} 

var lastReaction;
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if(user.bot){
    lastReaction = reaction;
    return;
  }
  if(isQuiz){
    var userAns;
    if(reaction.emoji.name == '🅰️')userAns = 0;
    else userAns = 1;
    if(userAns == solution[quizNum]) {
      score++;
      result += `${quizNum+1}: Correct`;
    } else {
      result += `${quizNum+1}: Incorrect`;
    }
    quizNum++;
    if(quizNum != quizlist.length)result += "\n";
    if(quizNum < quizlist.length) {
      reaction.message.channel.send({embeds: [quizlist[quizNum]]});
    } else {
      reaction.message.channel.send({embeds: [scoreEmbedGenerator()]});
      isQuiz = false;
    }
  }
  if(isTutorial){
    reaction.remove();
    lastReaction.remove();
    if(tutorialNum < tutorialList.length) { 
      if(tutorialNum == tutorialList.length - 1)isTutorial = false;
      reaction.message.channel.send({embeds: [tutorialList[tutorialNum]]});
    }
    tutorialNum++;
  }
});

client.on(Events.MessageCreate, msg => {
    if(msg.member.user.bot){
      if(isQuiz){
        if(msg.embeds[0].data.color == 16761035){
          msg.react('🅰️');
          msg.react('🅱️');
        }
      }
      if(isTutorial){
        if(msg.embeds[0].data.color == 16036864){
          msg.react('✅');
        }
      }
      return;
    }
    if(inclusiveLangMode){
      let mes = msg.content.substring().split(" ");
      let wordFound = mes.filter(x => exclusiveLangList.includes(x));
      if(wordFound.length > 0){
        msg.channel.send({embeds: [wordFoundGenerator(wordFound[0])]});
        return;
      }
    }
    if(msg.content[0] != prefix)return;
    let mes = msg.content.substring(prefix.length).split(" ");
    switch(mes[0]) {
      case "command":
        msg.channel.send({embeds: [helpEmbed]});
        break;
      case "quiz":
        msg.channel.send({embeds: [startQuizEmbed]});
        quizNum = 0;
        isQuiz = true;
        score = 0;
        result = "";
        msg.channel.send({embeds: [quizlist[0]]});
        break;
      case "start":
        msg.channel.send({embeds: [tutorialList[0]]});
        isTutorial = true;
        tutorialNum = 1;
        break;
      case "mode":
        if(inclusiveLangMode){
          inclusiveLangMode = false;
          msg.channel.send({embeds: [modeGenerator("off")]});
        } else {
          inclusiveLangMode = true;
          msg.channel.send({embeds: [modeGenerator("on")]});
        }
        break;
      case "fact":
        msg.channel.send({embeds: [factList[factNum%factList.length]]});
        factNum++;
        break;
      default:
        msg.channel.send({embeds: [defaultEmbed]});
    }
    return;
});