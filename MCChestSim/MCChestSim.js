let id = 0;

function dragItem(event)
{
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event)
{
    const data = event.dataTransfer.getData("text");
    const transferItem = document.getElementById(data);
    let destinationItem;
    if (event.target.className == "qty")
    {
        destinationItem = event.target.parentNode;
    }
    else
    {
        destinationItem = event.target;
    }
    const sameType = destinationItem.style.background == transferItem.style.background;
    const sameItem = destinationItem.id == transferItem.id;
    if (destinationItem.className=="itemSlot" || sameType && !sameItem) {
        event.preventDefault();
    }
}

function dropItem(event)
{
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const transferItem = document.getElementById(data);
    let destinationItem = event.target;
    if (event.target.className == "qty") {
      destinationItem = event.target.parentNode;
    }
    if (destinationItem.className=="itemSlot") {
        destinationItem.appendChild(transferItem);
    } else if (destinationItem.style.background == transferItem.style.background) {
        let transferQty = 1;
        if (transferItem.children.length) {
            transferQty = parseInt(transferItem.children[0].innerText);
        }
        let destinationQty = 1;
        if (destinationItem.children.length) {
            destinationQty = parseInt(destinationItem.children[0].innerText);
        }
        transferItem.parentNode.removeChild(transferItem);
        if (destinationItem.children.length == 0) {
            let qty = document.createElement("div");
            qty.className = "qty";
            destinationItem.appendChild(qty);
        }
        destinationItem.children[0].innerText = transferQty + destinationQty;
    }
}

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
            //console.log("------------------------------------")
            //console.log("num: " + num + "\nchance: " + chance + "\nqtyMult: " + qtyMult);
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

function setupChestGrid()
{
    let chest = document.getElementById("chest");
    
    // chest slots
    
    for (let i = 0; i < 27; i++)
    {
        let itemSlot = document.createElement("div");
        itemSlot.className="itemSlot";
        itemSlot.setAttribute("ondrop", "dropItem(event)");
        itemSlot.setAttribute("ondragover", "dragOver(event)");
        itemSlot.style.left = (24 + (i % 9) * 54 ) + "px";
        itemSlot.style.top = (54 + Math.floor(i / 9) * 54) + "px";
        chest.appendChild(itemSlot);
    }
    
    // inventory slots
    
    for (let i = 0; i < 27; i++)
    {
        let itemSlot = document.createElement("div");
        itemSlot.className="itemSlot";
        itemSlot.setAttribute("ondrop", "dropItem(event)");
        itemSlot.setAttribute("ondragover", "dragOver(event)");
        itemSlot.style.left = (24 + (i % 9) * 54 ) + "px";
        itemSlot.style.top = (255 + Math.floor(i / 9) * 54) + "px";
        chest.appendChild(itemSlot);
    }
    
    // hotbar slots
    
    for (let i = 0; i < 9; i++)
    {
        let itemSlot = document.createElement("div");
        itemSlot.className="itemSlot";
        itemSlot.setAttribute("ondrop", "dropItem(event)");
        itemSlot.setAttribute("ondragover", "dragOver(event)");
        itemSlot.style.left = (24 + i * 54 ) + "px";
        itemSlot.style.top = (429) + "px";
        chest.appendChild(itemSlot);
    }
}

function dispContents()
{
    with (this)
    {
        var i;
        var chest = document.getElementById("chest");
        
        for (let slot = 0; slot < 27; slot++)
        {
            while(chest.children[slot].hasChildNodes())
            {
                chest.children[slot].removeChild(chest.children[slot].lastChild);
            }
        }
        
        //while(chest.hasChildNodes())
        //{
        //    chest.removeChild(chest.lastChild);
        //}
        for(i = 0; i < 27; i++)
        {
            if(items[i] instanceof ItemFinal)
            {
                if(!(items[i].name == "nothing"))
                {
                    var it = document.createElement("div");
                    it.draggable=true;
                    it.setAttribute("ondragstart", "dragItem(event)");
                    it.className = "item";
                    it.id = `item${id}`;
                    id++;
                    // it.style.left = (24 + (i % 9) * 54 ) + "px";
                    // it.style.top = (54 + Math.floor(i / 9) * 54) + "px";
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
                    if(items[i].qty > 1)
                    {
                        var qty = document.createElement('div');
                        qty.className = "qty";
                        qty.innerText = items[i].qty;
                        it.appendChild(qty);
                    }
                    chest.children[i].appendChild(it);
                }
            }
        }
    }
}

function clearContents()
{
    chest = document.getElementById("chest");
    for (let slot = 0; slot < 63; slot++)
    {
        while(chest.children[slot].hasChildNodes())
        {
            chest.children[slot].removeChild(chest.children[slot].lastChild);
        }
    }
    id = 0;
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