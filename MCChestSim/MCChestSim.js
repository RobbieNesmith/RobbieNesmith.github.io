function Item(name, chance, min, max)
{
    this.name = name;
    this.chance = chance;
    this.min = min;
    this.max = max;
    this.qty = 0;
}

function ItemFinal(name, qty)
{
    this.name = name;
    this.qty = qty;
}

function ChestFiller(t) //0 village, 1 dungeon
{
    this.items = [new Item("nothing",0,0,0)];
    switch(t)
    {
    case 0:
        this.items = [new Item("Bread", 0.62, 1, 3), new Item("Red Apple", 0.62, 1, 3), new Item("Iron Ingot", 0.47, 1, 5), new Item("Iron Sword", 0.27, 1, 1), new Item("Iron Pickaxe", 0.27, 1, 1), new Item("Iron Helmet", 0.27, 1, 1), new Item("Iron Chestplate", 0.27, 1, 1), new Item("Iron Leggings", 0.27, 1, 1), new Item("Iron Boots", 0.27, 1, 1), new Item("Oak Sapling", 0.27, 3, 7), new Item("Obsidian", 0.27, 3, 7), new Item("Gold Ingot", 0.27, 1, 3), new Item("Diamond", 0.17, 1, 3)];
        break;
    case 1:
        this.items = [new Item("Saddle", 0.53, 1, 1), new Item("Iron Ingot", 0.53, 1, 4), new Item("Bread", 0.53, 1, 2), new Item("Wheat", 0.53, 1, 4), new Item("Gunpowder", 0.53, 1, 4), new Item("String", 0.53, 1, 4), new Item("Bucket", 0.53, 1, 4), new Item("Cocoa Beans", .53, 1, 3), new Item("Redstone Dust", 0.31, 1, 4), new Item("Music Discs", 0.08, 1, 1), new Item("Golden Apple", 0.007, 1, 1)];
        break;
    }
    this.getRandomItem = getRandomItem;
}

function getRandomItem()
{
    with (this)
    {
        var item;
        num = Math.floor(Math.random() * items.length);
        chance = Math.random();
        qtyMult = Math.random();
        var qty;
        
        if(chance < items[num].chance)
        {
            console.log("------------------------------------")
            console.log("num: " + num + "\nchance: " + chance + "\nqtyMult: " + qtyMult);
            item = items[num]
            qty = Math.floor(qtyMult * (item.max - item.min)) + item.min;
        }
        else
        {
            return getRandomItem();
        }
        return new ItemFinal(items[num].name, qty);
    }
}

function Chest(type) //0 village, 1 dungeon
{
    this.items = [new ItemFinal("nothing",0)];
    var i;
    var pos;
    for(i = 0; i < 27; i++)
    {
        this.items[i] = new ItemFinal("nothing",0);
    }
    
    var c = new ChestFiller(type)
    for(i = 0; i < 8; i++)
    {
        pos = Math.floor(Math.random() * 27);
        this.items[pos] = c.getRandomItem();
    }
    
    this.dispContents = dispContents;
}

function dispContents()
{
    with (this)
    {
        var i;
        var chest = document.getElementById("chest");
        while(chest.hasChildNodes())
        {
            chest.removeChild(chest.lastChild);
        }
        for(i = 0; i < 27; i++)
        {
            if(items[i] instanceof ItemFinal)
            {
                if(!(items[i].name == "nothing"))
                {
                    var it = document.createElement("div");
                    it.className = "item";
                    it.style.left = (24 + (i % 9) * 54 ) + "px";
                    it.style.top = (54 + Math.floor(i / 9) * 54) + "px";
                    switch (items[i].name)
                    {
                    case "Bread":
                        it.style.background = "url('./mcitems.png') 0 0";
                        break;
                    case "Red Apple":
                        it.style.background = "url('./mcitems.png') -48px 0";
                        break;
                    case "Iron Ingot":
                        it.style.background = "url('./mcitems.png') -96px 0";
                        break;
                    case "Iron Sword":
                        it.style.background = "url('./mcitems.png') -144px 0";
                        break;
                    case "Iron Pickaxe":
                        it.style.background = "url('./mcitems.png') -196px 0";
                        break;
                    case "Iron Helmet":
                        it.style.background = "url('./mcitems.png') -240px 0";
                        break;
                    case "Iron Chestplate":
                        it.style.background = "url('./mcitems.png') -288px 0";
                        break;
                    case "Iron Leggings":
                        it.style.background = "url('./mcitems.png') -336px 0";
                        break;
                    case "Iron Boots":
                        it.style.background = "url('./mcitems.png') -384px 0";
                        break;
                    case "Oak Sapling":
                        it.style.background = "url('./mcitems.png') -432px 0";
                        break;
                    case "Obsidian":
                        it.style.background = "url('./mcitems.png') -480px 0";
                        break;
                    case "Gold Ingot":
                        it.style.background = "url('./mcitems.png') -528px 0";
                        break;
                    case "Diamond":
                        it.style.background = "url('./mcitems.png') -576px 0";
                        break;
                    case "Saddle":
                        it.style.background = "url('./mcitems.png') -624px 0";
                        break;
                    case "Wheat":
                        it.style.background = "url('./mcitems.png') -672px 0";
                        break;
                    case "Gunpowder":
                        it.style.background = "url('./mcitems.png') -720px 0";
                        break;
                    case "String":
                        it.style.background = "url('./mcitems.png') -768px 0";
                        break;
                    case "Bucket":
                        it.style.background = "url('./mcitems.png') -816px 0";
                        break;
                    case "Cocoa Beans":
                        it.style.background = "url('./mcitems.png') -864px 0";
                        break;
                    case "Redstone Dust":
                        it.style.background = "url('./mcitems.png') -912px 0";
                        break;
                    case "Music Discs":
                        it.style.background = "url('./mcitems.png') -960px 0";
                        break;
                    case "Golden Apple":
                        it.style.background = "url('./mcitems.png') -1008px 0";
                        break;
                    }
                    var qty = document.createElement('div');
                    qty.className = "qty";
                    qty.innerHTML = items[i].qty;
                    it.appendChild(qty);
                    chest.appendChild(it);
                }
            }
        }
    }
}

function testV()
{
    ch = new Chest(0);
    ch.dispContents();
}

function testD()
{
    ch = new Chest(1);
    ch.dispContents();
}
//24 54