cards = [
["A boy's name","Cities","Things that are cold","Things you don't want in the house","Sports teams","Insects","Things in a coffee bar","Things you mix up","TV shows","Things found in the ocean","Kinds of weather","Foods that kids hate"],
["Things that are sticky","Awards/Ceremonies","Cars","Spices/Herbs","Bad Habits","Cosmetics/Toiletries","Celebrities","Things to do with leftover turkey","Reptiles/Amphibians","Fads","Leisure Activities","Things you're allergic to"],
["Articles of clothing","Desserts","Car Parts","Shoes","Athletes","4-letter words","Things you fold","Things in a bedroom","Things you do online","Things at the beach","Things you dream about","Tools"],
["Heroes","Gifts/Presents","Terms of endearment","Kinds of dances","Things that are black","Vehicles","Things found in an arena","Things people gossip about","Weekend activities","Things in a souvenir shop","Items in your purse/wallet","World records"],
["Sandwiches","Things you can do with your feet","World leaders/politicians","School subjects","Excuses for being late","Types of ice cream","Things with balls","Television stars","Things in a park","Countries","Stones/Gems","Musical Instruments"],
["Nicknames","Things in the sky","Things with windows","Universities","Fish","Things you add water to","Things that have spots","Things that smell bad","Things you're afraid of","Terms of measurement","Items in this room","Book titles"],
["Fictional characters","Places to go on a date","Magazines","Famous landmarks","Sweet things","Things you save up to buy","Footwear","Something you keep hidden","Items in a suitcase","Things with tails","Sports equipment","Crimes"],
["Famous females","Medicines/Drugs","Machines","Hobbies","Things you do in the morning","Things you plug in","Animals","Languages","Things you grab on the way out the door","Junk foods","Things that grow","Things in an arcade"]
];

letters="ABCDEFGHIJKLMNOPRSTW";

function populateQuestions()
{
  sp = document.getElementById("startPrompt");
  sp.style.top = "-40vw";
  cardNum = Math.floor(Math.random() * cards.length);
  letter = letters.charAt(Math.floor(Math.random() * 20));
  ltr = document.getElementById("letterDisp");
  ltr.innerHTML = letter;
  tmr = document.getElementById("fill");
  tmr.style.transition="height linear 180s"
  tmr.style.height = 0;
  lst = document.getElementById("lst");
  for(i = 0; i < lst.children.length; i++)
  {
    lst.children[i].children[0].innerHTML = cards[cardNum][i];
    lst.children[i].children[2].value = "";
  }
  setTimeout(promptStart,180000);
}


function promptStart()
{
  sp = document.getElementById("startPrompt");
  sp.style.top = "20vw";
  tmr = document.getElementById("fill");
  tmr.style.transition = "height 0s";
  tmr.style.height = "100%";
}