cards = [
["A boy's name","Cities","Things that are cold","Things you don't want in the house","Sports teams","Insects","Things in a coffee bar","Things you mix up","TV shows","Things found in the ocean","Kinds of weather","Foods that kids hate"],
["Things that are sticky","Awards/Ceremonies","Cars","Spices/Herbs","Bad Habits","Cosmetics/Toiletries","Celebrities","Things to do with leftover turkey","Reptiles/Amphibians","Fads","Leisure Activities","Things you're allergic to"],
["Articles of clothing","Desserts","Car Parts","Shoes","Athletes","4-letter words","Things you fold","Things in a bedroom","Things you do online","Things at the beach","Things you dream about","Tools"],
["Heroes","Gifts/Presents","Terms of endearment","Kinds of dances","Things that are black","Vehicles","Things found in an arena","Things people gossip about","Weekend activities","Things in a souvenir shop","Items in your purse/wallet","World records"],
["Sandwiches","Things you can do with your feet","World leaders/politicians","School subjects","Excuses for being late","Types of ice cream","Things with balls","Television stars","Things in a park","Countries","Stones/Gems","Musical Instruments"],
["Nicknames","Things in the sky","Things with windows","Universities","Fish","Things you add water to","Things that have spots","Things that smell bad","Things you're afraid of","Terms of measurement","Items in this room","Book titles"],
["Fictional characters","Places to go on a date","Magazines","Famous landmarks","Sweet things","Things you save up to buy","Footwear","Something you keep hidden","Items in a suitcase","Things with tails","Sports equipment","Crimes"],
["Famous females","Medicines/Drugs","Machines","Hobbies","Things you do in the morning","Things you plug in","Animals","Languages","Things you grab on the way out the door","Junk foods","Things that grow","Things in an arcade"],
["Restaurants","Notorious People","Fruits","Weapons","Toys","Household chores","Bodies of water","Authors","Halloween costumes","Funny movies","Things that are round","Things in a pet store"],
["Types of sports","Song titles", "Parts of the body","Spicy foods","Things you shout","Birds","A girl's name","Ways to get here from there","Cooking ingredients","Villains/Monsters","Flowers","Things that weigh less than one pound"],
["Things that need to be cleaned","Famous duos and trios","Things found in a desk","Island hot spots","Things at a hospital","Words associated with money","Items in a vending machine","Movie titles","Games","Things that you wear","Beers","Things at a circus"],
["Vegetables","Things that make you scream","Things you throw away","Careers","Things you celebrate","Cartoon characters","Types of drinks","Musical groups","Science things","Things to do on a rainy day","Trees","Personality traits"],
["Things you can tie in a knot","things that are soft","Things in a sci-fi movie","Words with four different vowels","Things that kids play with","Things at a wedding","Hot places","Things in outer space","Sounds","Things that are cute","Famous Singers","Things at an amusement park"],
["Things that are worn above the waist","Things that are bright","Things that have numbers","Things found in a gym/health club","Chain stores","Ways to say hi and bye","Things in a garden","Things people use to decorate their houses","Items in an office","Things in pairs or sets","Artists","Cruise ship destinations"],
["Things at a zoo","Things smaller than your fist","Things that fly","Things you eat on a diet","Words ending with \"ly\"","Things found under the table","Things in a hotel","Things you can do in five minutes or less","Things with claws","Party things","Reasons to skip school/work","Titles people have"],
["Things that go well with chocolate","Things in a mystery novel","Websites","Loud things","Things you eat with a spoon","Famous sayings","Underground things","Things that are wet","Things in an airport","Words with double letters","Things a baby uses","Things in fairy tales"]
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