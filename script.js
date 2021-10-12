// ================================================================================
// 1. Attribute Automation
// ================================================================================

// Convert attribute scores into modifiers.
function updateModifiers(attributeID) {
    // Get relevant attribute score
    var attributeScore = document.getElementById(attributeID + "Score").value;

    // Identify correct value range.
    if (attributeScore < 4) {
        modValue = -2;
    } else if (3 < attributeScore && attributeScore < 8) {
        modValue = -1;
    } else if (7 < attributeScore && attributeScore < 14) {
        modValue = 0;
    } else if (13 < attributeScore && attributeScore < 18) {
        modValue = 1;
    } else {
        modValue = 2;
    }
    // Update relevant modifier value.
    document.getElementById(attributeID + "Mod").value = modValue;

    updateSaves();
    updateAttrBonus(attributeID);
    updateSkillPool();
    updateMaxEffort();
    updateMaxProcessing();
    updateAC();
}

// Only allow one growth checkbox option to be ticked per row.
function checkGrowthBonus(checkID, bonusVal) {
    if (bonusVal === 1) {
        document.getElementById("growthPlusTwo" + checkID).checked = false;
    } else if (bonusVal === 2) {
        document.getElementById("growthPlusOne" + checkID).checked = false;
    }
    addGrowthAttrBonus();
}

// Adds a growth bonus to an attribute during character creation.
function addGrowthAttrBonus() {
    $(".growthBonus").attr("data-growth",0);
    for (var checkID = 1; checkID < 4; checkID++){
    var match = document.getElementById("growthStat" + checkID).value;
    
    if (match != "empty") {
        
        if (
            document.getElementById("growthPlusTwo" + checkID).checked === true
        ) {
            $("#" + match + "Score").attr("data-growth",parseInt($("#" + match + "Score").attr("data-growth")) + 2);
        } else if (
            document.getElementById("growthPlusOne" + checkID).checked === true
        ) {
            $("#" + match + "Score").attr("data-growth",parseInt($("#" + match + "Score").attr("data-growth")) + 1);
        }
       
    }
    
    }
    
    updateBaseStats();
    
}

// Hide/show growth/random skill/attribute fields during character creation.
function isGrowth(id, classID) {
    if (document.getElementById(id).checked === true) {
        $(classID).show();
    } else {
        document.getElementById("growthStat1").value = "empty";
        document.getElementById("growthStat2").value = "empty";
        document.getElementById("growthStat3").value = "empty";
        document.getElementById("initSkill3").value = "empty";
        document.getElementById("growthStat1").onchange();
        document.getElementById("growthStat2").onchange();
        document.getElementById("growthStat3").onchange();
        $(classID).hide();
        document.getElementById("initSkill3").onchange();
    }
}

// Update and store the bonus value to the base attribute score.
function updateAttrBonus(attributeID) {
    var attributeScore = parseInt(
        document.getElementById(attributeID + "Score").value
    );
    var attrBaseValue = parseInt(
        document.getElementById(attributeID + "Base").value
    );
    var attrGrowthValue = parseInt(
        document
            .getElementById(attributeID + "Score")
            .getAttribute("data-growth")
    );
    document
        .getElementById(attributeID + "Score")
        .setAttribute(
            "data-bonus",
            attributeScore - attrGrowthValue - attrBaseValue
        );
}

// Update Save values.
function updateSaves() {
    // Get player level and attribute modifiers.
    var playerLevel = parseInt(document.getElementById("playerLevel").value);
    var strMod = parseInt(document.getElementById("strMod").value);
    var dexMod = parseInt(document.getElementById("dexMod").value);
    var conMod = parseInt(document.getElementById("conMod").value);
    var intMod = parseInt(document.getElementById("intMod").value);
    var wisMod = parseInt(document.getElementById("wisMod").value);
    var chaMod = parseInt(document.getElementById("chaMod").value);
    // Calculate physical save.
    document.getElementById("physicalSave").value =
        16 - strMod - playerLevel - conMod;
    // Calculate evasion save.
    document.getElementById("evasionSave").value =
        16 - dexMod - playerLevel - intMod;
    // Calculate mental save.
    document.getElementById("mentalSave").value =
        16 - chaMod - playerLevel - wisMod;
}

// Updates base attribute scores during character creation.
function updateBaseStats() {
    
    var attrList = ["str","dex","con","int","wis","cha"];
    for (var i = 0; i<attrList.length; i++){
    var attributeBase = parseInt(
        document.getElementById(attrList[i] + "Base").value
    ); // Get base value.
    var currentAttribute = document.getElementById(attrList[i] + "Score"); // Get current attribute field.
    var growthBonus = parseInt(currentAttribute.getAttribute("data-growth"));
    currentAttribute.value =
        attributeBase +
        growthBonus +
        parseInt(currentAttribute.getAttribute("data-bonus"));
    currentAttribute.setAttribute("value", currentAttribute.value); // Update attribute score.
    currentAttribute.setAttribute("min", attributeBase + growthBonus); // Attribute cannot be decremented below base value.
    currentAttribute.setAttribute("max", attributeBase + growthBonus + 5); // Attribute cannot be incremented above basevalue + 5.
    updateModifiers(attrList[i]); // Call update to associated modifier.
}
}

// ================================================================================
// 2.1 Inventory Automation
// ================================================================================

// Link function to info button located inside newly created table row.
function activateRow(){
    // Assign function to element with specified class.
    $(".interactInfo").click(function () {
var description = this.getAttribute("data-desc");
        if (description !== ""){
                $(".message").text(description);
                $(".messageHeader").text(this.getAttribute("data-name") + ":");
                $(".customAlert").css("animation", "fadeIn 0.3s linear");
                $(".customAlert").css("display", "inline");
        }
    });
    
   

}
// Global variables
var rowNum = 1; // #No. of item table rows.

// Generate a new item table row.
function addItemRow(){
     var newRow = $("<tr id='itemRow"+rowNum+"' value ='"+rowNum+"'>");
    var newChild =  $("<tr id='itemChildRow"+rowNum+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Skill Info" data-name="" data-desc="" id="itemInfo'+rowNum+'"></i><input type="text" id="itemName' + rowNum + '" list="itemList' + rowNum + '" data-idNum="'+ rowNum + '" onchange="addOneItem('+rowNum+'); populateItem('+rowNum+'); calculateEncumberance();"/><datalist id="itemList' + rowNum + '"></datalist></td>';
    cols += '<td><textarea rows="1" style="height:1em;" class="notes" type="text" id="itemNotes' + rowNum + '" /></td>';
        cols += '<td><input value="-" id="minusOne'+rowNum+'" readonly class="button" onclick="decrement(itemQuantity'+rowNum+'.id)"><input type="number" value="0" min="0" onchange="populateItem('+rowNum+'); calculateEncumberance();" class="storage" id="itemQuantity' + rowNum + '"/><input value="+" readonly class="button" onclick="increment(itemQuantity'+rowNum+'.id)"></td>';
        cols += '<td><input type="string"  id="itemPrice' + rowNum + '"/></td>';
        cols += '<td><input type="number" id="itemWeight' + rowNum + '" onchange="calculateEncumberance();" value="0" /><input type="checkbox" onchange="calculateEncumberance();" id="isBulk' + rowNum + '" value="false" title="Bulk Item?"></td>';
        cols += '<td><select id="itemStorage' + rowNum + '" onchange="calculateEncumberance(); storageColour(itemStorage'+rowNum+');" class="storage"> <option>-</option> <option>Readied</option> <option>Backpack</option><option>Grafted</option><option>Storage</option></select></td>';
        cols += '<td><input type="image" src="https://i.ibb.co/MNf31S8/imageedit-31-2623129288.png" id="removeItem'+rowNum+'" data-rownum="'+rowNum+'" class="ibtnDel" onclick="removeItemRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#equipmentTable").append(newRow);
         selectOptionTable(equipmentList,"#itemList" + rowNum);
        activateRow();
    $('textarea').on('keyup keypress click', function() { 
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    resizeTextarea();
    $("#removeItem"+rowNum).on("click", function(e) {
     e.stopImmediatePropagation();
});
    

        document.getElementById("equipmentTable").setAttribute("data-counter",rowNum);
        $("[name='counterItem']").val(rowNum);
    
    rowNum++;
}

function resizeTextarea(){
    $('textarea').each(function(){
        $(this).height(0);
        $(this).height($(this)[0].scrollHeight );
    });
}
// Shift rows up in queue from deleted row by overwriting each consecutive row.
function overwriteRows(deleteRowIndex,id,targetRow,targetRemove,targetStorage,targetRowCount){

     //Cycle through all rows starting from mark (exceptt last row).
        for(var rowIndex = parseInt(deleteRowIndex); rowIndex < targetRowCount-1; rowIndex++){
            var oldRow = document.getElementById(targetRow+rowIndex); // Get table row element to overwrite.
            var oldData = oldRow.childNodes; // Get all data elements of old row.
            var nextRow = document.getElementById(targetRow+parseInt(rowIndex+1));
            var nextData = nextRow.childNodes;
            oldData[0].childNodes[0].setAttribute('data-name',nextData[0].childNodes[0].getAttribute('data-name'));
            oldData[0].childNodes[0].setAttribute('data-info',nextData[0].childNodes[0].getAttribute('data-info'));
            // Cycle through each <td> element.
            for(var i = 0; i < oldData.length; i++){
                var oldElements = oldData[i].childNodes; // Get all child elements of prev <td> element.
                var nextElements = nextData[i].childNodes; // Get all child elements of next <td> element.
                // Cycle through each <td> child element.
                for(var j = 0; j < oldElements.length; j++){
                    // Check if value is defined
                    
                    if (oldElements[j].type == 'checkbox') {
                       
                        if ($("#"+nextElements[j].id).prop('checked')){
                        oldElements[j].checked = true;
                        } else {
                            oldElements[j].checked = false;
                        }
                    } else if ((oldElements[j].value != undefined) && (oldElements[j].id != targetRemove+deleteRowIndex)){
                                      oldElements[j].innerHTML = nextElements[j].innerHTML;
                         oldElements[j].value = nextElements[j].value;
          
                        
                    }
                }
            }
            storageColour(targetStorage+rowIndex);
        }
}

// Remove one item table row.
function removeItemRow(deleteButtonID,id){
    if(rowNum > 1){
        var deleteRowIndex = deleteButtonID; // get row number marked for deletion/overwrite.
        overwriteRows(deleteRowIndex,id,"itemRow","removeItem","#itemStorage",rowNum);
       
        
    document.getElementById("itemRow"+parseInt(rowNum-1)).remove();
    $("[name='counterItem']").val(parseInt(rowNum-2));
    calculateEncumberance();
        if (rowNum > 2){

    }
    rowNum--;
    }
    resizeTextarea();
}

// Reset item quantity to '1' when a new item is selected in Equipment List.
function addOneItem(id){
    document.getElementById("itemQuantity" + id).value = 1;
}

// Unkown Purpose?
function clearSelection(){
 if (window.getSelection) {window.getSelection().removeAllRanges();}
 else if (document.selection) {document.selection.empty();}
}

// Update readied and stowed item limit
function updateMaxCarry(strVal){
    document.getElementById("maxReady").value = parseInt(Math.floor(strVal/2));
    document.getElementById("maxGrafted").value = parseInt(Math.floor(strVal/2));
    document.getElementById("maxStowed").value = parseInt(strVal);
}

function calculateWeight(counterName, itemType){

    var readyVal = 0;
   var stowedVal = 0;
    var graftedVal = 0;
    var quantity = 0;
    var weight = 0;
    var location = "";
    for(var types = counterName.length-1; types > -1; types--){

    var rows = parseInt($("[name='counter"+counterName[types]+"']").val());
    for(var i = rows; i > -1; i--){
        if (document.getElementById(itemType[types]+"Name" + i) !== null){

            quantity = parseInt(document.getElementById(itemType[types]+"Quantity" + i).value);
            weight = parseInt(document.getElementById(itemType[types]+"Weight" + i).value);
            location = document.getElementById(itemType[types]+"Storage" + i).value;
           if ((itemType[types] === "item") && (document.getElementById("isBulk" + i).checked === true)){
               quantity = Math.ceil(quantity/3);
           }
            if (location === "Readied"){
                readyVal += weight*quantity;
 
            }
            else if (location === "Backpack"){
                stowedVal += weight*quantity;
            }
            else if (location === "Grafted"){
                graftedVal += weight*quantity;
            }   
        } 
        
    }
    }
        return [readyVal, stowedVal, graftedVal];
}

// Calculate total encumberane of readied and stowed equipment.
function calculateEncumberance(){
    var weight = calculateWeight(["Item","Drone","Weapon","Melee","Armour"],["item","drone","weapon","melee","armour"]);
    
    
    document.getElementById("currentReady").value = weight[0];
     document.getElementById("currentStowed").value = weight[1];
    document.getElementById("currentGrafted").value = weight[2];
}

// Populate Equipment List item value fields and description.
function populateItem(id){
    var opGroup = Object.getOwnPropertyNames(equipmentList[0]);
    var itemField = document.getElementById("itemName" + id);
    var itemDesc = document.getElementById("itemInfo" + id);

    var match = itemField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(equipmentList[0][groupIndex], match);
        if (index > -1) {
            var currentItem = equipmentList[0][opGroup[i]][index];
            itemDesc.setAttribute('data-name', itemField.value); // Store item name
            itemDesc.setAttribute('data-desc', currentItem.desc); // Store item description
            document.getElementById("itemPrice" + id).value = currentItem.cost;
            document.getElementById("itemWeight" +  id).value = currentItem.enc;
            return;
        }
    }
}

// Change
function storageColour(idNum){

var color = $("option:selected",idNum).text().trim().toLowerCase() == "readied" ? "#00660055" : $("option:selected",idNum).text().trim().toLowerCase() == "backpack" ? "#8B000055" :
$("option:selected",idNum).text().trim().toLowerCase() == "grafted" ? "#0437F255" :
$("option:selected",idNum).text().trim().toLowerCase() == "storage" ? "#60606055" : "transparent";
$(idNum).closest("tr").css("background-color",color,0.5);
    
}

// ================================================================================
// 2.2 Weapon Automation
// ================================================================================

var weaponRowNum = 1;

function addWeaponRow(){
     var newRow = $("<tr id='weaponRow"+weaponRowNum+"' value ='"+weaponRowNum+"'>");
    var newChild =  $("<tr id='weaponChildRow"+weaponRowNum+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Skill Info" data-name="" data-desc="" id="weaponInfo'+weaponRowNum+'"></i><input type="text" id="weaponName' + weaponRowNum + '" list="weaponList' + weaponRowNum + '" data-idNum="'+ weaponRowNum + '" onchange="addOneWeapon('+weaponRowNum+'); populateWeapon('+weaponRowNum+'); calculateEncumberance();"/><datalist id="weaponList' + weaponRowNum + '"></datalist></td>';
    cols += '<td><textarea rows="1" style="height:1em;" class="notes" type="string" id="weaponNotes' + weaponRowNum + '" /></td>';
    cols += '<td><input type="string" value="" id="weaponDamage'+weaponRowNum+'"></td>';
    cols += '<td><input type="number" value="0" id="weaponShortRange'+weaponRowNum+'">/<input type="number" value="0" id="weaponLongRange'+weaponRowNum+'"></td>';
    cols += '<td><input type="number" value="" id="weaponAmmoCurrent'+weaponRowNum+'">/<input type="number" value="0" id="weaponAmmoMax'+weaponRowNum+'"></td>';
        cols += '<td><input value="-" id="minusOne'+weaponRowNum+'" readonly class="button" onclick="decrement(weaponQuantity'+weaponRowNum+'.id)"><input type="number" value="0" min="0" onchange="populateWeapon('+weaponRowNum+'); calculateEncumberance();" class="storage" id="weaponQuantity' + weaponRowNum + '"/><input value="+" readonly class="button" onclick="increment(weaponQuantity'+weaponRowNum+'.id)"></td>';
        cols += '<td><input type="string"  id="weaponPrice' + weaponRowNum + '"/></td>';
        cols += '<td><input type="number" id="weaponWeight' + weaponRowNum + '" onchange="calculateEncumberance();" value="0" /></td>';
        cols += '<td><select id="weaponStorage' + weaponRowNum + '" onchange="calculateEncumberance(); storageColour(weaponStorage'+weaponRowNum+')" class="storage"> <option>-</option> <option>Readied</option> <option>Backpack</option><option>Grafted</option><option>Storage</option></select></td>';
        cols += '<td><input type="image" src="https://i.ibb.co/MNf31S8/imageedit-31-2623129288.png" id="removeWeapon'+weaponRowNum+'" class="ibtnDel" data-rownum="'+weaponRowNum+'" onclick="removeWeaponRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#weaponTable").append(newRow);
    
         selectOptionTable(weaponList,"#weaponList" + weaponRowNum);
        activateRow();
        document.getElementById("weaponTable").setAttribute("data-counter",weaponRowNum);
        $("[name='counterWeapon']").val(weaponRowNum);
        

    weaponRowNum++;

    $('textarea').on('keyup keypress click', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    resizeTextarea();
    
}

function removeWeaponRow(deleteButtonID,id){
    if(weaponRowNum > 1){
        overwriteRows(deleteButtonID,id,"weaponRow","removeWeapon","#weaponStorage",weaponRowNum);
    document.getElementById("weaponRow"+parseInt(weaponRowNum-1)).remove();
    $("[name='counterWeapon']").val(parseInt(weaponRowNum-2));
    calculateEncumberance();

    weaponRowNum--;
    }
    resizeTextarea();
}

// Reset weapon quantity to '1' when a new weapon is selected in weapon List.
function addOneWeapon(id){
    document.getElementById("weaponQuantity" + id).value = 1;
}

// Populate weapon List weapon value fields and description.
function populateWeapon(id){
    var opGroup = Object.getOwnPropertyNames(weaponList[0]);
    var weaponField = document.getElementById("weaponName" + id);
    var weaponDesc = document.getElementById("weaponInfo" + id);

    var match = weaponField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(weaponList[0][groupIndex], match);
        if (index > -1) {
            var currentweapon = weaponList[0][opGroup[i]][index];
            weaponDesc.setAttribute('data-name', weaponField.value); // Store weapon name.
            weaponDesc.setAttribute('data-desc', currentweapon.desc); // Store weapon description.
            document.getElementById("weaponDamage" + id).value = currentweapon.damage;
            document.getElementById("weaponShortRange" + id).value = currentweapon.shortRange;
            document.getElementById("weaponLongRange" + id).value = currentweapon.longRange;
            document.getElementById("weaponAmmoCurrent" + id).value = currentweapon.ammo;
            document.getElementById("weaponAmmoMax" + id).value = currentweapon.ammo;
            document.getElementById("weaponPrice" + id).value = currentweapon.cost; // Store weapon cost.
            document.getElementById("weaponWeight" +  id).value = currentweapon.enc; // Store weapon weight.
            return;
        }
    }
}

//================================================================================
// 2.2.1 Melee Automation
// ================================================================================

var meleeRowNum = 1;

function addMeleeRow(){
     var newRow = $("<tr id='meleeRow"+meleeRowNum+"' value ='"+meleeRowNum+"'>");
    var newChild =  $("<tr id='meleeChildRow"+meleeRowNum+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Skill Info" data-name="" data-desc="" id="meleeInfo'+meleeRowNum+'"></i><input type="text" id="meleeName' + meleeRowNum + '" list="meleeList' + meleeRowNum + '" data-idNum="'+ meleeRowNum + '" onchange="addOneMelee('+meleeRowNum+'); populateMelee('+meleeRowNum+'); calculateEncumberance();"/><datalist id="meleeList' + meleeRowNum + '"></datalist></td>';
    cols += '<td><textarea rows="1" style="height:1em;" class="notes" type="string" id="meleeNotes' + meleeRowNum + '" /></td>';
    cols += '<td><input type="string" value="" id="meleeDamage'+meleeRowNum+'"></td>';
    cols += '<td><input type="string" value="0" id="meleeShock'+meleeRowNum+'"></td>';
        cols += '<td><input value="-" id="minusOne'+meleeRowNum+'" readonly class="button" onclick="decrement(meleeQuantity'+meleeRowNum+'.id)"><input type="number" value="0" min="0" onchange="populateMelee('+meleeRowNum+'); calculateEncumberance();" class="storage" id="meleeQuantity' + meleeRowNum + '"/><input value="+" readonly class="button" onclick="increment(meleeQuantity'+meleeRowNum+'.id)"></td>';
        cols += '<td><input type="string"  id="meleePrice' + meleeRowNum + '"/></td>';
        cols += '<td><input type="number" id="meleeWeight' + meleeRowNum + '" onchange="calculateEncumberance();" value="0" /></td>';
        cols += '<td><select id="meleeStorage' + meleeRowNum + '" onchange="calculateEncumberance(); storageColour(meleeStorage'+meleeRowNum+')" class="storage"> <option>-</option> <option>Readied</option> <option>Backpack</option><option>Grafted</option><option>Storage</option></select></td>';
        cols += '<td><input type="image" src="https://i.ibb.co/MNf31S8/imageedit-31-2623129288.png" id="removeMelee'+meleeRowNum+'" class="ibtnDel" data-rownum="'+meleeRowNum+'" onclick="removeMeleeRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#meleeTable").append(newRow);
    
         selectOptionTable(meleeList,"#meleeList" + meleeRowNum);
        activateRow();
        document.getElementById("meleeTable").setAttribute("data-counter",meleeRowNum);
        $("[name='counterMelee']").val(meleeRowNum);
        

    meleeRowNum++;

    $('textarea').on('keyup keypress click', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    resizeTextarea();
}

function removeMeleeRow(deleteButtonID,id){
    if(meleeRowNum > 1){
        overwriteRows(deleteButtonID,id,"meleeRow","removeMelee","#meleeStorage",meleeRowNum);
    document.getElementById("meleeRow"+parseInt(meleeRowNum-1)).remove();
    $("[name='counterMelee']").val(parseInt(meleeRowNum-2));
    calculateEncumberance();
    meleeRowNum--;
    }
    resizeTextarea();
}

// Reset melee quantity to '1' when a new melee is selected in melee List.
function addOneMelee(id){
    document.getElementById("meleeQuantity" + id).value = 1;
}

// Populate melee List melee value fields and description.
function populateMelee(id){
    var opGroup = Object.getOwnPropertyNames(meleeList[0]);
    var meleeField = document.getElementById("meleeName" + id);
    var meleeDesc = document.getElementById("meleeInfo" + id);

    var match = meleeField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(meleeList[0][groupIndex], match);
        if (index > -1) {
            var currentmelee = meleeList[0][opGroup[i]][index];

            meleeDesc.setAttribute('data-name', meleeField.value); // Store melee name.
            meleeDesc.setAttribute('data-desc', currentmelee.desc); // Store melee description.
            document.getElementById("meleeDamage" + id).value = currentmelee.damage;
            
            document.getElementById("meleeShock" + id).value = currentmelee.shock;
            
            document.getElementById("meleePrice" + id).value = currentmelee.cost; // Store melee cost.
            document.getElementById("meleeWeight" +  id).value = currentmelee.enc; // Store melee weight.
            return;
        }
    }
}



// ================================================================================
// 2.3 Armour Automation
// ================================================================================

var armourRowNum = 1;

function addArmourRow(){
     var newRow = $("<tr id='armourRow"+armourRowNum+"' value ='"+armourRowNum+"'>");
    var newChild =  $("<tr id='armourChildRow"+armourRowNum+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Skill Info" data-name="" data-desc="" id="armourInfo'+armourRowNum+'"></i><input type="text" id="armourName' + armourRowNum + '" list="armourList' + armourRowNum + '" data-idNum="'+ armourRowNum + '" onchange="addOneArmour('+armourRowNum+'); populateArmour('+armourRowNum+'); calculateEncumberance(); updateAC();"/><datalist id="armourList' + armourRowNum + '"></datalist></td>';
    cols += '<td><textarea rows="1" style="height:1em;" class="notes" type="text" id="armourNotes' + armourRowNum + '" /></td>';
    cols += '<td><input type="number" value="0" onchange="calculateEncumberance(); updateAC();" id="AC' + armourRowNum +'"></td>';
    cols += '<td><input type="number" value="0" onchange="calculateEncumberance(); updateAC();" id="shieldBonus' + armourRowNum +'"></td>';
        cols += '<td><input value="-" id="minusOne'+armourRowNum+'" readonly class="button" onclick="decrement(armourQuantity'+armourRowNum+'.id)"><input type="number" value="0" min="0" onchange="populateArmour('+armourRowNum+'); calculateEncumberance();" class="storage" id="armourQuantity' + armourRowNum + '"/><input value="+" readonly class="button" onclick="increment(armourQuantity'+armourRowNum+'.id)"></td>';
        cols += '<td><input type="string"  id="armourPrice' + armourRowNum + '"/></td>';
        cols += '<td><input type="number" id="armourWeight' + armourRowNum + '" onchange="calculateEncumberance();" value="0" /></td>';
        cols += '<td><select id="armourStorage' + armourRowNum + '" onchange="calculateEncumberance(); updateAC(); storageColour(armourStorage'+armourRowNum+')" class="storage"> <option>-</option> <option>Readied</option> <option>Backpack</option><option>Grafted</option><option>Storage</option></select></td>';
        cols += '<td><input type="image" src="https://i.ibb.co/MNf31S8/imageedit-31-2623129288.png" id="removeArmour'+armourRowNum+'" class="ibtnDel" data-rownum="'+armourRowNum+'" onclick="removeArmourRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#armourTable").append(newRow);
    
         selectOptionTable(armourList,"#armourList" + armourRowNum);
        activateRow();
        document.getElementById("armourTable").setAttribute("data-counter",armourRowNum);
        $("[name='counterArmour']").val(armourRowNum);
        

    armourRowNum++;

     $('textarea').on('keyup keypress click', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    resizeTextarea();
}

function removeArmourRow(deleteButtonID,id){
    if(armourRowNum > 1){
         overwriteRows(deleteButtonID,id,"armourRow","removeArmour","#armourStorage",armourRowNum);
    document.getElementById("armourRow"+parseInt(armourRowNum-1)).remove();
    $("[name='counterArmour']").val(parseInt(armourRowNum-2));
    calculateEncumberance();
    armourRowNum--;
    }
    resizeTextarea();
}

// Reset armour quantity to '1' when a new armour is selected in armour List.
function addOneArmour(id){
    document.getElementById("armourQuantity" + id).value = 1;
}

// Populate armour List armour value fields and description.
function populateArmour(id){
    var opGroup = Object.getOwnPropertyNames(armourList[0]);
    var armourField = document.getElementById("armourName" + id);
    var armourDesc = document.getElementById("armourInfo" + id);

    var match = armourField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(armourList[0][groupIndex], match);
        if (index > -1) {
            var currentArmour = armourList[0][opGroup[i]][index];
            armourDesc.setAttribute('data-name', armourField.value); // Store armour name
            armourDesc.setAttribute('data-desc', currentArmour.desc); // Store armour description
            document.getElementById("armourPrice" + id).value = currentArmour.cost;
            document.getElementById("armourWeight" +  id).value = currentArmour.enc;
            document.getElementById("AC" + id).value = currentArmour.ac;
            document.getElementById("shieldBonus" + id).value = currentArmour.shield;
            return;
        }
    }
}
    


function updateAC(){
    var armourRows = parseInt($("[name='counterArmour']").val());
    var shellRows = parseInt($("[name='counterShell']").val());
    var location = 0;
    var ac = 10;
    var minAC = 0;
    var shieldBonus = 0;
    
    for (i = armourRows; i > -1; i--){
        if (document.getElementById("armourName" + i) !== null){
            location = document.getElementById("armourStorage" + i).value;
           
            if (location === "Readied" || location === "Grafted"){
                if (parseInt(document.getElementById("shieldBonus" + i).value) > 0){
                 minAC = Math.max(minAC,parseInt(document.getElementById("AC" + i).value));
                 shieldBonus = Math.max(shieldBonus,parseInt(document.getElementById("shieldBonus" + i).value));       
                }
                else{
                    ac = Math.max(ac,parseInt(document.getElementById("AC" + i).value));
                }
            }
  
        }
    }
    
    for (i = shellRows; i > -1; i--){
        if (document.getElementById("shellName" + i) !== null){
            location = document.getElementById("shellStorage" + i).value;
           
            if (location === "Readied"){
                    ac = Math.max(ac,parseInt(document.getElementById("shellAC" + i).value));
            }
   
        }
    }
    
    if (ac < minAC){
        $("#ACBonus").val(minAC + parseInt(document.getElementById("dexMod").value));
    }
    else{
        $("#ACBonus").val(ac + shieldBonus + parseInt(document.getElementById("dexMod").value));
    }
}

// ================================================================================
// 2.4 Drone Inventory Automation
// ================================================================================

var droneRowNum = 1;

function addDroneRow(){
     var newRow = $("<tr id='droneRow"+droneRowNum+"' value ='"+droneRowNum+"'>");
    var newChild =  $("<tr id='droneChildRow"+droneRowNum+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Skill Info" data-name="" data-desc="" id="droneInfo'+droneRowNum+'"></i><input type="text" id="droneName' + droneRowNum + '" list="droneList' + droneRowNum + '" data-idNum="'+ droneRowNum + '" onchange="addOneDrone('+droneRowNum+'); populateDrone('+droneRowNum+'); calculateEncumberance();"/><datalist id="droneList' + droneRowNum + '"></datalist></td>';
    cols += '<td><textarea rows="1" style="height:1em;" class="notes" type="string" id="droneNotes' + droneRowNum + '" /></td>';
    
    cols += '<td><input type="string"  id="dronePrice' + droneRowNum + '"/></td>';
    cols += '<td><input type="number"  id="droneFittings' + droneRowNum + '"/></td>';
    cols += '<td><input type="number"  id="droneAC' + droneRowNum + '"/></td>';
    cols += '<td><input value="-" id="minusOne'+droneRowNum+'" readonly class="button" onclick="decrement(droneQuantity'+droneRowNum+'.id)"><input type="number" value="0" min="0" onchange="populateDrone('+droneRowNum+'); calculateEncumberance();" class="storage" id="droneQuantity' + droneRowNum + '"/><input value="+" readonly class="button" onclick="increment(droneQuantity'+droneRowNum+'.id)"></td>';
        
        cols += '<td><input type="number" id="droneWeight' + droneRowNum + '" onchange="calculateEncumberance();" value="0" /></td>';
    cols += '<td><input type="number"  id="droneHP' + droneRowNum + '"/></td>';
    cols += '<td><input type="string"  id="droneRange' + droneRowNum + '"/></td>';
    
        
        cols += '<td><select id="droneStorage' + droneRowNum + '" onchange="calculateEncumberance(); storageColour(droneStorage'+droneRowNum+')" class="storage"> <option>-</option> <option>Readied</option> <option>Backpack</option><option>Storage</option></select></td>';
        cols += '<td><input type="image" src="https://i.ibb.co/MNf31S8/imageedit-31-2623129288.png" id="removeDrone'+droneRowNum+'" class="ibtnDel" data-rownum="'+droneRowNum+'" onclick="removeDroneRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#droneTable").append(newRow);
    
         selectOptionTable(droneList,"#droneList" + droneRowNum);
        activateRow();
        document.getElementById("droneTable").setAttribute("data-counter",droneRowNum);
        $("[name='counterDrone']").val(droneRowNum);
        

    droneRowNum++;

    $('textarea').on('keyup keypress click', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    resizeTextarea();
}

function removeDroneRow(deleteButtonID,id){
    if(droneRowNum > 1){
        overwriteRows(deleteButtonID,id,"droneRow","removeDrone","#droneStorage",droneRowNum);
    document.getElementById("droneRow"+parseInt(droneRowNum-1)).remove();
    $("[name='counterDrone']").val(parseInt(droneRowNum-2));
    calculateEncumberance();
    droneRowNum--;
    }
    resizeTextarea();
}

// Reset drone quantity to '1' when a new drone is selected in drone List.
function addOneDrone(id){
    document.getElementById("droneQuantity" + id).value = 1;
}


// Populate drone List drone value fields and description.
function populateDrone(id){
    var opGroup = Object.getOwnPropertyNames(droneList[0]);
    var droneField = document.getElementById("droneName" + id);
    var droneDesc = document.getElementById("droneInfo" + id);

    var match = droneField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(droneList[0][groupIndex], match);
        if (index > -1) {
            var currentDrone = droneList[0][opGroup[i]][index];
            droneDesc.setAttribute('data-name', droneField.value); // Store drone name.
            droneDesc.setAttribute('data-desc', currentDrone.desc); // Store drone description.
            document.getElementById("droneFittings" + id).value = currentDrone.fittings;
            document.getElementById("droneRange" + id).value = currentDrone.range;
            document.getElementById("droneAC" + id).value = currentDrone.ac;
            document.getElementById("droneHP" + id).value = currentDrone.hp;
            document.getElementById("dronePrice" + id).value = currentDrone.cost; // Store drone cost.
            document.getElementById("droneWeight" +  id).value = currentDrone.enc; // Store drone weight.
            return;
        }
    }
}

// ================================================================================
// 3.1 Psi Automation
// ================================================================================

var rowNumPsi = 1;

// Remove Psi Technique Row
function removePsiRow(deleteButtonID,id){
    if(rowNumPsi > 1){
        overwriteRows(deleteButtonID,id,"psiRow","removePsi","#psiStorage",rowNumPsi);
    document.getElementById("psiRow"+parseInt(rowNumPsi-1)).remove();
    $("[name='counterPsi']").val(parseInt(rowNumPsi-2));
    calculateEncumberance();

    rowNumPsi--;
    }
    resizeTextarea();
}



// Populate Psi Abilities technique value fields and description.
function populatePsi(id){
    var opGroup = Object.getOwnPropertyNames(psiTechniqueList[0]);
    var psiField = document.getElementById("psiName" + id);
    var psiAction = document.getElementById("psiAction" + id);
    var psiEffort = document.getElementById("psiCommit" + id);
    var psiInfo = document.getElementById("psiInfo" + id);

    var match = psiField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(psiTechniqueList[0][groupIndex], match);
        if (index > -1) {
            var currentPsi = psiTechniqueList[0][opGroup[i]][index];
            psiInfo.setAttribute('data-name', psiField.value); // Store armour name
            psiInfo.setAttribute('data-desc', currentPsi.desc); // Store armour description
            psiEffort.value = currentPsi.effort;
            psiAction.value = currentPsi.action;
            return;
        }
    }
}

// Adjust Maximum Effort Pool
function updateMaxEffort(){
    var maxEffort = Math.max(parseInt($("#metapsiScore").val()),0);
    maxEffort = Math.max(maxEffort,Math.max(parseInt($("#precogScore").val()),0));
    maxEffort = Math.max(maxEffort,Math.max(parseInt($("#telekinesisScore").val()),0));
    maxEffort = Math.max(maxEffort,Math.max(parseInt($("#telepathScore").val()),0));
    maxEffort = Math.max(maxEffort,Math.max(parseInt($("#teleportScore").val()),0));
    maxEffort = Math.max(maxEffort + 1 + Math.max($("#wisMod").val(),$("#conMod").val()),1);
    if (parseInt($("#maxEP").attr("data-isFocus")) === 0){
    $("#maxEP").val(maxEffort);
    }
    else{
         $("#maxEP").val($("fociLevel"+$("#maxEP").attr("data-isFocus").val()));
    }
}

function addPsiRow(){
     var newRow = $("<tr id='psiRow"+rowNumPsi+"' value ='"+rowNumPsi+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Technique Info" data-name="" data-desc="" id="psiInfo'+rowNumPsi+'"></i><input type="text" id="psiName' + rowNumPsi + '" list="psiList' + rowNumPsi + '" data-idNum="'+ rowNumPsi + '" onchange="populatePsi('+rowNumPsi+')"/><datalist id="psiList' + rowNumPsi + '"></datalist></td>';
        cols += '<td><input type="number" value="-" min="0" onchange="populatePsi('+rowNumPsi+'); calculateEncumberance();" id="psiCommit' + rowNumPsi + '" readonly/></td>';
    cols += '<td><input type="string" value="-" min="0" onchange="populatePsi('+rowNumPsi+'); calculateEncumberance();" id="psiAction' + rowNumPsi + '" class="noWrite" readonly/></td>';
        
        cols += '<td><input type="image" src="https://i.ibb.co/MNf31S8/imageedit-31-2623129288.png" id="removePsi'+rowNumPsi+'" class="ibtnDel" data-rownum="'+rowNumPsi+'" onclick="removePsiRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#psiTable").append(newRow);
        
         selectOptionTable(psiTechniqueList,"#psiList" + rowNumPsi);
        activateRow();
        document.getElementById("psiTable").setAttribute("data-counter",rowNumPsi);
        $("[name='counterPsi']").val(rowNumPsi);

    rowNumPsi++;
}

// ================================================================================
// 3.2 AI Routine Automation
// ================================================================================

var rowNumRoutine = 1;

// Remove Routine Technique Row
function removeRoutineRow(deleteButtonID,id){
    if(rowNumRoutine > 1){
        overwriteRows(deleteButtonID,id,"routineRow","removeRoutine","",rowNumRoutine);
    document.getElementById("routineRow"+parseInt(rowNumRoutine-1)).remove();
    $("[name='counterRoutine']").val(parseInt(rowNumRoutine-2));
    calculateEncumberance();

    rowNumRoutine--;
    }
    resizeTextarea();
}

// List of all psychic techniques
var routineCoreTechniques = [
    {
        title: "Query Data",
        desc: "- Commit Processing for the scene as a Main Action\n- Ask one question about a database you have access to and get a reply as if you had virtually unlimited time to search and examine the database’s contents."
    },
    {
        title: "Split Focus",
        desc: "- Commit Processing as an On Turn to count as multiple people for operational purposes as long as the Processing remains committed.\n- At the first level, you are equivalent to three people, tripling with each successive character level.\n- If additional Processing is Committed, this number can be boosted: x10 for the second point, x100 for the third, and so forth.\n- If this Routine is made free by an artefact or ability, only the base cost is eliminated.\n- This functionality is meant to mimic the AI’s control of a ship, a facility, a drone army, or some other general role rather than simply to make X additional copies of the character, and the GM is within their rights to prohibit the AI from bringing along a legion of themselves on any particular adventure."
    },
    {
        title: "Defeat Security",
        desc: "- Commit Processing for the day as a Main Action to overcome any encryption or electronic lock that wasn’t put in place by another AI.\n- In the latter case, roll opposing Program skill checks; on a failure, you cannot beat the security with this Routine.\n- Successfully beating a security measure automatically negates any alarms."
    },
    {
        title: "Drone Command",
        desc: "Commit Processing as an On Turn to function as if you had drone control rig cyber-ware while it remains committed.\n- You can issue one free command to a controlled drone every round per two character levels, rounded up.\n- A drone can carry out one command per round."
    },
    {
        title: "Native Hacker",
        desc: "Commit Processing for the day as an On Turn to automatically succeed at any hacking-based skill check not opposed by another AI or directed against AI-designed security.\n- In the latter case, the skill check is rolled normally.\n- You must trigger this Routine before the check."
    },
    {
    title: "Accelerated Deduction",
    desc: "Commit Processing for the day as a Main Action and ask the GM a yes-or-no question about a current or past event.\n- If there is any theoretical way you could have deduced the true answer through some Sherlockian feat of hyper-advanced deduction, the GM must answer truthfully or else indicate that the question has invalid assumptions in it.\n- The GM does not have to explain how you realize this, however, only that your subconscious processing routines indicate it.\n- This Routine is very taxing and may be used only once per day."
    },
    {
        title: "Cognitive Boost",
        desc: "Commit Processing for the scene as an On Turn to automatically succeed at any Know skill check if success is at all possible.\n- If used to augment a skill check that is primarily mental and requires only basic physical actions, it grants a +2 bonus to the skill check.\n- This Routine must be run before the roll is made."
    },
    {
    title: "Pierce Quantum ECM",
    desc: "Commit Processing for the day as an On Turn. For one scene, you or a device you are operating functions as if no quantum ECM was functional in the vicinity.\n- Thus, you can access remote processing clusters, use a guided weapon on a target within one scene’s flight, or pilot a drone into an ECM field outside your line of sight."
    },
    {
    title: "Predictive Cognition",
    desc: "Commit Processing for the day as an Instant.\n- All events since the beginning of your last turn have not actually taken place; they were merely modelled by your predictive analysis.\n- Events and other peoples’ conditions reset to the beginning of your most recent turn, and you may act differently if you so wish.\n- You may use this Routine only once per day." 
    },
    {
        title: "Multifactor Prediction",
        desc: "Commit Processing for the day as an On Turn and predict events up to ten minutes in the future.\n-  Unless your prediction is physically impossible or the people involved in it would not conceivably behave in that way, they will carry out your prediction to the letter.\n-  If used in combat or a situation of physical danger, the increased chaos limits the prediction to one round into the future.\n- This Routine can be run only once per scene."
    },
    {
        title: "Will of the Machine",
        desc: "Commit Processing as an On Turn and target a visible or wirelessly accessible vehicle or machine no larger than a grav-flyer.\n- While you maintain your Commitment you have complete control over the device and can use its sensors as if they were your own.\n- Issuing it a command takes up a Move action on your part."
    }
];

// Populate Routine Abilities technique value fields and description.
function populateRoutine(id){
    var opGroup = Object.getOwnPropertyNames(routineTechniqueList[0]);
    var routineField = document.getElementById("routineName" + id);
    var routineAction = document.getElementById("routineAction" + id);
    var routineProcessing = document.getElementById("routineCommit" + id);
    var routineInfo = document.getElementById("routineInfo" + id);

    var match = routineField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(routineTechniqueList[0][groupIndex], match);
        if (index > -1) {
            var currentRoutine = routineTechniqueList[0][opGroup[i]][index];
            routineInfo.setAttribute('data-name', routineField.value); // Store armour name
            routineInfo.setAttribute('data-desc', currentRoutine.desc); // Store armour description
            routineProcessing.value = currentRoutine.effort;
            routineAction.value = currentRoutine.action;
            return;
        }
    }
}

// Adjust Maximum Processing Pool
function updateMaxProcessing(){
   var maxProcessing = parseInt(Math.max(1 + Math.max($("#wisMod").val(),$("#intMod").val()),1));
    $("#maxPP").val(maxProcessing);
}

function addRoutineRow(){
     var newRow = $("<tr id='routineRow"+rowNumRoutine+"' value ='"+rowNumRoutine+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Technique Info" data-name="" data-desc="" id="routineInfo'+rowNumRoutine+'"></i><input type="text" id="routineName' + rowNumRoutine + '" list="routineList' + rowNumRoutine + '" data-idNum="'+ rowNumRoutine + '" onchange="populateRoutine('+rowNumRoutine+')"/><datalist id="routineList' + rowNumRoutine + '"></datalist></td>';
        cols += '<td><input type="number" value="-" min="0" onchange="populateRoutine('+rowNumRoutine+'); calculateEncumberance();" id="routineCommit' + rowNumRoutine + '" readonly/></td>';
    cols += '<td><input type="string" value="-" min="0" onchange="populateRoutine('+rowNumRoutine+'); calculateEncumberance();" id="routineAction' + rowNumRoutine + '" readonly/></td>';
        
        cols += '<td><input type="button" id="removeRoutine'+rowNumRoutine+'" class="ibtnDel button" data-rownum="'+rowNumRoutine+'" onclick="removeRoutineRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#routineTable").append(newRow);
        
         selectOptionTable(routineTechniqueList,"#routineList" + rowNumRoutine);
        activateRow();
        document.getElementById("equipmentTable").setAttribute("data-counter",rowNumRoutine);
        $("[name='counterRoutine']").val(rowNumRoutine);
        

    rowNumRoutine++;
}

function updateCoreRoutines(){
    if ($("#playerClass").val() === "trueAI"){
    for (var i = 0; i < 12; i++){
        
        if(parseInt($("#CoreRoutine"+i+"Level").val()) <= parseInt($("#playerLevel").val())){
            $("#CoreRoutine"+i).show();
            
        }
        else{
            $("#CoreRoutine"+i).hide();
            $("#CoreRoutine"+i+"Child").hide();
        }
    }
    }
    else if (($("#playerClass").val() === "adventurerETAI")||($("#playerClass").val() === "adventurerPTAI")||($("#playerClass").val() === "adventurerPTAI")||($("#playerClass").val() === "adventurerWTAI")){
        
       for (var j = 0; j < 12; j++){    
        if((parseInt($("#CoreRoutine"+j+"Level").val()) <= Math.floor(parseInt($("#playerLevel").val())/2))&&(parseInt($("#playerLevel").val())< 7)&&($("#CoreRoutine"+j+"Level").val() < 3)){
            $("#CoreRoutine"+j).show();
            
        }
        else if((parseInt($("#CoreRoutine"+j+"Level").val()) < 4) && (parseInt($("#playerLevel").val() ) > 6)){
            $("#CoreRoutine"+j).show();
        }
        else{
            $("#CoreRoutine"+j).hide();
            $("#CoreRoutine"+j+"Child").hide();
        }
    } 
    }
}

var shellRowNum = 1;

function addShellRow(){
     var newRow = $("<tr id='shellRow"+shellRowNum+"' value ='"+shellRowNum+"'>");
    var newChild =  $("<tr id='shellChildRow"+shellRowNum+"'>");
        var cols = "";

        cols += '<td><i class="icon-info-sign interactInfo" title="Get Skill Info" data-name="" data-desc="" id="shellInfo'+shellRowNum+'"></i><input type="text" id="shellName' + shellRowNum + '" list="shellList' + shellRowNum + '" data-idNum="'+ shellRowNum + '" onchange="populateShell('+shellRowNum+'); updateAC();"/><datalist id="shellList' + shellRowNum + '"></datalist></td>';
    cols += '<td><textarea rows="1" style="height:1em;" class="notes" type="string" id="shellNotes' + shellRowNum + '" /></td>';
   
    cols += '<td><input type="number" value="0" onchange=" updateShellStats();" id="shellStrMod' + shellRowNum +'"></td>';
    cols += '<td><input type="number" value="0" onchange=" updateShellStats();" id="shellDexMod' + shellRowNum +'"></td>';
    cols += '<td><input type="number" value="0" onchange=" updateShellStats();" id="shellConMod' + shellRowNum +'"></td>';
     cols += '<td><input type="number" value="0" onchange="updateAC(); updateShellStats();" id="shellAC' + shellRowNum +'"></td>';
    
        cols += '<td><input type="string"  id="shellPrice' + shellRowNum + '"/></td>';
        cols += '<td><select id="shellStorage' + shellRowNum + '" onchange="updateAC(); updateShellStats(); storageColour(shellStorage'+shellRowNum+');" class="storage"> <option>-</option> <option>Readied</option> <option>Backpack</option><option>Storage</option></select></td>';
        cols += '<td><input type="button" id="removeShell'+shellRowNum+'" class="ibtnDel button" data-rownum="'+shellRowNum+'" onclick="removeShellRow(this.dataset.rownum,this.id);" value="-"></td>';
        newRow.append(cols);
        $("#shellTable").append(newRow);
    
         selectOptionTable(shellList,"#shellList" + shellRowNum);
        activateRow();
        document.getElementById("shellTable").setAttribute("data-counter",shellRowNum);
        $("[name='counterShell']").val(shellRowNum);
        

    shellRowNum++;

     $('textarea').on('keyup keypress click', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });
    resizeTextarea();
}

function removeShellRow(deleteButtonID,id){
    if(shellRowNum > 1){
        overwriteRows(deleteButtonID,id,"shellRow","removeShell","#shellStorage",shellRowNum);
    document.getElementById("shellRow"+parseInt(shellRowNum-1)).remove();
    $("[name='counterShell']").val(parseInt(shellRowNum-2));
    calculateEncumberance();

    shellRowNum--;
    }
}

// Update readied and stowed shell limit
function updateMaxCarry(strVal){
    document.getElementById("maxReady").value = parseInt(Math.floor(strVal/2));
    document.getElementById("maxStowed").value = parseInt(strVal);
}

// Populate shell List shell value fields and description.
function populateShell(id){
    var opGroup = Object.getOwnPropertyNames(shellList[0]);
    var shellField = document.getElementById("shellName" + id);
    var shellDesc = document.getElementById("shellInfo" + id);

    var match = shellField.value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(shellList[0][groupIndex], match);
        if (index > -1) {
            var currentShell = shellList[0][opGroup[i]][index];
            shellDesc.setAttribute('data-name', shellField.value); // Store shell name
            shellDesc.setAttribute('data-desc', currentShell.desc); // Store shell description
            document.getElementById("shellPrice" + id).value = currentShell.cost;
           
            document.getElementById("shellAC" + id).value = currentShell.ac;
           
            return;
        }
    }
}
    
    function shellStorageColour(idNum){
var color = $("option:selected","#shellStorage"+idNum).text().trim().toLowerCase() == "readied" ? "#006600" :
$("option:selected","#shellStorage"+idNum).text().trim().toLowerCase() == "storage" ? "#606060" : "black";
$("#shellStorage"+idNum).closest("tr").css("background-color",color);
}

function updateShellStats(){
     
    var shellRows = parseInt($("[name='counterShell']").val());
    var location = 0;
    var strMod = 10;
    var dexMod = 10;
    var conMod = 10;
    var strShell = 0;
    var dexShell = 0;
    var conShell = 0;
    
    for (i = shellRows; i > -1; i--){
        if (document.getElementById("shellName" + i) !== null){
            location = document.getElementById("shellStorage" + i).value;
           
            if (location === "Readied"){
                    strShell = Math.max(strShell,parseInt(document.getElementById("shellStrMod" + i).value));
                    dexShell = Math.max(dexShell,parseInt(document.getElementById("shellDexMod" + i).value));
                    conShell = Math.max(conShell,parseInt(document.getElementById("shellConMod" + i).value));
            }
   
        }
    }
    if (strShell !== 0){
        document.getElementById("strBase").value = strShell;
        document.getElementById("strBase").onchange();
    }
    else{
        document.getElementById("strBase").value = strMod;
        document.getElementById("strBase").onchange();
    }
    if (dexShell !== 0){
        document.getElementById("dexBase").value = dexShell;
        document.getElementById("dexBase").onchange();
    }
    else{
        document.getElementById("dexBase").value = dexMod;
        document.getElementById("dexBase").onchange();
    }
    if (conShell !== 0){
        document.getElementById("conBase").value = conShell;
        document.getElementById("conBase").onchange();
    }
    else{
        document.getElementById("conBase").value = conMod;
        document.getElementById("conBase").onchange();
    }
}


// ================================================================================
// 4. Foci Automation
// ================================================================================

// Track how many Focus Points have been spent.
function updateUsedFP(){
    var usedFP = 0;
    for (var i = 1; i<7;i++){
        if (document.getElementById("Foci" + i).value !== "empty"){
            usedFP = usedFP + parseInt(document.getElementById("FociLevel" + i).value);
        }
    }
    document.getElementById("usedFP").value = usedFP;
}

// Update maximum number of Foci allowed.
function updateMaxFociPool(){
    var level = parseInt(document.getElementById("playerLevel").value);
    var playerClass = document.getElementById("playerClass").value;
    var maxFoci = 1;
    if((level > 1) && (level < 5)){
        maxFoci = 2;
    }
    else if ((level > 4) && (level < 7)){
        maxFoci = 3;
    }
    else if ((level > 6) && (level < 10)){
        maxFoci = 4;
    }
    else if (level > 9){
        maxFoci = 5;
    }
    if((playerClass === "warrior") || (playerClass === "expert") || (playerClass === "adventurerEP") || (playerClass === "adventurerPW")||(playerClass === "adventurerWTAI")||(playerClass === "adventurerETAI")||(playerClass === "adventurerPTAI")){
        maxFoci += 1;
    }
    else if (playerClass === "adventurerEW"){
        maxFoci += 2;
    }
    document.getElementById("maxFP").value = maxFoci;
    
}

function focusInfo(childID, selectID) {
    var opGroup = Object.getOwnPropertyNames(fociList[0]);
    var match = document.getElementById(selectID).value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        var groupIndex = opGroup[i];
        index = getIndex(fociList[0][groupIndex], match);
        if (index > -1) {
            var info = fociList[0][groupIndex][index].desc;
            var title = fociList[0][groupIndex][index].title;
            document.getElementById(childID).setAttribute("data-desc",info);
            document.getElementById(childID).setAttribute("data-name",title);
           

            updateUsedFP();
            clearSelection();
            return;
        }
    }
}

// ================================================================================
// 5. Skill Automation
// ================================================================================

// Updates learning/growth bonus skill modifiers
function addLearnSkillBonus() {
    
    $(".skillField").attr("data-learn",0);
    
    var level = parseInt(document.getElementById("playerLevel").value);
    var limit = Math.min(4,(1+Math.floor(level/3)));
    
    // cycle through all initial skill fields
    for (var skillID = 1; skillID < 17; skillID++) {
        var match = document.getElementById("initSkill" + skillID).value; // Get level value of current indexed skill field

        if (match != "empty"){
            // Set skill field value.
            document.getElementById(match + "Score").setAttribute("data-learn",  Math.min(limit,parseInt(document.getElementById(match + "Score").getAttribute("data-learn")))+1);
        }
        // Update memory of previously selected field 
        document
            .getElementById("initSkill" + skillID)
            .setAttribute("data-previous", match);
    }
    updateBaseSkills();
    updateMaxEffort();
}

//Update initial skill values during character creation.
function updateBaseSkills() {
    var level = parseInt(document.getElementById("playerLevel").value);
    var limit = Math.min(4,(1+Math.floor(level/3)));
    var skillList = [
        "admin",
        "connect",
        "exert",
        "fix",
        "heal",
        "know",
        "lead",
        "notice",
        "perform",
        "pilot",
        "program",
        "punch",
        "shoot",
        "sneak",
        "stab",
        "survive",
        "talk",
        "trade",
        "work",
        "biopsi",
        "metapsi",
        "precog",
        "telekinesis",
        "telepath",
        "teleport",
        "custom1",
        "custom2"
    ];
     for (var i = 0; i < skillList.length; i++){
         baseSkill = skillList[i];
    var currentSkill = document.getElementById(baseSkill + "Score"); // Get current skill field.

    var learnBonus = parseInt(currentSkill.getAttribute("data-learn"));

    var currentValue = parseInt(currentSkill.getAttribute("data-bonus"));

    currentSkill.value = Math.min(learnBonus + currentValue, limit);
    currentSkill.setAttribute("value", currentSkill.value); // Update skill score.
    currentSkill.setAttribute("min", learnBonus - 1); // Attribute cannot be decremented below base value.
    currentSkill.setAttribute("max", limit);
    updateSkill(baseSkill + "Score");
     }
}

// Update maximum skill point pool.
function updateSkillPoolSize() {
    var maxSP = 3*parseInt(document.getElementById("playerLevel").value - 1);
    if ((document.getElementById("playerClass").value === "expert")||(document.getElementById("playerClass").value === "adventurerEP")||(document.getElementById("playerClass").value === "adventurerEW")||(document.getElementById("playerClass").value === "adventurerETAI")){
        maxSP += 1*parseInt(document.getElementById("playerLevel").value - 1);
    }
    
    document.getElementById("maxSP").value = maxSP;
}

// Hide skill input field if untrained.
function updateSkill(id) {
    var currentSkill = document.getElementById(id);
    if (parseInt(currentSkill.value) === -1) {
        document.getElementById(id).style.display = "none";
         if ((currentSkill.id === "teleportScore") || (currentSkill.id === "telepathScore") || (currentSkill.id === "telekinesisScore") || (currentSkill.id === "biopsiScore") || (currentSkill.id === "metapsiScore") || (currentSkill.id === "precogScore")){
             $("#"+currentSkill.getAttribute("data-psi") + "CoreTechnique").hide();
         }
    } else {
        document.getElementById(id).style.display = "inline-block";
        if ((currentSkill.id === "teleportScore") || (currentSkill.id === "telepathScore") || (currentSkill.id === "telekinesisScore") || (currentSkill.id === "biopsiScore") || (currentSkill.id === "metapsiScore") || (currentSkill.id === "precogScore")){
            $("#"+currentSkill.getAttribute("data-psi") + "CoreTechnique").show();
            $("#"+currentSkill.getAttribute("data-psi") + "CoreLevel").val(parseInt(currentSkill.value));
            
        }
    }
    updateSkillBonus(id);
    updateSkillPool();
    updateMaxEffort();
}

// Update and store the bonus value to the base attribute score.
function updateSkillBonus(id) {
    var skillScore = parseInt(document.getElementById(id).value);
    var skillLearnValue = parseInt(
        document.getElementById(id).getAttribute("data-learn")
    );
    document
        .getElementById(id)
        .setAttribute("data-bonus", skillScore - skillLearnValue);
   
}

// Tracks and calculates how many skill points have been spent by the player.
function updateSkillPool() {
    var attributeList = ["str", "dex", "con", "int", "wis", "cha"];
    var skillList = [
        "admin",
        "connect",
        "exert",
        "fix",
        "heal",
        "know",
        "lead",
        "notice",
        "perform",
        "pilot",
        "program",
        "punch",
        "shoot",
        "sneak",
        "stab",
        "survive",
        "talk",
        "trade",
        "work",
        "biopsi",
        "metapsi",
        "precog",
        "telekinesis",
        "telepath",
        "teleport",
        "custom1",
        "custom2"
    ];

    // Reset cost counters
    var attrCost = 0;
    var skillCost = 0;
    var i = 0;
    var cost = 0;
    // Calculate attribute bonus SP cost.
    for (i = 0; i < attributeList.length; i++) {
        var attrBonus = parseInt(
            document
                .getElementById(attributeList[i] + "Score")
                .getAttribute("data-bonus")
        );
        for (cost = attrBonus; cost > 0; cost--) {
            attrCost = attrCost + cost;
        }
    }

    // Calculate skill point SP cost.
    for (i = 0; i < skillList.length; i++) {
        var skillBonus = parseInt(
            document
                .getElementById(skillList[i] + "Score")
                .getAttribute("data-bonus")
        );
        var skillLearn = parseInt(
            document
                .getElementById(skillList[i] + "Score")
                .getAttribute("data-learn")
        );
        for (cost = skillBonus + skillLearn; cost > skillLearn -1; cost--) {
            skillCost = skillCost + cost + 1;
        }
    }

    document.getElementById("usedSP").value = attrCost + skillCost;
}

// ================================================================================
// 6. Level & XP Automation
// ================================================================================

// Adjust player level according to current XP.
function updateLevel() {
    var exp = parseInt(document.getElementById("playerXP").value);
    if (exp < 3) {
        lvl = 1;
    } else if (3 <= exp && exp <= 5) {
        lvl = 2;
    } else if (6 <= exp && exp <= 11) {
        lvl = 3;
    } else if (12 <= exp && exp <= 17) {
        lvl = 4;
    } else if (18 <= exp && exp <= 26) {
        lvl = 5;
    } else if (27 <= exp && exp <= 38) {
        lvl = 6;
    } else if (39 <= exp && exp <= 53) {
        lvl = 7;
    } else if (54 <= exp && exp <= 71) {
        lvl = 8;
    } else if (72 <= exp && exp <= 92) {
        lvl = 9;
    } else if (93 <= exp && exp <= 116) {
        lvl = 10;
    } else {
        lvl = 11 + Math.floor((exp - 117) / 24);
    }
    document.getElementById("playerLevel").value = lvl;
    updateAtkBonus();
    updateSaves();
    updateMaxFociPool();
    updateSkillPoolSize();

    BackInfo("backDesc","playerBackground");
    classInfo("classDesc","playerClass");
    focusInfo("infoF1","Foci1");
    focusInfo("infoF2","Foci2");
    focusInfo("infoF3","Foci3");
    focusInfo("infoF4","Foci4");
    focusInfo("infoF5","Foci5");
    focusInfo("infoF6","Foci6");
    updateCoreRoutines();
}

// ================================================================================
// 7. HP & Attack Automation
// ================================================================================

// Update attack bonus based on player level.
function updateAtkBonus() {
    var playerLevel = parseInt(document.getElementById("playerLevel").value);
    var playerClass = document.getElementById("playerClass").value;
    
    if(playerClass === "warrior"){
        document.getElementById("atkBonus").value = Math.floor(playerLevel);
    }
    else if ((playerClass === "adventurerEW")||(playerClass === "adventurerPW")||(playerClass === "adventurerWTAI")){
        document.getElementById("atkBonus").value = Math.floor(playerLevel / 2) + 1 + Math.min(1,Math.floor(playerLevel/5));
    }
        
    else{
    // Half the player's level.
    document.getElementById("atkBonus").value = Math.floor(playerLevel / 2);
    }
}

// ================================================================================
// 8. Data Arrays
// ================================================================================

// List of all psychic techniques
var psiCoreTechniques = [
    {
        title: "Psychic Succor",
        desc: "The adept’s touch stabilizes critically-wounded organisms.\n - Each use of Psychic Succor adds one point of System Strain to the target, or two points if they were mortally wounded at the time.\n -Activating Psychic Succor requires the biopsion to Commit Effort for the day. Once used, they can continue to use it for the rest of that scene without Committing Effort again.\n\n -Level-0: The psychic’s touch can automatically stabilize a mortally-wounded target as a Main Action. This power must be used on a target within six rounds of their collapse and does not function on targets that have been decapitated or killed by Heavy weapons. It’s the GM’s decision as to whether a target is intact enough for this power to work.\n\n -Level-1: As level-0, and heal 1d6+1 hit points of damage. If used on a mortally-wounded target, they revive with the rolled hit points and can act normally on the next round.\n\n -Level-2: As level-1, but healing 2d6+2 hit points instead.\n\n -Level-3: As level-2, but healing 2d6+6 hit points instead. Level-4: As level-3, but healing 3d6+8 hit points instead."
    },
    {
        title: "Psychic Refinement",
        desc: "The metapsion gains improved mastery over their own powers and an innate sensitivity to the use of psionic abilities in their presence.\n\n -Level-0: The adept can visually and audibly detect the use of psychic powers. If both the source and target are visible to the metapsion, they can tell who’s using the power, even if it’s normally imperceptible. They gain a +2 bonus on any saving throw versus a psionic power.\n\n -Level-1: The metapsion’s maximum Effort increases by an additional point.\n\n -Level-2: The adept can determine whether or not a person is a psychic or has latent psionic abilities through one round of visual inspection. Their saving throw bonus against psionic powers increases to +3.\n\ -Level-3: The metapsion’s maximum Effort increases by an additional point.\n\n -Level-4: The metapsion can perform a slightly safer version of torching. Instead of rolling the torching damage die, they simply suffer 10 hit points of damage after torching is used. The damage occurs after the fueled power activates, allowing a psychic at low hit points to trigger a power before falling unconscious. This damage cannot be healed by anything but natural bed rest, though a psychic can be stabilized if this technique drops her to zero hit points."
    },
    {
        title: "Oracle",
        desc: "The precog gains a progressively greater intuitive understanding of their own future. Each invocation of the Oracle technique requires a Main Action and that the user Commit Effort for the day. Once triggered, the adept gets a single brief vision related to the question about the future that they’re asking. This vision is always from their own personal vantage point and never reveals more than a minute of insight, though the psychic processes it almost instantly as part of the power’s use.\n The GM should answer the question as if the PC were about to perform the act or engage in the investigation pertinent to the question. Thus, if the adept wanted to know what pressing a button would do and the GM knows that it’s connected to a bomb, the psychic might get a vision of sudden death. If the bomb were on a time delay that extended past the time horizon of the oracle, however, the psychic might just see a vision of herself waiting patiently, with nothing happening\n Visions should relate to actions and events, not abstract facts. Oracle couldn’t tell a psychic who the crime boss of a slum neighbourhood is, for example, but it could give a vision of the psychic caught in the next bloody riot and the gang boss who’s directing the myriad thugs. It couldn’t reveal the name of a security guard, but it could show the seer the impending moment that the next guard patrol will enter the area the psychic plans to infiltrate. Only the most significant information is conveyed by the technique, even if multiple events of interest might transpire during the time horizon.\n Oracle can only be used on a given question or topic once until the situation changes substantially or a week goes by. The maximum time horizon of the Oracle increases as the adept’s Precognition skill improves. \n\n -Level-0: One minute into the future. \n\n -Level-1: One day into the future. \n\n -Level-2: One week into the future. \n\n -Level-3: Three months into the future."
    },
    {
        title: "Telekinetic Manipulation",
        desc: "The adept may Commit Effort for the scene as a Main Action to direct telekinetic force toward an object or person within unaided visual range or with tactile contact with the psychic. This force isn’t responsive enough to be effective as a weapon without the further refinement of technique, and cannot cause damage to living or mobile targets. If used to crush or harm immobile unliving objects, it does 1d6 damage per skill level of the psychic per round of focus. Objects move at 20 meters per round when moved telekinetically. A telekinetic force can be maintained over multiple rounds without expending further actions, such as holding a metal platform in place under a group of allies, but the psychic cannot again activate this technique on a second object until they release the first. \n\n -Level-0: The psychic can exert force as if with one hand and their own strength. \n\n -Level-1: The psychic can manipulate objects as if with both hands and can lift to two hundred kilograms with this ability. \n\n -Level-2: The psychic can lift or manipulate up to four hundred kilograms and smash a human-sized hole in structures of light wooden construction or lighter as a Main Action. \n\n -Level-3: The psychic can manipulate up to eight hundred kilograms and can affect as many individuals objects at once as they have Telekinesis skill levels. \n\n -Level-4: The psychic can manipulate up to a metric ton and can smash human-sized holes in TL4-constructed exterior walls, light stone walls, or similar barriers as a Main Action."
    },
    {
        title: "Telepathic Contact",
        desc: "The telepath can obtain a progressively deeper understanding of a sentient target’s thoughts. The target must be visible or otherwise perceptible to the telepath’s unaided senses. Opening a contact requires the telepath to Commit Effort for the day as a Main Action, and the contract lasts for a scene at most unless augmented by other techniques. The depth of contact that can be made depends on the psychic’s Telepathy skill. A single contact can use any or all of the effects permitted to a telepath of the user’s skill level. Basic forms of contact do not allow for a saving throw, though more advanced probes allow the target to make a Mental saving throw to resist. On a successful save, no form of this technique that allows a save can be used on them for the rest of the scene. \n\n -Level-0: Observe emotional states in a target. Intense emotions provide a single word or image related to the focus of the feelings. \n\n -Level-1: A shallow gestalt with the target’s language centres allows the telepath to understand any form of communication made by the target. If the psychic has the requisite body parts to speak the target’s language, they can communicate with it in turn. \n\n -Level-2: The psychic’s awareness of the target’s surface cognition is sophisticated enough to read their current thoughts, though it can’t pick up memories or non-obvious connections. The target gets a Mental saving throw to resist this. \n\n -Level-3: The psychic can drill down into the target’s memory to get a one or two-sentence answer to any single question they ask or receive a single answering vision of the target’s recollections. The target can attempt a Mental saving throw to resist this power, and whether or not it succeeds the contact is automatically ended. It can be re-established, but only by activating this technique again. \n\n -Level-4: The psychic instantly gets a full and nuanced awareness of everything the target can remember about a particular topic. The target can attempt a Mental saving throw to resist this power, and whether or not it succeeds the contact is automatically ended afterwards. It can be re-established, but only by activating this technique again."
    },
    {
        title: "Personal Apportation",
        desc: "The teleporter can translocate to another location they have either occupied before or can see with their unaided vision. Locations are fixed about the nearest major gravity well. For example, it is not possible to teleport to the cockpit of a distant moving vehicle they once occupied, but they can teleport to another point on a planet’s surface even though the planet has since moved far through the stellar void. The core technique allows the teleporter to move himself and any mass he can carry with his own natural strength. Resisting targets cannot be carried along, and unresisting ones must be touched. A teleporter can leave any clothing, shackles, adhesions, or other matter behind when he teleports, but he cannot leave behind matter that has been inserted into his body, such as cybernetics or shrapnel. Matter cannot be partially left behind. A teleporter will instinctively abort any apportation that would leave him embedded in a solid object or an environment of imminent physical harm. Any Committed Effort on such aborted jumps is wasted, as is any action spent triggering the power. The maximum range of Personal Apportation depends on the teleporter’s skill level. Teleporting with Personal Apportation counts as a Main Action and requires that the psychic Commit Effort for the scene. \n\n -Level-0: The psychic can teleport up to 10 meters. \n\n -Level-1: The psychic can teleport up to 100 meters. \n\n -Level-2: The psychic can teleport up to 10 kilometres. \n\n -Level-3: The psychic can teleport up to 1,000 kilometres. \n\n -Level-4: The psychic can teleport anywhere on a planet’s surface or near orbit."
    }
];



// List of foci
var fociList = [
    {
        "Select a Focus": [
            {
                title: "-",
                value: "empty",
                desc: ""
            }
        ],
        Non_Combat_Foci: [
            {
                title: "Alert",
                value: "alert",
                desc:
                    "You are keenly aware of your surroundings and virtually impossible to take unaware. You have an instinctive alacrity of response that helps you act before less wary persons can think to move. \n\n Level 1: Gain Notice as a bonus skill. You cannot be surprised, nor can others use the Execution Attack option on you. When you roll initiative, roll twice and take the best result. \n\n Level 2: You always act first in a combat round unless someone else involved is also this Alert."
            },
            {
                title: "Authority",
                value: "authority",
                desc:
                    "You have an uncanny kind of charisma about you, onethat makes others instinctively follow your instructions and further your causes. At level 1, this is a knack of charm and personal magnetism, while level 2 might suggest latent telepathic influence or transhuman memetichacking augmentations. Where this focus refers to followers, it means NPCs who have voluntarily chosen to be in your service. PCs never count as followers. \n\n Level 1: Gain Lead as a bonus skill. Once per day, you can make a request from an NPC who is not openly hostile to you, rolling a Cha/Lead skill check at a difficulty of the NPC’s Morale score. If you succeed,they will comply with the request, provided it is not harmful or extremely uncharacteristic. \n\n Level 2: Those who follow you are fired with confidence.Any NPC being directly led by you gains a Morale and hit roll bonus equal to your Lead skill and a +1 bonus on all skill checks. Your followers will not act against your interests unless underextreme pressure."
            },
            {
                title: "Connected",
                value: "connected",
                desc:
                    "You’re remarkably gifted at making friends and forging ties with the people around you. Wherever you go, you always seem to know somebody useful to your ends. \n\n Level 1: Gain Connect as a bonus skill. If you’ve spent at least a week in a not-entirely-hostile location, you’ll have built a web of contacts willing to do favors for you that are no more than mildly illegal. You can call on one favor per game day and the GM decides how far they’ll go for you. \n\n Level 2: Once per game session, if it’s not entirely implausible, you meet someone you know who is willing to do modest favors for you. You can decide when and where you want to meet this person, but the GM decides who they are and what they can do for you."
            },
            {
                title: "Diplomat",
                value: "diplomat",
                desc:
                    "You know how to get your way in personal negotiations, and can manipulate the attitudes of those around you. Even so, while smooth words are versatile, they’ll only work if your interlocutor is actually willing to listen to you. \n\n Level 1: Gain Talk as a bonus skill. You speak all the languages common to the sector and can learn new ones to a workable level in a week, becoming fluent in a month. Reroll 1s on any skill check dice related to negotiation or diplomacy. \n\n Level 2: Once per game session, shift an intelligent NPC’s reaction roll one step closer to friendly if you can talk to them for at least thirty seconds."
            },
            {
                title: "Hacker",
                value: "hacker",
                desc:
                    "You have a considerable fluency with digital security measures and standard encryption methods. You know how to make computerized systems obey you until their automatic failsafes come down on your control. \n\n Level 1: Gain Program as a bonus skill. When attempting to hack a database or computerized system, roll 3d6 on the skill check and drop the lowest die. \n\n Level 2: Your hack duration increases to 1d4+Program skill x 10 minutes. You have an instinctive understanding of the tech; you never need to learn the data protocols for a strange system and are always treated as familiar with it."
            },
            {
                title: "Healer",
                value: "healer",
                desc:
                    "Healing comes naturally to you, and you’re particularly gifted at preventing the quick bleed-out of wounded allies and comrades. \n\n Level 1: Gain Heal as a bonus skill. You may attempt to stabilize one mortally-wounded adjacent person per round as an On Turn action. When rolling Heal skill checks, roll 3d6 and drop the lowest die. \n\n Level 2: Stims or other technological healing devices applied by you heal twice as many hit points as normal. Using only basic medical supplies, you can heal 1d6+Heal skill hit points of damage to every injured or wounded person in your group with ten minutes of first aid spread among them. Such healing can be applied to a given target only once per day."
            },
            {
                title: "Henchkeeper",
                value: "henchkeeper",
                desc:
                    "You have a distinct knack for picking up lost souls who willingly do your bidding. You might induce them with promises of money, power, excitement, sex, or some other prize that you may or may not eventually grant. A henchman obtained with this focus will serve loyally until clearly betrayed or placed in unacceptable danger. Henchmen are not “important” people in their society and are usually marginal sorts, outcasts, the desperate, or other persons with few options. You can use more conventional payor inducements to acquire additional henchmen, but these extra hirelings are no more loyal or competent than your pay and treatment can purchase. \n\n Level 1: Gain Lead as a bonus skill. You can acquire henchmen within 24 hours of arriving in a community, assuming anyone is suitable hench material. These henchmen will not fight except to save their own lives but will escort you on adventures and risk great danger to help you. Most henchmen will be treated as Peaceful Humans from the Xenobestiary section of the book. You can have one henchman at a time for every three character levels you have, rounded up. You can release henchmen with no hard feelings at any plausible time and pick them back up later should you be without a current henchman. \n\n Level 2: Your henchmen are remarkably loyal and determined, and will fight for you against anything but clearly overwhelming odds. Whether through natural competence or their devotion to you, they’re treated as Martial Humans from the Xenobestiary section. You can make faithful henchmen out of skilled and highly-capable NPCs, but this requires that you actually have done them some favour or help that would reasonably earn such fierce loyalty."
            },
            {
                title: "Specialist",
                value: "specialist",
                desc:
                    "You are remarkably talented at a particular skill. Whether a marvellous cat burglar, a world-famous athlete, a brilliant engineer, or some other savant, your expertise is extremely reliable. You may take this focus more than once for different skills. \n\n Level 1: Gain a non-combat, non-psychic skill as a bonus. Roll 3d6 and drop the lowest die for all skill checks in this skill. \n\n Level 2: Roll 4d6 and drop the two lowest dice for all skill checks in this skill."
            },
            {
                title: "Star Captain",
                value: "starCaptain",
                desc:
                    "You have a tremendous natural talent for ship combat and can make any starship you captain a significantly more fearsome opponent. You must take the captain’s role during a fight as described on page 117 of the Ship Combat rules to benefit from this focus. \n\n  Level 1: Gain Lead as a bonus skill. Your ship gains 2 extra Command Points at the start of each turn. \n\n Level 2: A ship you captain gains bonus hit points equal to 20% of its maximum at the start of each combat. Damage is taken from these bonus points first, and they vanish at the end of the fight and do not require repairs to replenish before the next. In addition, once per engagement, you may resolve a Crisis as an Instant action by explaining how your leadership resolves the problem."
            },
            {
                title: "Starfarer",
                value: "starfarer",
                desc:
                    "You are an expert in the plotting and execution of interstellar spike drills. While most experienced pilots can manage conventional drills along well-charted spike routes, you have the knack for forging new drill paths and cutting courses too dangerous for lesser navigators. \n\nLevel 1: Gain Pilot as a bonus skill. You automatically succeed at all spike drill-related skill checks of difficulty 10 or less. \n\nLevel 2: Double your Pilot skill for all spike drill-related skill checks. Spike drives of ships you navigate are treated as one level higher; thus, a drive-1 is treated as a drive-2, up to a maximum of drive-7. Spike drills you personally oversee take only half the time they would otherwise require."
            },
            {
                title: "Tinker",
                value: "tinker",
                desc:
                    "You have a natural knack for modifying and improving equipment, as given in the rules on page 90. \n\n Level 1: Gain Fix as a bonus skill. Your Maintenance score is doubled, allowing you to maintain twice as many mods. Both ship and gear mods cost only half their usual price in credits, though pre-tech salvage requirements remain the same. \n\n Level 2: Your Fix skill is treated as one level higher for purposes of building and maintaining mods and calculating your Maintenance score. Advanced mods require one fewer pre-tech salvage part to make, down to a minimum of zero."
            },
            {
                title: "Unique Gift",
                value: "uniqueGift",
                desc:
                    "Whether due to exotic technological augmentation, a unique transhuman background, or a remarkable human talent, you have the ability to do something that’s simply impossible for a normal human. This is a special focus that serves as a catch-all for some novel power or background perk that doesn’t have a convenient fit in the existing rules. A transhuman who can function normally in lethal environments, a nanotech-laden experimental subject with a head full of exotic sensors, or a brilliant gravitic scientist who can fly thanks to their personal tech might all take this focus to cover their special abilities. It’s up to the GM to decide what’s reasonable and fair to be covered under this gift. If an ability is particularly powerful, it might require the user to take System Strain to use it, as described on page 32. As a general rule, this ability should be better than a piece of gear the PC could buy for credits. The player is spending a very limited resource when they make this focus pick, so what they get should be good enough that they can’t just duplicate it with a fat bank account."
            },
            {
                title: "Wanderer",
                value: "wanderer",
                desc:
                    "Your hero gets around. As part of life on the road, they’ve mastered several tricks for ensuring their mobility and surviving the inevitable difficulties of vagabond existence. \n\n Level 1: Gain Survive as a bonus skill. You can convey basic ideas in all the common languages of the sector. You can always find free transport to the desired destination for yourself and a small group of your friends provided any traffic goes to the place. Finding this transport takes no more than an hour, but it may not be a strictly legitimate means of travel and may require working passage. \n\n Level 2: You can forge, scrounge, or snag travel papers and identification for the party with 1d6 hours of work. These papers and permits will stand up to ordinary scrutiny, but require an opposed Int/ Administer versus Wis/Notice check if examined by an official while the PC is actually wanted by the state for some crime. When finding transport for the party, the transportation always makes the trip at least as fast as a dedicated charter would."
            }
        ],
        Combat_Foci: [
            {
                title: "Armsman",
                value: "armsman",
                desc:
                    "You have an unusual competence with thrown weaponsand melee attacks. This focus’ benefits do not applyto unarmed attacks or projectile weapons. For thrownweapons, you can’t use the benefits of the Armsmanfocus at the same time as Gunslinger. \n\n Level 1: Gain Stab as a bonus skill. You can draw orsheath a Stowed melee or thrown weapon as anInstant action. You may add your Stab skill level toa melee or thrown weapon’s damage roll or Shockdamage, assuming it has any to begin with.\n\n Level 2: Your primitive melee and thrown weaponscount as TL4 weapons for the purpose of overcomingadvanced armors. Even on a miss with amelee weapon, you do an unmodified 1d4 damageto the target, plus any Shock damage. This bonusdamage doesn’t apply to thrown weapons or attacksthat use the Punch skill."
            },
            {
                title: "Assassin",
                value: "assassin",
                desc:
                    "You are practised at sudden murder and have certain advantages in carrying out an Execution Attack as described in the rules on page 52. \n\n Level 1: Gain Sneak as a bonus skill. You can conceal an object no larger than a knife or pistol from anything less invasive than a strip search, including normal TL4 weapon detection devices. You can draw or produce this object as an On Turn action, and your point-blank ranged attacks made from surprise with it cannot miss the target. \n\n Level 2: You can take a Move action on the same round as you make an Execution Attack, closing rapidly with a target before you attack. You may split this Move action when making an Execution Attack, taking part of it before you murder your target and part of it afterwards. This movement happens too quickly to alert a victim or to be hindered by bodyguards, barring an actual physical wall of meat between you and your prey."
            },
            {
                title: "Close Combatant",
                value: "closeCombatant",
                desc:
                    "You’ve had all too much practice at close-in fighting and desperate struggles with pistol or blade. You’re extremely skilled at avoiding injury in melee combat, and at level 2 you can dodge through a melee scrum without fear of being knifed in passing. \n\n Level 1: Gain any combat skill as a bonus skill. You can use pistol-sized ranged weapons in melee without suffering penalties for the proximity of melee attackers. You ignore Shock damage from melee assailants, even if you’re unarmored at the time. \n\n Level 2: The Shock damage from your melee attacks treats all targets as if they were AC 10. The Fighting Withdrawal combat action is treated as an On Turn action for you and can be performed freely."
            },
            {
                title: "Die Hard",
                value: "dieHard",
                desc:
                    "You are surprisingly hard to kill. You can survive injuries or bear up under stresses that would incapacitate a less determined hero. \n\n Level 1: You gain an extra 2 maximum hit points per level. This bonus applies retroactively if you take this focus after the first level. You automatically stabilize if mortally wounded by anything smaller than a Heavy weapon. \n\n Level 2: The first time each day that you are reduced to zero hit points by an injury, you instead survive with one hit point remaining. This ability can’t save you from Heavy weapons or similar trauma."
            },
            {
                title: "Gunslinger",
                value: "gunslinger",
                desc:
                    "You have a gift with a gun. While this talent most commonly applies to slugthrowers or energy weapons, it is also applicable to thrown weapons, bows, or other ranged weapons that can be used with the Shoot skill. For thrown weapons, you can’t use the benefits of the Armsman focus at the same time as Gunslinger. \n\n Level 1: Gain Shoot as a bonus skill. You can draw or holster a Stowed ranged weapon as an On Turn action. You may add your Shoot skill level to a ranged weapon’s damage roll. \n\n Level 2: Once per round, you can reload a ranged weapon as an On Turn action if it takes no more than one round to reload. Even on a miss with a Shoot attack, you do unmodified 1d4 damage."
            },
            {
                title: "Ironhide",
                value: "ironhide",
                desc:
                    "Ironhide Whether through uncanny reflexes, remarkable luck, gengineered skin fibres, or subtle telekinetic shielding, you have natural defences equivalent to high-quality combat armour. The benefits of this focus don’t stack with armour, though Dexterity or shield modifiers apply. \n\n Level 1: You have an innate Armor Class of 15 plus half your character level, rounded up. \n\n Level 2: Your abilities are so effective that they render you immune to unarmed attacks or primitive weaponry as if you wore powered armour."
            },
            {
                title: "Savage Fray",
                value: "savageFray",
                desc:
                    "You are a whirlwind of bloody havoc in melee combat and can survive being surrounded far better than most combatants. \n\n Level 1: Gain Stab as a bonus skill. All enemies adjacent to you at the end of your turn whom you have not attacked suffer the Shock damage of your weapon if their Armor Class is not too high to be affected. \n\n Level 2: After suffering your first melee hit in a round, any further melee attacks from other assailants automatically miss you. If the attacker who hits you has multiple attacks, they may attempt all of them, but other foes around you simply miss."
            },
            {
                title: "Shocking Assault",
                value: "shockingAssault",
                desc:
                    "You’re extremely dangerous to enemies around you. The ferocity of your melee attacks stresses and distracts enemies even when your blows don’t draw blood. \n\n Level 1: Gain Punch or Stab as a bonus skill. The Shock damage of your weapon treats all targets as if they were AC 10, assuming your weapon is capable of harming the target in the first place. \n\n Level 2: In addition, you gain a +2 bonus to the Shock damage rating of all melee weapons and unarmed attacks. Regular hits never do less damage than this Shock would do on a miss."
            },
            {
                title: "Sniper",
                value: "sniper",
                desc:
                    "You are an expert at placing a bullet or beam on an unsuspecting target. These special benefits only apply when making an Execution Attack with a firearm or bow, as described on page 52. \n\n Level 1: Gain Shoot as a bonus skill. When making a skill check for an Execution Attack or target shooting, roll 3d6 and drop the lowest die. \n\n Level 2: A target hit by your Execution Attack takes a -4 penalty on the Physical saving throw to avoid immediate mortal injury. Even if the save is successful, the target takes double the normal damage inflicted by the attack."
            },
            {
                title: "Unarmed Combatant",
                value: "unarmedCombatant",
                desc:
                    "Your empty hands are more dangerous than knives and guns in the grip of the less gifted. Your unarmed attacks are counted as melee weapons when it comes to binding up opponents wielding rifles and similar long arms, though you need at least one hand free to do so. \n\n Level 1: Gain Punch as a bonus skill. Your unarmed attacks become more dangerous as your Punch skill increases. At level-0, they do 1d6 damage. At level-1, they do 1d8 damage. At level-2 they do 1d10, level-3 does 1d12, and level-4 does 1d12+1. At Punch-1 or better, they have the Shock quality equal to your Punch skill against AC 15 or less. While you normally add your Punch skill level to any unarmed damage, don’t add it twice to this Shock damage. \n\n Level 2: You know locks and twists that use powered servos against their wearer. Your unarmed attacks count as TL4 weapons to overcome advanced armours. Even on a miss with a Punch attack, you do an unmodified 1d6 damage."
            }
        ],
        Psionic_Foci: [
            {
                title: "Psychic Training",
                value: "psychicTraining",
                desc:
                    "You’ve had special training in a particular psychic discipline. You must be a Psychic or have taken the Partial Psychic class option as an Adventurer to pick this focus. In the latter case, you can only take training in the discipline you initially chose as a Partial Psychic. As with most foci, this focus can be taken only once. \n\n Level 1: Gain any psychic skill as a bonus. If this improves it to level-1 proficiency, choose a free level- 1 technique from that discipline. Your maximum Effort increases by one. \n\n Level 2: When you advance a level, the bonus psychic skill you chose for the first level of the focus automatically gets one skill point put toward increasing it or purchasing a technique from it. You may save these points for later if more is required to raise the skill or buy a particular technique. These points are awarded retroactively if you take this focus level later in the game."
            },
            {
                title: "Unique Gift",
                value: "uniqueGift",
                desc:
                    "Whether due to exotic technological augmentation, a unique transhuman background, or a remarkable human talent, you have the ability to do something that’s simply impossible for a normal human. This is a special focus that serves as a catch-all for some novel power or background perk that doesn’t have a convenient fit in the existing rules. A transhuman who can function normally in lethal environments, a nanotech-laden experimental subject with a head full of exotic sensors, or a brilliant gravitic scientist who can fly thanks to their personal tech might all take this focus to cover their special abilities. It’s up to the GM to decide what’s reasonable and fair to be covered under this gift. If an ability is particularly powerful, it might require the user to take System Strain to use it, as described on page 32. As a general rule, this ability should be better than a piece of gear the PC could buy for credits. The player is spending a very limited resource when they make this focus pick, so what they get should be good enough that they can’t just duplicate it with a fat bank account."
            }
        ],
        Origin_Foci: [
            {
                title: "VI Android",
                value: "androidVI",
                desc:
                    "You were built as an android, a robot indistinguishable from a human without a medical-grade inspection. Most androids are “companion” bots, though other VIs with roles that involve significant human interaction may also be built as androids. Minor scuffs and cuts don’t reveal your robotic nature but are reduced to zero hit points, your unnatural innards are obvious. \n\n Level 1: Gain a bonus skill related to your intended function. You have all the usual traits and abilities of a VI robot."
            },
            {
                title: "VI Worker Bot",
                value: "workerVI",
                desc:
                    "You were built for industrial or technical labour, where a human face was an unnecessary luxury. Most such VI bots are humanoid if only to more conveniently manipulate human-scale devices, but their inhuman nature is obvious. \n\n Level 1: Gain a bonus skill related to your intended function. Choose an attribute associated with your work and gain a +1 bonus to its modifier, up to a maximum of +2. You have all the usual traits and abilities of a VI robot."
            },
            {
                title: "VI Vehicle Bot",
                value: "vehicleVI",
                desc:
                    "Some VIs were instantiated in actual vehicles rather than conventional humanoid bodies. Most were purely synthetic in origins, but some sectors retain the techniques for brain transplants into non-human bodies. Some policies have been known to conduct full-body cyberneticization of soldiers into tanks, warships, attack helicopters, and other military vehicles. As a vehicle, you are usually equipped with manipulator arms that can be used on adjacent objects. You may operate the individual elements of your vehicle as if they were your own limbs, attacking once per round with a mounted weapon of your choice. \n\n Level 1: Gain Pilot as a bonus skill. Pick a vehicle acceptable to the GM, usually a drone, hoverbike or grav-car. You become that vehicle. You retain your usual attributes but gain the vehicle’s Armor score. You are Armor Class 10, modified by your Dexterity score. A technician can improve your Armor Class by aftermarket modifications, adding up to three times their Fix skill to your Armor Class for 1,000 credits per point of improvement. You use the vehicle’s hit points until your own normally-rolled hit point score exceeds that number. Many VI vehicles purchase a drone or humanoid robot body to carry on board and employ for remote operation in areas unsuitable for a vehicle; you can pilot a single surrogate body in place of your own Main Action, provided there’s no ECM to jam the control transmissions."
            }
        ]
    }
];

// List of classes
var classList = [
    {
        "Select a Class": [
            {
                title: "-",
                value: "empty",
                desc: ""
            }
        ],
        "Adventurer Class": [
            {
                title: "Adventurer (Expert/Psychic)",
                value: "adventurerEP",
                desc:
                    "• Partial Expert: You gain a free level in a non-combat focus related to your background. Most concepts will take Specialist, though Diplomat, Starfarer, Healer, or some other focus might suit better. Gain an extra skill point every time you gain a character level which can be spent on any non-psychic, non-combat skill.\n\n• Partial Psychic: You are a restricted psychic. Pick one psychic discipline as a bonus skill at level-0. You can improve this skill with foci or skill points gained from advancing a level, but you cannot learn or improve any other psychic skill. Your maximum Effort equals 1 plus this psychic skill’s level plus the best of your Wisdom or Constitution modifiers, down to a minimum of 1."
            },
            {
                title: "Adventurer (Expert/True AI)",
                value: "adventurerETAI",
                desc:
                    "• Partial Expert: You gain a free level in a non-combat focus related to your background. Most concepts will take Specialist, though Diplomat, Starfarer, Healer, or some other focus might suit better. Gain an extra skill point every time you gain a character level which can be spent on any non-psychic, non-combat skill.\n\nPartial True AI: \n\n• A Partial True AI’s access to Routines is slowed. At the first level, they cannot use any Routines at all. When their character reaches the second level, they gain access to first level Routines. At the fourth level, they get access to second level Routines, and at the seventh level, they get access to third-level Routines. Fourth and higher-level Routines are permanently beyond their grasp. For Routines with effects that depend on the character’s level, they still count their full level as applicable. \n• A Partial True AI has the same maximum Processing score as its more focused brethren. Partial True AIs may usually take Partial Warrior or Partial Expert as their other available class. While the existence of psychic AIs is not impossible, such a being would require GM approval to play and would determine Effort only with their Wisdom attribute."
            },
            {
                title: "Adventurer (Expert/Warrior)",
                value: "adventurerEW",
                desc:
                    "• Partial Expert: You gain a free level in a non-combat focus related to your background. Most concepts will take Specialist, though Diplomat, Starfarer, Healer, or some other focus might suit better. Gain an extra skill point every time you gain a character level which can be spent on any non-psychic, non-combat skill.\n\n• Partial Warrior: You gain a free level in a combat focus related to your background. Gain +1 to your attack bonus at the first and fifth levels. Gain 2 extra maximum hit points for each level. Thus, at the first level, you’d roll 1d6+2 for your maximum hit points. At second, you’d roll 2d6+4, and so forth."
            },
            {
                title: "Adventurer (Psychic/True AI)",
                value: "adventurerPTAI",
                desc:
                    "• Partial Psychic: You are a restricted psychic. Pick one psychic discipline as a bonus skill at level-0. You can improve this skill with foci or skill points gained from advancing a level, but you cannot learn or improve any other psychic skill. Your maximum Effort equals 1 plus this psychic skill’s level plus the best of your Wisdom or Constitution modifiers, down to a minimum of 1.\n\nPartial True AI: \n\n• A Partial True AI’s access to Routines is slowed. At the first level, they cannot use any Routines at all. When their character reaches the second level, they gain access to first level Routines. At the fourth level, they get access to second level Routines, and at the seventh level, they get access to third-level Routines. Fourth and higher-level Routines are permanently beyond their grasp. For Routines with effects that depend on the character’s level, they still count their full level as applicable. \n• A Partial True AI has the same maximum Processing score as its more focused brethren. Partial True AIs may usually take Partial Warrior or Partial Expert as their other available class. While the existence of psychic AIs is not impossible, such a being would require GM approval to play and would determine Effort only with their Wisdom attribute."
            },
            {
                title: "Adventurer (Psychic/Warrior)",
                value: "adventurerPW",
                desc:
                    "• Partial Psychic: You are a restricted psychic. Pick one psychic discipline as a bonus skill at level-0. You can improve this skill with foci or skill points gained from advancing a level, but you cannot learn or improve any other psychic skill. Your maximum Effort equals 1 plus this psychic skill’s level plus the best of your Wisdom or Constitution modifiers, down to a minimum of 1.\n\n• Partial Warrior: You gain a free level in a combat focus related to your background. Gain +1 to your attack bonus at the first and fifth levels. Gain 2 extra maximum hit points for each level. Thus, at the first level, you’d roll 1d6+2 for your maximum hit points. At second, you’d roll 2d6+4, and so forth."
            },
            {
                title: "Adventurer (Warrior/True AI)",
                value: "adventurerWTAI",
                desc:
                    "Partial Warrior: You gain a free level in a combat focus related to your background. Gain +1 to your attack bonus at the first and fifth levels. Gain 2 extra maximum hit points for each level. Thus, at the first level, you’d roll 1d6+2 for your maximum hit points. At second, you’d roll 2d6+4, and so forth.\n\nPartial True AI: \n\n• A Partial True AI’s access to Routines is slowed. At the first level, they cannot use any Routines at all. When their character reaches the second level, they gain access to first level Routines. At the fourth level, they get access to second level Routines, and at the seventh level, they get access to third-level Routines. Fourth and higher-level Routines are permanently beyond their grasp. For Routines with effects that depend on the character’s level, they still count their full level as applicable. \n• A Partial True AI has the same maximum Processing score as its more focused brethren. Partial True AIs may usually take Partial Warrior or Partial Expert as their other available class. While the existence of psychic AIs is not impossible, such a being would require GM approval to play and would determine Effort only with their Wisdom attribute."
            }
        ],
        "Other Classes": [
            {
                title: "Expert",
                value: "expert",
                desc:
                    " • You gain a free level in a non-combat focus related to your background. Most concepts will take Specialist in their main skill, though Diplomat, Starfarer, Healer, or some other focus might suit better. You may not take a combat-oriented focus with this perk. In case of uncertainty, the GM decides whether or not a focus is permitted.\n\n • Once per scene, you can reroll a failed skill check, taking the new roll if it’s better.\n\n • When you advance an experience level, you gain a bonus skill point that can be spent on any non-combat, non-psychic skill. You can save this point to spend later if you wish.\n\n • To get your starting maximum hit points, roll 1d6 and add your Constitution modifier, to a minimum of 1 hit point. Your attack bonus is equal to half your character level, rounded down, so it’s +0 at first level."
            },
            {
                title: "Psychic",
                value: "psychic",
                desc:
                    "• Unlike Warriors or Experts, you are capable of learning psychic disciplines and their associated techniques, as described starting on page 28.\n\n • When you pick this class, choose any two psychic skills as bonus skills. You can pick the same one twice to obtain level-1 proficiency in it and a free level-1 technique from that discipline.\n\n • You have an Effort score, which can be used to fuel psychic abilities. Your maximum Effort is equal to 1 plus your highest psychic skill plus the better of your Wisdom or Constitution modifiers. Even with a penalty, your maximum Effort cannot be lower than 1.\n\n • To get your starting maximum hit points, roll 1d6 and add your Constitution modifier, to a minimum of 1 hit point. Your attack bonus is equal to half your character level, rounded down, so it’s +0 at first level."
            },
            {
                title: "True AI",
                value: "trueAI",
                desc:
                    "• True AIs develop Routines as normal and have the usual amount of maximum Processing. Thus, at the first level, they know all first-level core Routines and their quantum identity core can provide them with a maximum Processing of 1 plus the higher of their Intelligence or Wisdom modifiers. \n\n• True AIs roll 1d6 for hit points at each level, reflecting their gradually improving ability to maintain functionality in their armatures and avoid debilitating damage. \n\n• True AIs have an attack bonus equal to half their character level, rounded down. Thus, a first level True AI has an attack bonus of +0. \n\n• True AIs have the ability to carve off a quantum phylactery from their core as described above, in addition to all the usual benefits of a robotic body that does not need to eat, drink, or sleep. \n\n• If using True AIs in a heroic campaign as described in the Heroic PCs section of this book, a Heroic True AI’s maximum Processing is always one point higher than it otherwise would be. Every day, a Heroic True AI can pick one Routine it can use when its Processing refreshes for the day; for the rest of the day, that Routine has no Processing cost for using it. Their Fray die is 1d6."
            },
            {
                title: "Warrior",
                value: "warrior",
                desc:
                    "• You gain a free level in a combat-related focus associated with your background. The GM decides if a focus qualifies if it’s an ambiguous case. \n\n• Warriors are lucky in combat. Once per scene, as an Instant ability, you can either choose to negate a successful attack roll against you or turn a missed attack roll you made into a successful hit. You can use this ability after the dice are rolled, but it cannot be used against environmental damage, effects without an attack roll, or hits on a vehicle you’re occupying. \n\n• You gain two extra maximum hit points at each character level."
            }
        ]
    }
];

// List of backgrounds
var backgroundList = [
    {
        "Select a Background": [
            {
                title: "-",
                value: "empty",
                desc: "",
                bonus: "empty"
            },
            {
                title: "Barbarian",
                value: "barbarian",
                desc:
                    "Standards of barbarism vary when many worlds are capable of interstellar spaceflight, but your hero comes from a savage world of low technology and high violence. Their planet may have survived an all-consuming war, or been deprived of critical  materials or energy resources, or simply have been colonized by confirmed Luddites. Other barbarians might be drawn from the impoverished underclass of advanced worlds or the technologically-degenerate inheritors of some high-tech space station or planetary hab.\n\n• Free Skill: Survive-0",
                bonus: "survive"
            },
            {
                title: "Clergy",
                value: "clergy",
                desc:
                    "Faith is nigh-universal among human civilizations, and your hero is dedicated to one such belief. Some clergies are conventional priests or priestesses, while others might be cloistered monastics or nuns, or more martial warrior monks. Modern-day faiths such as Christianity, Islam, Judaism, Hinduism, Buddhism, and other creeds all exist in various sectors, often in altered form, while some worlds have developed entirely new deities or faiths. If you’d like to create your own religion, you can work with the GM to define its characteristic beliefs.\n\n• Free Skill: Talk-0",
                bonus: "talk"
            },
            {
                title: "Courtesan",
                value: "courtesan",
                desc:
                    "Your hero’s career was one of proffered pleasure. Simple prostitution is one form of this background, perhaps as an ordinary streetwalker, a part-time amateur with bills to pay, or an expensive companion to the wealthy, but other forms of satisfaction exist among the many worlds. Refined artists of conversation and grace command high fees in some societies, while others pay well for the simple company of certain men and women with the right bloodlines, special appearance, or auspicious personal qualities esteemed by their culture.\n\n• Free Skill: Perform-0",
                bonus: "perform"
            },
            {
                title: "Criminal",
                value: "criminal",
                desc:
                    "Whether thief, murderer, forger, smuggler, spy, or some other variety of malefactor, your hero was a criminal. Some such rogues are guilty only of crossing some oppressive government or offending a planetary lord, while others have done things that no civilized society could tolerate. Still, their ability to deal with the most desperate and dangerous of contacts and navigate the perils of a less-than-legal adventure can make them attractive associates for a party of freebooters bent on profit and glory more than strict legality.\n\n• Free Skill: Sneak-0",
                bonus: "sneak"
            },
            {
                title: "Dilettante",
                value: "dilettante",
                desc:
                    "Your hero never had a profession, strictly speaking, but spent their formative years in travel, socializing, and a series of engaging hobbies. They might have been the scion of a wealthy industrialist, a planetary noble’s younger offspring, or a hanger-on to someone with the money and influence they lacked. By the time your hero’s adventures start, they’ve run through the money that once fueled their lifestyle. Extreme measures may be necessary to acquire further funding.\n\n• Free Skill: Connect-0",
                bonus: "connect"
            },
            {
                title: "Entertainer",
                value: "entertainer",
                desc:
                    "Singers, dancers, actors, poets, writers… the interstellar reaches teem with artists of unnumbered styles and mediums, some of which are only physically possible with advanced technological support. Your hero was a dedicated entertainer, one likely focused on a particular form of art. Patrons and talent scouts can be temperamental, however, and sometimes a budding artist needs to take steps to find their audience. Or at least, to find their audience’s money.\n\n• Free Skill: Perform-0",
                bonus: "perform"
            },
            {
                title: "Merchant",
                value: "merchant",
                desc:
                    "Your hero was or is a trader. Some merchants are mere peddlers and shopkeepers on primitive, low-tech worlds, while others are daring far traders who venture to distant worlds to bring home their alien treasures. The nature of trade varies widely among the worlds. On some of them, it’s a business of soberly-dressed men and women ticking off trades on virtual terminals, while on others it is a more… active pursuit, requiring the judicious application of mono blades and deniable gunfire against competitors. Sometimes a deal goes bad or capital needs to be raised, and a merchant’s natural talents are turned toward the perils of adventure.\n\n• Free Skill: Trade-0",
                bonus: "trade"
            },
            {
                title: "Noble",
                value: "noble",
                desc:
                    "Many planets are ruled by a class of nobles, and your hero was a member of one such exalted group. Such planets are often worlds of exquisite courtesy alloyed with utterly remorseless violence, and a misplaced word at the morning levee can result in an executioner’s mono blade at noon. Your hero has done something or been the victim of something to dislodge them from their comfortable place at court. Without their familiar allies, wealth, or influence, they must take a new place in the world, however distasteful that claiming might be.\n\n• Free Skill: Lead-0",
                bonus: "lead"
            },
            {
                title: "Official",
                value: "official",
                desc:
                    "Most advanced worlds run on their bureaucracies, the legions of faceless men and women who fill unnumbered roles in keeping the government running as it should. Your hero was one such official. Some were law enforcement officers, others government office clerks or tax officials or trade inspectors. However necessary the work may be, it is often of unendurably tedious nature, and any man or woman with an adventurous spark to their blood will soon find themselves desperate for more exciting use of their talents.\n\n• Free Skill: Administer-0",
                bonus: "admin"
            },
            {
                title: "Peasant",
                value: "peasant",
                desc:
                    "A technologically advanced world can usually produce all its necessary foodstuffs and basic resources with a handful of workers, the bulk of the labour being performed by agricultural bots. On more primitive worlds, or those with a natural environment that requires close personal attention to crops, a class of peasants will emerge. These men and women often become chattel, part and parcel of the land they occupy and traded among their betters like the farm equipment of richer worlds. Your hero was not satisfied with that life and has done something to break free from their muddy and toilsome past.\n\n• Free Skill: Exert-0",
                bonus: "exert"
            },
            {
                title: "Physician",
                value: "physician",
                desc:
                    "Bodies wear and break, even on worlds that possess the full resources of advanced post-tech medicine. Your hero was a physician, one trained to cure the maladies of the body or the afflictions of the mind. Some physicians are conventional health workers, while others are ship’s surgeons, military medics, missionary healers of an expanding faith, or dubious slum doctors who’ll graft over laser burns with no awkward questions asked. Wherever men and women go into danger, however, the skills of a physician are eagerly sought. \n\n• Free Skill: Heal-0",
                bonus: "heal"
            },
            {
                title: "Pilot",
                value: "pilot",
                desc:
                    "A pilot’s role is a broad one in the far future. The most glamorous and talented navigate starships through the meta-dimensional storms of interstellar space, while less admired figures fly the innumerable intra-system shuttles and atmosphere craft that serve in most advanced systems. On other planets, this career might reflect a long-haul trucker, or a horse-riding messenger, or an intrepid sailor on an alien sea. As the Pilot skill covers all these modes of transport, any character whose role revolves around vehicles or riding beasts might justify their selection of this career.\n\n• Free Skill: Pilot-0",
                bonus: "pilot"
            },
            {
                title: "Politician",
                value: "politician",
                desc:
                    "The nature of a political career varies from world to world. On some, it’s much like one we’d recognize, with glad-handing voters, loud rallies, and quiet back room deals with supposed rivals in government. On others, it might involve a great deal more ceremonial combat, appeals to councils of elders, and success at ritual trials. Whatever the details, your hero was a politician in their home culture. Something went wrong, though, and the only way to fix it is to get clear of your constituents for a while and seek some alternative means of advancement.\n\n• Free Skill: Talk-0",
                bonus: "talk"
            },
            {
                title: "Scholar",
                value: "scholar",
                desc:
                    "Scientists, sages, and professors all qualify for this career. Your hero was one such, a man or woman with a life dedicated to knowledge and understanding. It might have involved the technical expertise of a meta-dimensional structures engineer or the sacred memorization of the chronicles of some Lost-Worlder sage order, but your hero’s life was in learning. Sometimes that learning cannot be found in familiar surroundings, however, and for one reason or another, willing or not, your hero must venture out into the wider world.\n\n• Free Skill: Know-0",
                bonus: "know"
            },
            {
                title: "Soldier",
                value: "soldier",
                desc:
                    "Whatever the technology or structure of their parent world, a soldier’s work is universal. Your hero was a professional fighter, whether that took the form of a barbarian noble’s thegn, a faceless conscript in a planetary army, or an elite soldier in the service of a megacorp’s private military. Whether it was because they were on the losing side, choosing to leave the service, or being forced to flee a cause they couldn’t fight for, they now find themselves navigating a world where their most salable skill is one that can cause them a great deal of trouble.\n\n• Free Skill: Any Combat-0",
                bonus: "any"
            },
            {
                title: "Spacer",
                value: "spacer",
                desc:
                    "Almost every advanced world is highly dependent upon the resources that space flight brings them. Some of this work can be automated, but every really important task needs a flexible human operator to oversee the work. Your hero is one such spacer, either a worker who toils in the sky or a native void born man or woman who has spent their entire life outside of natural gravity. It’s not uncommon for such workers to find better prospects in places where they can breathe without a vac suit.\n\n• Free Skill: Any Fix-0",
                bonus: "fix"
            },
            {
                title: "Technician",
                value: "technician",
                desc:
                    "Old things break and new things need to be made. Whether a humble outworlder blacksmith or an erudite astronautic engineer, your hero made a career out of manufacturing and mending the fruits of technology. While almost every society requires such services, not all of them treat their providers as generously as a technician might wish. Sometimes, these same talents can be turned toward less licit ends, and a skilled technician’s expertise is always useful to an adventuring group that plans to rely on anything more sophisticated than a sharpened stick.\n\n• Free Skill: Any Fix-0",
                bonus: "fix"
            },
            {
                title: "Thug",
                value: "thug",
                desc:
                    "Your hero was a bruiser. They might have had a notional allegiance to some so-called “army”, or have been part of some crime boss’ strong-arm crew, or simply been a private contractor of misfortune for those who failed to pay up. They might have even been a fist in a righteous cause, defending their neighbourhood from hostile outsiders or serving as informal muscle for a local leader in need of protection. Whatever the details, they’ve had to move on from their old life, and their new one is likely to involve a similar application of directed force.\n\n• Free Skill: Any Combat-0",
                bonus: "any"
            },
            {
                title: "Vagabond",
                value: "vagabond",
                desc:
                    "A dilettante has money and friends; your hero simply has the road. Whether they were knocked loose from polite society at a young age or have recently found themselves cast out of familiar life, they now roam the ways of the world and the spaces between. Some heroes find this life satisfying, with its constant novelty and the regular excitement of bare survival. Others long for a more stable arrangement and are willing to lend their pragmatic talents to a group that offers some prospect of profit.\n\n• Free Skill: Survive-0",
                bonus: "survive"
            },
            {
                title: "Worker",
                value: "worker",
                desc:
                    "Countless in number, every industrialized world has swarms of workers to operate the machines and perform the labour that keeps society functioning. Cooks, factory labourers, mine workers, personal servants, lawyers, clerks, and innumerable other roles are covered under this career. If your hero rolls or picks Work as a skill but has a career that would better fit another existing skill, they may substitute it accordingly. Thus, a wage-slave programmer might take Program instead of Work, while a lawyer would use Administer instead as a reflection of their litigious talent.\n\n• Free Skill: Work-0",
                bonus: "work"
            },
            {
                title: "[True AI]",
                value: "trueAI",
                desc: "ai",
                bonus: "any"
            }
        ]
    }
];

// List of Skills
var skillList = [
    {
        "Select a Skill": [
            {
                title: "-",
                value: "empty",
                desc: ""
            }
            ],
        "Non-Combat Skills": [
            {
                title: "Administer",
                value: "admin",
                desc:
                    "- Manage an organization, handle paperwork, analyze records, and keep an institution functioning daily.\n- Roll it for bureaucratic expertise, organizational management, legal knowledge, dealing with government agencies, and understanding how institutions really work."
            },
            {
                title: "Connect",
                value: "connect",
                desc:
                    "- Find people who can be helpful to your purposes and get them to cooperate with you.\n- Roll it to make useful connections with others, find people you know, know where to get illicit goods and services, and be familiar with foreign cultures and languages.\n- You can use it in place of Talk for persuading people you find via this skill."
            },
            {
                title: "Exert",
                value: "exert",
                desc:
                    "- Apply trained speed, strength, or stamina in some feat of physical exertion.\n- Roll it to run, jump, lift, swim, climb, throw, and so forth.\n- You can use it as a combat skill when throwing things, though it doesn’t qualify as a combat skill for other ends."
            },
            {
                title: "Fix",
                value: "fix",
                desc:
                    "- Create and repair devices both simple and complex.\n- How complex will depend on your character’s background; a Lost-Worlder blacksmith is going to need some study time before he’s ready to fix that broken fusion reactor, though he can do it eventually.\n- Roll it to fix things, build things, and identify what something is supposed to do."
            },
            {
                title: "Heal",
                value: "heal",
                desc:
                    "- Employ medical and psychological treatment for the injured or disturbed.\n- Roll it to cure diseases, stabilize the critically injured, treat psychological disorders, or diagnose illnesses."
            },
            {
                title: "Know",
                value: "know",
                desc:
                    "- Know facts about academic or scientific fields.\n- Roll it to understand planetary ecologies, remember relevant history, solve science mysteries, and know the basic facts about rare or esoteric topics."
            },
            {
                title: "Lead",
                value: "lead",
                desc:
                    "- Convince others to also do whatever it is you’re trying to do.\n- Talk might persuade them that following you is smart, but Lead can make them do it even when they think it’s a bad idea.\n- Roll it to lead troops in combat, convince others to follow you, or maintain morale and discipline."
            },
            {
                title: "Notice",
                value: "notice",
                desc:
                    "Spot anomalies or interesting facts about your environment.\n- Roll it for searching places, detecting ambushes, spotting things, and reading the emotional state of other people."
            },
            {
                title: "Perform",
                value: "perform",
                desc:
                    "- Exhibit some performative skill.\n- Roll it to dance, sing, orate, act, or otherwise put on a convincing or emotionally moving performance."
            },
            {
                title: "Pilot",
                value: "pilot",
                desc:
                    "- Use this skill to pilot vehicles or ride beasts.\n- Roll it to fly spaceships, drive vehicles, ride animals, or tend to basic vehicle repair.\n- This skill doesn’t help you with things entirely outside the scope of your background or experience, though with some practice a PC can expand their expertise."
            },
            {
                title: "Program",
                value: "program",
                desc:
                    "- Operating or hacking computing and communications hardware.\n- Roll it to program or hack computers, control computer-operated hardware, operate communications tech, or decrypt things."
            },
            {
                title: "Sneak",
                value: "sneak",
                desc:
                    "- Move without drawing notice.\n- Roll it for stealth, disguise, infiltration, manual legerdemain, pickpocketing, and the defeat of security measures"
            },
            {
                title: "Survive",
                value: "survive",
                desc:
                    "- Obtain the basics of food, water, and shelter in hostile environments, along with avoiding their natural perils.\n- Roll it to handle animals, navigate difficult terrain, scrounge urban resources, make basic tools, and avoid wild beasts or gangs."
            },
            {
                title: "Talk",
                value: "talk",
                desc:
                    "- Convince other people of the facts you want them to believe.\n- What they do with that conviction may not be completely predictable.\n- Roll it to persuade, charm, or deceive others in conversation."
            },
            {
                title: "Trade",
                value: "trade",
                desc:
                    "- Find what you need on the market and sell what you have.\n- Roll it to sell or buy things, figure out where to purchase hard-to-get or illicit goods, deal with customs agents, or run a business."
            },
            {
                title: "Work",
                value: "work",
                desc:
                    "- This is a catch-all skill for professions not represented by other skills.\n- Roll it to work at a particular profession, art, or trade."
            }
        ],
        "Combat Skills": [
             {
                title: "Punch",
                value: "punch",
                desc: "- Use it as a combat skill when fighting unarmed."
            },
            {
                title: "Shoot",
                value: "shoot",
                desc:
                    "- Use it as a combat skill when using ranged weaponry, whether hurled rocks, bows, laser pistols, combat rifles, or ship’s gunnery."
            },
            {
                title: "Stab",
                value: "stab",
                desc:
                    "- Use it as a combat skill when wielding melee weapons, whether primitive or complex."
            }
        ],
        "Psychic Skills": [
            {
                title: "Biopsionics",
                value: "biopsi",
                desc:
                    "- Master powers of physical repair, body augmentation, and shapeshifting."
            },
            {
                title: "Metapsionics",
                value: "metapsi",
                desc: "- Master powers that nullify, boost, and shape the use of other psychic abilities."
            },
            {
                title: "Precognition",
                value: "precog",
                desc:
                    "- Master the ability to sense future events and control probability."
            },
            {
                title: "Telekinesis",
                value: "telekinesis",
                desc:
                    "- Master the remote control of kinetic energy to move objects and fabricate force constructs."
            },
            {
                title: "Telepathy",
                value: "telepath",
                desc:
                    "- Master the reading and influencing of other sapient minds."
            },
            {
                title: "Teleportation",
                value: "teleport",
                desc:
                    "- Master the arts of physical translocation of yourself and allies."
            }
        ]
    }
];

// List of Attributes
var attrList = [
    {
        "Select an Attribute": [
            {
                title: "-",
                value: "empty"
            },
            {
                title: "Strength",
                value: "str"
            },
            {
                title: "Dexterity",
                value: "dex"
            },
            {
                title: "Constitution",
                value: "con"
            },
            {
                title: "Intelligence",
                value: "int"
            },
            {
                title: "Wisdom",
                value: "wis"
            },
            {
                title: "Charisma",
                value: "cha"
            }
        ]
    }
];

// List of Psychic Techniques

var routineTechniqueList = [{
    "Select Technique":[
        {
        value: "-",
            name: "empty",
            desc: "",
            lvl: "0",
            action: "-"
    }
    ],
    "Biopsionics":[
        
    ]
}];

var psiTechniqueList = [{
    "Select Technique":[
        {
        value: "-",
            name: "empty",
            desc: "",
            lvl: "0",
            action: "-"
    }
    ],
    "Biopsionics":[
       {
            value: "Mastered Succor",
            title: "[biopsionics,lvl-1]",
            desc: "- The biopsion has developed a sophisticated mastery of their core ability, and they no longer need to Commit Effort to activate it and may use it whenever they wish.\n- The use of additional techniques that augment Psychic Succor might still require Effort to be Committed.",
            lvl: 1,
            action: "Passive",
            effort: 0
        },
        {
            value: "Organic Purification Protocols",
            title: "[biopsionics,lvl-1]",
            desc: "- The biopsion’s Psychic Succor now cures any poisons or diseases the subject may be suffering, albeit it requires Committing Effort for the day as an additional surcharge.\n- Biowarfare organisms, exceptionally virulent diseases, or TL5 toxins may resist this curing, requiring a Wis/Biopsionics skill check at a difficulty of at least 10.\n- Failure means that the adept cannot cure the target’s disease.\n- This technique cannot cure congenital illnesses.",
            lvl: 1,
            action: "Augment (Day)",
            effort: 1
        },
        {
            value: "Remote Repair",
            title: "[biopsionics,lvl-1]",
            desc: "- Psychic Succor and other bio-psionic techniques that normally require touch contact can now be applied at a distance up to 100 meters, provided the bio-psion can see the target with their unaided vision.\n- Hostile powers that normally require a hit roll will hit automatically.\n- Each time this technique is used, Effort must be Committed for the whole scene. ",
            lvl: 1,
            action: "Augment (Scene)",
            effort: 1
        },
         {
            value: "Invincible Stand",
            title: "[biopsionics,lvl-2]",
            desc: "- The bio-psion has mastered techniques of emergency tissue reinforcement and system stabilization.\n- As an Instant action, they can Commit Effort for the scene to keep themself or a target they can touch active even at zero hit points.\n- This technique must be used once every round on the target or they collapse at the end of the round.\n- If the target suffers hit point damage, the biopsion must Instantly Commit Effort for the scene or the target goes down immediately with a mortal wound.\n- A Heavy weapon hit on a subject of this power or similar physical dismemberment will always kill a target, regardless of this technique.",
            lvl: 2,
            action: "Intstant Action (Scene)",
            effort: 1
        },
        {
            value: "Major Organ Restoration",
            title: "[biopsionics,lvl-2]",
            desc: "- The bio-psion’s Psychic Succor can now cure congenital birth defects and regrow missing limbs and organs.\n- It can even be used to stabilize targets that have been dropped by Heavy weapons, decapitated, or otherwise dramatically dismembered, provided it’s used within one round per level of Biopsionic skill.\n- The best that can be done for such badly-mangled targets is stabilization, after which they must rest for 24 hours before any further hit points can be healed by Biopsionics, stims, or natural rest.",
            lvl: 2,
            action: "Passive",
            effort: 0
        },
        {
            value: "Tissue Integrity Field",
            title: "[biopsionics,lvl-2]",
            desc: "- The bio-psion’s Psychic Succor may now also affect all allies within ten meters of the target.\n-  Allies can decline the healing if they don’t require it or don’t want to take the additional System Strain.\n- Each use of this technique requires that the bio-psion Commit Effort for the day in addition to the cost of the Psychic Succor.",
            lvl: 2,
            action: "Augment (Day)",
            effort: 1
        },
        {
            value: "Accelerated Succor",
            title: "[biopsionics,lvl-3]",
            desc: "- The bio-psion’s Psychic Succor now can be used as an On Turn power, albeit only once per round.\n- By Committing an additional Effort for the day with each use, it can even be used as an Instant power, though it still can only be used once per round.\n- Any surcharges for augmenting the succor apply normally, such as with Tissue Integrity Field.",
            lvl: 3,
            action: "Passive",
            effort: 0
        },
        {
            value: "Metamorph",
            title: "[biopsionics,lvl-3]",
            desc: "- The bio-psion can now shape their own or another willing target’s physical form as a Main Action, transforming a touched target into any humanoid form within 50% of their own mass.\n- Claws and other body armaments can be fashioned equivalent to Light or Medium melee weapons and innate armour equivalent to AC 13.\n- Gills and other environmental-survival alterations are also viable at the GM’s discretion, but flight is a bridge too far for this power.\n- A person can be impersonated down to the DNA level, provided a blood or hair sample is available.\n- The use of this adds one System Strain point to the target that does not recover so long as the change is in effect.\n- Applying Metamorph requires that the bio-psion Commit Effort for as long as the change is to be maintained.\n- If applied to a target other than the psychic, the power automatically ends if the psychic gets more than one hundred kilometres away.",
            lvl: 3,
            action: "Main Action",
            effort: 1
        },
        {
            value: "Hollistic Optimization Patterning",
            title: "[biopsionics,lvl-4]",
            desc: "- The bio-psion gains the ability to drastically augment their own or a touched ally’s physical abilities as an On Turn action.\n- This boost lasts for the rest of the scene, adds two points of System Strain to the target and gives them a +2 bonus to all Strength or Dexterity skill checks, hit rolls, and damage rolls along with 20 extra hit points.\n- Any damage is taken off these temporary hit points first, and both the bonuses and any hit points in excess of the target’s maximum are lost at the end of the scene.\n- Each invocation of this technique requires the bio-psion to Commit Effort for the day, and this power cannot be used on a given target more than once per scene.",
            lvl: 4,
            action: "On Turn Action",
            effort: 1
        },
         {
            value: "Quintessential Reconstruction",
            title: "[biopsionics,lvl-4]",
            desc: "- The bio-psion becomes extremely difficult to kill, encoding their mind in a coherent pattern of MES energy coterminous with their realspace coordinates.\n- If killed, the psychic will regenerate from the largest remaining fragment of their body over 24 hours.\n- This process maximizes their System Strain for one week.\n- If brought to zero hit points during this week, they die instantly and permanently.\n- The psychic retains a vague awareness of their surroundings while “dead” and can postpone their regeneration for up to a week in order to avoid notice, but burial or entombment may result in a very short second life.\n- Each use of this power inflicts one point of permanent attribute loss in an attribute of the bio-psion’s choice.",
            lvl: 4,
            action: "Passive",
            effort: 0
        }
    ],
    "Metapsionics":[
        {
            value: "Cloak Powers",
            title: "[metapsionics,lvl-1]",
            desc: "- The metapsion can conceal their own psychic abilities from metapsionic senses.\n- They must Commit Effort for as long as they wish to cloak their powers.\n- While hidden, only a metapsion with equal or higher skill in Metapsionics can detect their abilities with their level-0 or level-2 Psychic Refinement abilities.\n- In such cases, an opposed Wis/Metapsionics roll is made between the metapsion and the investigator.\n- If the investigator wins, the cloak is pierced, while if the metapsion wins, the investigator’s Psychic Refinement remains oblivious. ",
            lvl: 1,
            action: "Augment (At Will)",
            effort: 1
        },
        {
            value: "Mindtracing",
            title: "[metapsionics,lvl-1]",
            desc: "- The metapsion can trace back the use of psionic powers they’ve noticed in their presence.\n- By Committing Effort for the scene as an Instant action, they can see and hear through the senses of a user of psychic power, gaining an intuitive awareness of their location and treating them as a visible target for purposes of their own abilities.\n- Thus, if they see someone being affected by a telepathy power with no visible source, they can use this ability to briefly share the hidden telepath’s senses.\n- If used on a target that is teleporting, they can perceive the teleporter’s view of their destination.\n- Use on a metamorphically-shaped impostor would reveal the biopsion responsible for the change, and so forth.\n- These shared senses last for only one round and do not interfere with the adept’s other actions.",
            lvl: 1,
            action: "Instant Action (Scene)",
            effort: 1
        },
        {
            value: "Synthetic Adaptation",
            title: "[metapsionics,lvl-1]",
            desc: "- This is a particularly esoteric technique, one that requires the adept to have at least Program-0 or Fix-0 skill in order to master.\n- With it, however, the metapsion has learned how to synergize with the quantum intelligence of a VI or True AI in order to apply Telepathy or Biopsion powers to their inanimate corpus.\n- Only intelligent machines can be affected, as the technique requires a sentient mind to catalyze the effect.\n- This synergy takes much of its force from the adept.\n- Any System Strain the powers might inflict must be paid by the adept rather than the target.",
            lvl: 1,
            action: "Passive",
            effort: 0
        },
        {
            value: "Neural Trap",
            title: "[metapsionics,lvl-2]",
            desc: "- The metapsion allows a hostile psychic into their mental sanctum in order to gain a later advantage.\n- When targeted by a hostile psionic power that allows a save, the metapsion may Commit Effort as an Instant action and voluntarily fail the saving throw, accepting the effect.\n- The next psychic power the user targets at that assailant then allows the victim no saving throw.\n- This technique lasts until the metapsion makes their psychic attack or reclaims their Committed Effort.\n- A hostile psychic may be affected by only one Neural Trap from a given psychic at a time.",
            lvl: 2,
            action: "Instant Action (At Will)",
            effort: 1
        },
        {
            value: "Psychic Static",
            title: "[metapsionics,lvl-2]",
            desc: "- As an Instant action, the metapsion may Commit Effort for the day to negate a perceived psychic power.\n- The psychic responsible for the effect must Commit Effort for the day as an Instant action to resist this negation, otherwise the power ends, and any action used to trigger it is wasted.\n- The PC may then Commit Effort for the day again, with each spending and counter-spending until one runs out of Effort or chooses to stop.\n- Psychic Static can be applied only once per round to any particular power.\n- The target of the Psychic Static automatically knows the position of the interfering metapsion, though other onlookers do not have any obvious way of identifying the metapsion.",
            lvl: 2,
            action: "Instant Action (Day)",
            effort: 1
        },
        {
            value: "Suspended Manifestation",
            title: "[metapsionics,lvl-2]",
            desc: "- The metapsion is capable of “hanging” a psychic power in their brain, forming the energy patterns and then suspending them in a self-sustaining loop until it’s time to trigger their release.\n- The psychic must Commit Effort for the day to hang a power, along with the Effort normally necessary to trigger it.\n- None of this Effort can be recovered until the power is expended, after which it recovers at its usual speed.\n- Activating the power is an Instant action, or an On Turn action if it allows the target a saving throw of some kind.\n- Only one ability can be held suspended at any one time.",
            lvl: 2,
            action: "Augment (Day)",
            effort: 1
        },
        {
            value: "Concert of Minds",
            title: "[metapsionics,lvl-3]",
            desc: "- As an On Turn action, the metapsion may Commit Effort and form a psychic gestalt with one or more willing psychics within three meters, including up to one other psychic per Metapsion skill level.\n- This gestalt persists as long as the Effort remains committed, regardless of the subsequent distance between psychics.\n- On their own turn, any member of the gestalt may use any power or technique known by any other member, using the other member’s skill levels as necessary and paying any Effort cost from their own pool.\n- This gestalt shares only psychic power, not thoughts or senses.\n- At the end of each round in which one or more members have used some other member’s powers or abilities on their turn of action, the metapsion must Commit Effort for the scene or the gestalt drops and cannot be re-established for the rest of the scene.",
            lvl: 3,
            action: "On Turn Action (At Will)",
            effort: 1
        },
        {
            value: "Metadimensional Friction",
            title: "[metapsionics,lvl-3]",
            desc: "- As a Main Action, the metapsion Commits Effort for the scene to create localized MES turbulence around a visible target psychic within 200 meters.\n- Each time the target Commits Effort or an NPC initiates a psychic power, they suffer 1d8 damage per Metapsionics skill level of the adept.\n- Each time the target suffers the damage they can attempt a Mental saving throw to throw off the effect.\n- It lasts no longer than the rest of the scene at most.\n- Only one application of this friction can affect a target at once.",
            lvl: 3,
            action: "Main Action (Scene)",
            effort: 1
        },
        {
            value: "Psychic Tutelage",
            title: "[metapsionics,lvl-3]",
            desc: "- An expert metapsion can modulate and temper the metadimensional energy that surges through an untrained psychic’s mind.\n- This “safety buffer” allows the novice to experiment with their abilities and gradually develop the control they need to channel their powers without causing permanent brain damage.\n- Without this technique, it is virtually impossible to turn a normal with untapped potential into a trained psychic.\n- An adept with Metapsionics-3 skill can train up to ten pupils at once.\n- One with Metapsionics-4 can train up to one hundred.\n- It requires only a week to train a potential in ways to avoid accidentally triggering their powers and suffering the damage that follows, but actually teaching them to use their powers effectively takes anywhere from one to four years depending on their natural aptitude and the availability of other psychics willing to assist the metapsion in the training process.",
            lvl: 3,
            action: "Passive",
            effort: 0
        },
        {
            value: "Surge Momentum",
            title: "[metapsionics,lvl-3]",
            desc: "- The metapsion’s abilities can be reinforced with a degree of metadimensional energy that would cause substantial damage to a less adept mind.\n- Particularly weak or unprepared minds might be completely crushed by the force of the adept’s augmented will.\n- The adept must Commit Effort for the day when using a power that normally grants its target a saving throw.\n- The target then suffers a penalty equal to the adept’s Metapsionics skill on any saving throw normally granted by the power.\n- If the target’s hit die total or character level is less than half the adept’s level, rounded up, they automatically fail their saving throw.",
            lvl: 3,
            action: "Augment (Day)",
            effort: 1
        },
        {
            value: "Flawless Mastery",
            title: "[metapsionics,lvl-4]",
            desc: "- When this technique is learned, the adept may choose one technique from any discipline they know.\n- That technique no longer requires Effort to be Committed in any way, though other techniques that augment it may still exact a cost.\n- Mastered Psychic Static, for example, can expend an effectively unlimited amount of effort.\n- If the technique has a duration based on Committed Effort then it lasts until the metapsion chooses to end it or is killed.\n- This technique may only be mastered once, though the perfected technique may be changed with a month of meditation and practice.",
            lvl: 4,
            action: "Augment (Permanent)",
            effort: -1
        },
        {
            value: "Impervious Pavis of Will",
            title: "[metapsionics,lvl-4]",
            desc: "- When this technique is learned, the metapsion must choose a discipline.\n- They then become entirely immune to unwanted powers from that discipline; they and their abilities are simply not valid targets for purposes of that discipline’s powers unless the adept chooses to be affected.\n- By Committing Effort for the day as an Instant action, they can extend this immunity for a scene to all allies within 50 meters.\n- This technique may be learned more than once, and any shared protection applies to all disciplines negated by the adept.",
            lvl: 4,
            action: "Passive + Instant Action (Day)",
            effort: 1
        }
        
    ]
}];

// List of Physical Items
var equipmentList = [{
    "Pick Item":[
        {
            value: "-",
            name: "empty",
            desc: "",
            cost: 0,
            enc: 0,
            tech: 0,
            ac: 0,
            shield: 0
        }
        ],
        "Power Cells":[
        {
            value: "Ammo (20 rounds)",
            title: "[Ammo]",
            desc: "- A few worlds are too primitive or too resource-poor to manufacture ammunition, but the vast majority of worlds provide cartridges in almost every conceivable calibre and make.\n- Most local gunsmiths can load ammunition to any specification required by a buyer.",
            cost: 10,
            enc: 1,
            tech: 2
        },
            {
            value: "Ammo (missile)",
            title: "[Ammo]",
            desc: "- Some characters might have reason to pack along a man-portable rocket launcher or have one mounted on their favourite grav-car.\n- Heavy weapons and their ammunition are usually outlawed for civilians in most worlds, but this price is for locales where missiles can be bought.",
            cost: 50,
            enc: 1,
            tech: 3
        },
            {
            value: "Type A Cell",
            title: "[Ammo, Power]",
            desc: "- Power cells are small cylindrical objects designed to take and hold electrical charges.\n- Type A cells are usually used for personal equipment.\n- Recharging requires 30 min.",
            cost: 10,
            enc: 1,
            tech: 4
        },
            {
            value: "Type B Cell",
            title: "[Ammo, Power]",
            desc: "- Power cells are small cylindrical objects designed to take and hold electrical charges.\n- Type B cells are usually used for vehicles and heavy gear.\n- Recharging requires 30 min.",
            cost: 100,
            enc: 1,
            tech: 4
        },
        {
            value: "Solar Recharger",
            title: "[Ammo, Power]",
            desc: "- This recharger unfolds into a 2 meter by 2 meter square field of solar cells.\n- Granted a primary star of roughly Earth-like intensity, it can recharge one type A power cell per day.",
            cost: 500,
            enc: 3,
            tech: 4
        },
        {
            value: "Telekinetic Recharger",
            title: "[Ammo, Power]",
            desc: "- While this device assumes the presence of a trained telekinetic, it isn’t strictly psi-tech, as its operation is quite simple.\n- A telekinetic user pushes a resistance bar within the generator, causing a flow of electricity to recharge an attached power cell.\n- Any telekinetic with Telekinesis- 1 skill or better can recharge a cell with fifteen minutes of concentration.\n- In an emergency, a character with at least Strength 10 can operate the generator manually, though they need to succeed on a difficulty 8 Con/Exert skill check in order to keep up the pace for an hour.\n- Failure means that the character must rest for at least an hour before trying again.\n- The generator can charge one type-A power cell at a time.",
            cost: 250,
            enc: 2,
            tech: 4
        }
    ],
    "Communications":[
        
            {
            value: "Comm Server",
            title: "[Communications]",
            desc: "- A powerful base unit for providing communications without comsats.\n- The server provides service between up to three dozen compads within 300 kilometres of the unit.\n- Server usage can be locked to specific com-pads, and all transmissions are heavily encrypted.\n- A comm server can function for several months on a type B cell.",
            cost: 1000,
            enc: 3,
            tech: 4,
        },
        {
            value: "Compad",
            title: "[Communications]",
            desc: "- One of a host of different hand-held portable communications devices.\n- Most TL4 worlds have global comm coverage, but primitive worlds render these devices useless without a nearby comm server to provide connectivity.",
            cost: 100,
            enc: 0,
            tech: 4,
        },
        {
            value: "Field Radio",
            title: "[Communications]",
            desc: "- On worlds too primitive to have a comm grid, adventurers often fall back on these headset-mounted field radios.\n- A single type A cell powers them for months of use.\n- Urban or rugged terrain limits their range to about two kilometres, while flat plains give a maximum range of thirty kilometres.\n- Someone with at least Program-0 skill can use the radio’s shortwave functionality to communicate with a prepared target at continental distances if given ten minutes for tuning.",
            cost: 200,
            enc: 1,
            tech: 4,
        },
        {
            value: "Translator Torc",
            title: "[Communications]",
            desc: "- Each translator torc is keyed for two languages, and will automatically translate what it hears in one into speech in the other.\n- The translations are eccentric in many cases, and there is always a several-second delay between each statement and its translation.\n- Any attempts to exert social skills or Charisma through a translator torc suffer a -2 skill check penalty.\n- The torc is powered by one type-A power cell, which lasts for one week of regular use.",
            cost: 200,
            enc: 0,
            tech: 4,
        },
        
    ],
    "Field Equipment":[
        {
            value: "Atmofilter",
            title: "[field equipment, survival, oxygen]",
            desc: "- This face mask can filter out most atmospheric toxins.\n- Attaching a standard vac-suit oxygen bottle to a belt-mounted feed will also supply a breathable atmosphere for up to six hours.",
            cost: 100,
            enc: 1,
            tech: 4
        },
        {
            value: "Backpack",
            title: "[field equipment, container]",
            desc: "- A worn backpack counts as a readied item, though objects stowed inside it still require the usual round to dig free.\n- Characters without backpacks or similar carrying devices might have difficulty justifying the hauling of large amounts of gear.",
            cost: 50,
            enc: 0
        },
        {
            value: "Binoculars",
            title: "[field equipment, vision, chargeA]",
            desc: "- Standard 7x50 binoculars.\n- TL4 versions are available that have integral low-light optics and up to 25x150 power.\n- TL 4 binocs cost 200 credits and require a type A power cell for up to a week of regular usage.",
            cost: 200,
            enc: 0
        },
        {
            value: "Climbing Harness",
            title: "[field equipment, elevation]",
            desc: "- A collection of straps, ropes, pitons, and other climbing aids that grant a +1 bonus on any Exert climbing skill test.\n- Using a climbing harness is noisy, and any Sneak skill checks while climbing with one suffer a -2 penalty.",
            cost: 50,
            enc: 1,
            tech: 3
        },
        {
            value: "Glowbug",
            title: "[field equipment, vision, chargeA]",
            desc: "- A palm-sized disc that can adhere to any non-porous surface.\n- When turned on, it emits white light, illuminating everything within ten meters for twenty-four hours.\n- A hundred glowbugs can be recharged off a single type A cell.",
            cost: 5,
            enc: 0,
            tech: 3
        },
        {
            value: "Grapnel Launcher",
            title: "[field equipment, elevation, chargeA]",
            desc: "- This launcher fires a rope up to forty meters.\n- The rope can bear up to a metric ton of weight, though extremely heavy weights or a precarious hit can cause the grapnel to pull free.\n- A Type A power cell fuels six shots from a launcher.",
            cost: 200,
            enc: 1,
            tech: 3
        },
        {
            value: "Grav Chute",
            title: "[field equipment, elevation, one-use]",
            desc: "- When this cylinder is strapped to a person or object and activated, it smoothly modulates falling speeds for up to 1000 meters.\n- The chute can safely slow up to 300 kilos of weight.\n- TL5 versions can operate from orbital heights and cost 1,000 credits, where they can be found at all.\n- Both versions burn out after one use.",
            cost: 1000,
            enc: 1,
            tech: 5,
        },
        {
            value: "Grav Harness",
            title: "[field equipment, vision, chargeB]",
            desc: "- This advanced gravitic harness allows clumsy flight at a rate of 20 meters per round as a Main Action.\n- It requires a Type B power cell to fuel it, and the miniaturized electronics are rapacious, consuming the cell in five minutes of operation.\n- It can lift up to 200 kilos.",
            cost: 5000,
            enc: 3,
            tech: 5
        },
        {
            value: "Instapanel",
            title: "[field equipment, vision, one-use, chargeA]",
            desc: "- In its compressed form, an instapanel is a two-kilo cube of ceraplast five centimetres on aside.\n- When a type A power cell is inserted in the cube’s side, it immediately expands to an opaque, waterproof ceraplast sheet 2 meters on each side and a centimetre thick.\n- Five minutes later the ceraplast hardens into a tough, rigid shape, but until then it can be folded or bent by hand.\n- Instapanels can be bonded to one another with a meta-tool or a toolkit.\n- Breaking an instapanel requires inflicting at least twelve points of damage on it.",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Low-Light Goggles",
            title: "[field equipment, vision, chargeA]",
            desc: "- These goggles provide a monochrome but serviceable view out to the wearer’s normal visual distance, provided that there is at least any illumination available at all.\n- A type-A power cell will operate these goggles for a week.",
            cost: 200,
            enc: 1,
            tech: 3
        },
        {
            value: "Navcomp",
            title: "[field equipment, navigation]",
            desc: "- A combination of low-tech compasses, auto-mappers, astronomic charts, and gyroscopes packed into a flat, one-kilo case.\n- A character with a navcomp will never get lost on worlds with GPS satellites.\n- They can also make a crude but a serviceable automatic map of all buildings or landscapes they travel through.\n- Other terrestrial navigation skill checks are made at a +1 bonus.",
            cost: 500,
            enc: 1,
            tech: 4
        },
        {
            value: "Portabox",
            title: "[field equipment, container, one-use, chargeA]",
            desc: "- A small cube of ceraplast is attached to an electronic keycard.\n- When a type A power cell is inserted, the portabox immediately unfolds into a rigid locker with 1.5 x 1 x 1-meter dimensions.\n- The portabox is air-tight and has a simple electronic lock that can only be opened with the keycard or a successful difficulty 8 Sneak or Fix skill check.\n- Failing the check will cause the lock to short-circuit and seal the box until it can be cut open with a meta-tool or broken open with twenty points of damage.",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Pressure Tent",
            title: "[field equipment, survival, shelter, chargeA]",
            desc: "- This tent maintains a breathable atmosphere, tolerable temperature and serviceable sleeping quarters for up to five very friendly occupants.\n- Advanced filtration and cracking tech allow a single standard vacc suit oxygen tank to provide breathable air for the occupants for up to 24 hours.\n- The tent requires a type A power cell for each day in which this filter is employed.",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Rations (1 day)",
            title: "[field equipment, consumable, food, survival]",
            desc: "- Dried or otherwise preserved foodstuffs sufficient for one day.\n- If water is not otherwise available, add another item’s worth of encumbrance for the water necessary for a person’s daily needs.",
            cost: 5,
            enc: 1,
            tech: 1
        },
        {
            value: "Rope (20m)",
            title: "[field equipment, survival, elevation]",
            desc: "- Light and sturdy.\n- A meta-tool can be used to cut and join the synthetics used in TL4 rope, which counts as one encumbrance item per 40 meters and costs 40 credits.",
            cost: 40,
            enc: 1,
            tech: 4
        },
        {
            value: "Scout Report",
            title: "[field equipment, survival, intel]",
            desc: "- A collation of survey scans and merchant reports on a particular lost world or isolated colony.\n- Scouting reports are available for all but the most unknown worlds and provide maps, basic information, and note any critical cultural taboos.",
            cost: 200,
            enc: 0,
            tech: 4
        },
        {
            value: "Survey Scanner",
            title: "[field equipment, navigation, intel]",
            desc: "- A multipurpose scanner that can take atmospheric and gravitic readings, provide basic chemical analysis of samples of up to one cubic centimeter in size, and record up to two hundred hours of video information or ten times that amount of audio.\n- Know skill checks are necessary for any but the most basic analysis.",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Survival Kit",
            title: "[field equipment, survival, chargeA]",
            desc: "- A standard belt-worn kit with firelighter, water filter, three thermal flares, knife, thermal blanket, a brightly-coloured 3 x 3-meter waterproof tarp, a glow bug, and a radio beacon that can transmit a distress signal up to fifty kilometres for one month on the included type A power cell.\n- Survival kits sold on a particular world will usually also include a small booklet on specific dangers or edible organics.\n- Possession of a survival kit grants a +1 to all relevant Survive skill checks, assuming its contents are helpful on a given planet.\n- Survival kits are well-organized and count as only one item for encumbrance purposes.",
            cost: 60,
            enc: 1,
            tech: 4
        },
        {
            value: "Telescoping Pole",
            title: "[field equipment]",
            desc: "- Retracting to a 30cm baton, this pole extends and locks into a 3.048-meter extension that can bear as much as a thousand kilograms of weight or serve as a makeshift club.",
            cost: 10,
            enc: 0,
            tech: 4
        },
        {
            value: "Thermal Flare",
            title: "[field equipment, one-use, navigation, survival]",
            desc: "- If triggered in one mode, the flare burns with a bright white light for two hours, illuminating up to twenty meters around the holder.\n- If the guidance fins are extended first, the flare launches up to 200 meters and explodes in a bright white flash.\n- A launched flare does 1d6 damage to anyone it hits, though the clumsy flight gives a -4 penalty on any attempts to hit something with it.",
            cost: 5,
            enc: 0,
            tech: 3
        },
        {
            value: "Trade Goods",
            title: "[field equipment, merchandise, valuables]",
            desc: "- Glowbugs, ceramic firelighters, antibiotics, ceraplast tools, and the other fruits of a TL4 civilization that might be valuable on more primitive worlds.\n- A kilo of trade goods can usually be traded for at least a hundred credits worth of local products on more primitive worlds that are not well-served by interstellar merchants.\n- The profit margin shrinks rapidly as interstellar trade becomes more common, and there is always the difficulty of finding local products that are actually worth a merchant’s journey.",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Trade Metals",
            title: "[field equipment, merchandise, valuables]",
            desc: "- The fruit of common TL4 asteroid mining, trade metals include gold, platinum, artificial gemstones, and other substances precious on many lost worlds and trivially valuable on spacefaring ones.\n- A kilo worth of trade metals can be exchanged for as much as a thousand credits worth of local products on metal-poor worlds isolated from interstellar trade.\n- Markets flood rapidly, however, and it usually doesn’t take more than a few merchant trips to persuade the locals to demand trade goods or credits.",
            cost: 10,
            enc: 1,
            tech: 4
        },
        {
            value: "Vacc Fresher",
            title: "[field equipment, vacuum, oxygen, chargeA]",
            desc: "- This three-kilo tube filters and compresses the atmosphere to refill vacc suit oxygen tanks.\n- It can extract oxygen from any atmosphere which contains it, even in the form of carbon dioxide.\n- Refilling a standard vacc suit tank requires ten minutes of operation and consumes one type A power cell.\n- Most vacc freshers are also equipped with an emergency hand crank power source, though it requires at least two hours of cranking.",
            cost: 400,
            enc: 1,
            tech: 4
        },
        {
            value: "Vacc Skin",
            title: "[field equipment, vacuum, oxygen, chargeA]",
            desc: "- A more advanced TL5 version of the vacc suit, this skin-tight suit can be worn as a readied item in conjunction with armour, though it grants no Armor Class bonus itself.\n- It requires no oxygen tank, automatically cracking and recycling the wearer’s respiration, and can even recycle the wearer’s bodily waste into drinkable water if necessary.\n- Vacc skins apply no penalty to hit rolls or skill checks for wearers.\n- It suffers tears in the same way as a normal vacc suit and requires a type A power cell for every 24 hours of operation.",
            cost: 1000,
            enc: 1,
            tech: 5
        },
        {
            value: "Vacc suit",
            title: "[field equipment, vacuum, oxygen, chargeA]",
            desc: "- The standard TL4 vacc suit is designed to allow the wearer to survive in both hard vacua and on most inhospitable planetary surfaces.\n- The suit protects against ordinary levels of cosmic radiation and provides a temperature-controlled atmosphere.\n- Vacc suits are equipped with radios that have a 10km range.\n- A vacc suit oxygen tank weighs 1 encumbrance, is included with the weight of the suit, and functions for six hours.\n- Vacc suits are cumbersome and apply a -2 penalty to all hit rolls and skill checks that require movement.\n- Those with at least a month of zero-gee experience can ignore this penalty.\n- No armour can be worn with a vac suit, though the suit itself grants AC 13 to its wearers.\n- A vacc suit requires one type-A power cell for every twelve hours of operation.\n- Vacc suits have a self-healing exterior that can seal the puncture wounds caused by bullets, arrows, or energy beams, but a strike from an edged weapon can overwhelm the repair system.\n- If a character with 10 or fewer hit points is struck by an edged weapon, there is a 50% chance the suit is torn.\n- Suits are equipped with emergency repair patches, but it requires a Main Action to apply one.\n- Exposure to vacuum is described on page 58.",
            cost: 100,
            enc: 2,
            tech: 4
        }
        
        
    ],
    "Computing Gear":[
        {
            value: "Black Slab",
            title: "[Computing, Hacking]",
            desc: "- While a “black slab” appears to be a normal data slab to casual examination, these devices are packed with intrusion-optimization hardware and integral line tapping tools.\n- They function as a meta-tool for purposes of accessing data lines and grant a +1 bonus to all hacking attempts made with them.\n- They are also quite illegal in most worlds, available only from black market dealers and private sales from hackers.",
            cost: 10000,
            enc: 1,
            tech: 4
        },
        {
            value: "Data Phase Tap",
            title: "[Computing, Hacking]",
            desc: "- This handheld device is normally illegal outside the possession of licensed data line repair technicians.\n- The tap can detect data lines within five meters through up to ten centimetres of ordinary walls, and can generate an energy manipulation field that allows tapping that data line for hacking purposes without physically damaging the wall.",
            cost: 5000,
            enc: 1,
            tech: 4
        },
        {
            value: "Data Protocol",
            title: "[Computing, Hacking, Intel]",
            desc: "- Not so much a device as a collection of standard manuals on a world’s particular data formats and security methodologies.\n- The price listed here is for black-market manuals on worlds where this information is rigidly restricted.\n- On less paranoid planets, the equivalent information can be acquired for free.",
            cost: 1000,
            enc: 0,
            tech: 4
        },
        {
            value: "Dataslab",
            title: "[Computing]",
            desc: "- A palm-sized computing device that can unfold into a thin slab roughly one-third of a meter aside.\n- It can perform all the functions of a compad or handheld computer and can communicate wirelessly with nearby devices.",
            cost: 300,
            enc: 1,
            tech: 4
        },
        {
            value: "Line Shunt",
            title: "[Computing, Hacking]",
            desc: "- These palm-sized discs are roughly one centimetre in thickness, with an adhesive side that will stick to virtually anything and a polychromatic phased compound on its shell which will shift colour to blend with its surroundings.\n- One or more line shunts must be applied at specific locations within a site to access the more well-defended varieties of computerized systems.\n- Shunts employ phased energy manipulation tech, and so do not need to be directly in contact with a data line but only within a few centimetres.\n- Line shunts are single-use, and keep functioning until removed.",
            cost: 300,
            enc: 0,
            tech: 4
        },
        {
            value: "Remote Link Unit",
            title: "[Computing, Hacking]",
            desc: "- These data broadcast link units have been preloaded with one-time pad security measures, advanced stealth circuitry, and sophisticated data progression algorithms.\n- Two of these links can allow a user to maintain contact with a remote data storage unit.\n- The connection is too “stiff” to allow for easy hacking, however, and it applies a -2 penalty to any attempts to hack through it.\n- Professional-grade security systems often have means to detect the broadcast of a remote link unit.",
            cost: 250,
            enc: 1,
            tech: 4
        },
        {
            value: "Stileto Charge",
            title: "[Computing, Hacking]",
            desc: "- These ancient Mandate-era polymorphic intrusion charges were originally made to allow Mandate agents to easily overcome primitive colonial data security measures.\n- Each charge is a small interface plug the size of a human thumb.\n- When used as part of a hack against a TL4 system, it causes the skill check to automatically succeed regardless of the difficulty.\n- Without line shunts, however, the duration of the hack is still no more than the usual 1d4 rounds plus the hacker’s Program skill.\n- These devices are single-use and are prized so highly that they are almost always unavailable for conventional purchase.\n- Favours to the right people and the looting of Mandate remnants are the only normal ways to acquire these devices.",
            cost: "N/A",
            enc: 1,
            tech: 5
        },
        {
            value: "Storage Unit",
            title: "[Computing]",
            desc: "- While conventional data slabs have ample space to hold any reasonable amount of data, sometimes a party needs to store or acquire a truly huge dataset.\n- This standard TL4 storage unit is a portable but clumsy case hardened against anything short of intentional damage with a firearm, capable of interfacing with a wide variety of hardware to receive and upload data.\n- A single storage unit can hold a tremendous amount of data that has been carefully compressed and optimized for it.\n- If the user is simply ripping a database off a network and stuffing it into the unit, it can absorb up to a small corporation’s complete files.",
            cost: 500,
            enc: 3,
            tech: 4
        },
        {
            value: "Tightbeam Link Unit",
            title: "[Computing, Hacking]",
            desc: "- Much like a remote link unit, a tightbeam unit uses a laser to connect via line-of-sight transmission.\n- Unlike a remote link unit, there’s almost no chance for a conventional security system to detect this link, but it requires that the infiltrators get a clear line of sight between the unit and the receiving end.\n- Commercial satellite reception units can be employed for skyward aiming at 500 credits/hour if a second land unit is unavailable, but indoor use is impossible.",
            cost: 1000,
            enc: 1,
            tech: 4
        }
    ],
    "Pharmaceuticals":[
        {
            value: "Bezoar",
            title: "[Drug, Consumable, Heal-1]",
            desc: "- A complex antibiotic cocktail, Bezoar is an effective default treatment for a wide variety of infectious diseases.\n- When applied to a sufferer, roll 1d6; on a 1, this victim cannot be helped by Bezoar, while otherwise the affliction is cured within 24 hours.\n- Each application of Bezoar adds 1 System Strain to the target, and it cannot cure cancers, bioweapons, or congenital diseases.",
            cost: 200,
            enc: 0,
            tech: 4
        },
        {
            value: "Brainwave",
            title: "[Drug, Consumable, Heal-2]",
            desc: "- This psi-tech drug requires advanced TL5 facilities to compound, and the few remaining doses from pre-Silence periods are rarely available on the open market.\n- Application of Brainwave gives a psychic 2 extra maximum Effort for one hour.\n- At the end of that hour, they suffer 4 points of System Strain.\n- If their Strain is maximized by this, they go unconscious for one hour.\n- Only one dose can be active at a time.",
            cost: 1000,
            enc: 0,
            tech: 5
        },
        {
            value: "Hush",
            title: "[Drug, Consumable, Heal-0]",
            desc: "- An extremely heavy neuro-tranquilizer, Hush leaves the subject awake and responsive to simple, untaxing commands.\n- They cannot fight or communicate while affected by Hush, but will walk, eat, sit, and perform simple actions as directed by the last person to speak to them.\n- A Hush dose lasts for an hour plus three per Heal level of the person applying the stim, and the subject retains no memories while under the effect.\n- A subject must be immobilized or willing to be affected by Hush; violent physical movement immediately after application disrupts the neurological effects.",
            cost: 200,
            enc: 0,
            tech: 4
        },
        {
            value: "Lift",
            title: "[Drug, Consumable, Heal-0]",
            desc: "- A Lift stim augments and amplifies the body’s natural response to physical injury and exhaustion.\n- This boost speeds natural recovery drastically and heals 1d8 plus the user’s Heal skill in hit points after five minutes of rest.\n- Lift stims do not work on PCs who are mortally wounded; they need to be stabilized before the Lift can help them, though application to a stabilized target will get them back on their feet and active again.\n- Each application adds 1 System Strain to the target.\n- Each additional application of Lift to a target the same day increases the minimum Heal skill needed by 1.",
            cost: 50,
            enc: 0,
            tech: 4
        },
        {
            value: "Psych",
            title: "[Drug, Consumable, Heal-N/A]",
            desc: "- A military drug duplicated in rougher form by many street chemists, Psych fills the user with an intense sense of confidence and reckless courage.\n- Unfortunately, it also cripples their judgment regarding danger.\n- A person affected by Psych immediately gains a Morale score of 12 and a +1 bonus on all skill checks, but will ignore cover during combat and cannot decide not to attempt a skill check after learning its difficulty.\n- The effect lasts fifteen minutes, adds 1 System Strain to the user, and is highly psychologically addictive.",
            cost: 25,
            enc: 0,
            tech: 4
        },
        {
            value: "Pretech Cosmetic",
            title: "[Drug, Consumable, Heal-N/A]",
            cost: 1000,
            enc: 0,
            tech: 5
        },
        {
            value: "Reverie",
            title: "[Drug, Consumable, Heal-1]",
            desc: "- This very dangerous combat drug completely subdues the subject’s fear centres and adrenaline production, leaving them perfectly calm and relaxed even in the midst of mortal danger.\n- Their reaction speed is much slower as a consequence, and they may act only on even-numbered combat rounds; so on the second, fourth, and sixth rounds and so forth.\n- Any damage they suffer is doubled as well due to their lack of vigilance.\n- Their perfect calm allows them to shoot as if on the target range, however, and they can make Dex/Shoot skill checks to hit a target instead of hit rolls; the difficulty is 7 at point-blank, 9 at normal ranges, and 11 at long ranges for the weapon.\n- The target’s Armor Class is ignored.\n- Melee attacks made under Reverie always hit.\n- Reverie lasts for ten minutes and adds 2 System Strain to the target.",
            cost: 100,
            enc: 0,
            tech: 4
        },
        {
            value: "Squeal",
            title: "[Drug, Consumable, Heal-1]",
            desc: "- This “truth serum” is unreliable but still one of the best available options for field interrogations.\n- The subject must be immobilized or willing to be affected by it.\n- For five minutes afterwards, they will be unable to avoid answering questions about facts known to them; they will be unable to exercise anything resembling a hypothesis or a judgment, but they will answer specific questions about facts known to them truthfully.\n- Unwilling victims can attempt a Physical saving throw; on a success, they can simply refuse to speak about one particular topic of their choice.\n- Targets pass out for 1d6 hours after the drug wears off and are immune to it for a week thereafter.",
            cost: 300,
            enc: 0,
            tech: 4
        },
        {
            value: "Tsunami",
            title: "[Drug, Consumable, Heal-1]",
            desc: "- An emergency combat stim used to juice certain expendable soldiers before an assault, Tsunami fills them with a reckless disregard for pain and an intense aggressiveness.\n- The short effect duration and difficult application limit its wider use, however.\n-Subjects gain a Morale score of 12, 10 extra hit points for ten minutes and a +2 bonus on all hit rolls.\n- At the end of the duration, they immediately lose those 10 hit points, which may leave them mortally wounded.\n- Each application adds 2 System Strain to the target.",
            cost: 50,
            enc: 0,
            tech: 4
        }
    ],
    "Tools and Medical":[
        {
            value: "Bioscanner",
            title: "[tools, medical]",
            desc: "- While an untrained user can use this tool to discern internal bleeding, gross physical distress, or toxins in a plant or animal, it requires Heal-0 skill to use this tool to its fullest.\n- Such operators can use the bioscanner for a full spectrum of diagnosis and DNA sequencing achievable in minutes.\n- One type A power cell will power it for up to twenty-four hours of regular usage.",
            cost: 300,
            enc: 1,
            tech: 4
        },
        {
            value: "Lazarus Patch",
            title: "[tools, medical]",
            desc: "- A vital tool for adventurers, the lazarus patch is a heavy compress laced with antibiotics, coagulants, system stabilizers, plasma, and a oneshot diagnostic suite.\n- If the patch is applied to a character that has fallen to 0 hit points, the user can make an Int/Heal or Dex/Heal skill check against difficulty 6 to stabilize the subject.\n- The more time between injury and application, the less chance the patch has to work.\n- Each round after the first, an additional -1 penalty is applied to the skill check.\n- The patch is no use after six rounds.\n- If the medic fails the first skill check, they can keep trying the check once per round until the victim is revived or time runs out.\n- Lazarus patches are of no use on victims that have died of disease, poison, or have been mangled beyond surgical repair by Heavy weapons or similar trauma.\n- Only one patch can be applied to a victim.\n- Revived victims are critically wounded until sufficient medical help has been tendered; see the Systems chapter for details.",
            cost: 30,
            enc: 1,
            tech: 4
        },
        {
            value: "Medkit",
            title: "[tools, medical]",
            desc: "- Containing a broad supply of pharmaceuticals, spray bandages, glue sutures, and a succinct handbook of injury care, the medkit is designed for handling sudden and drastic injuries.\n- It also contains all the necessary tools for providing long-term recuperative care for critically injured characters.\n- After each day of granting long-term recuperative care, roll 2d6 per patient treated; on a 12, the kit has run out of some vital pharmaceutical and has become useless.",
            cost: 100,
            enc: 2,
            tech: 4
        },
        {
            value: "Metatool",
            title: "[tools, repair]",
            desc: "This wrist-mounted housing contains a myriad of small, useful tools designed to handle the widest possible range of technical needs. While a meta-tool is too limited to handle major jobs, it is usually sufficient to manage jury-rigged repairs and temporary fixes until the tech has time to apply a larger wrench to the problem.",
            cost: 200,
            enc: 1,
            tech: 4
        },
        {
            value: "Spare Parts",
            title: "[repair]",
            desc: "- This is a general category for a number of small TL4 components and repair materials.\n- While a simple toolkit or meta-tool is often enough to fix a damaged object, severely broken devices may need replacement parts.\n- Rather than keep a catalog of bits and pieces, a technician can simply bring along one or more units of spare parts, subtracting one whenever the GM decides that a repair effort requires more than existing salvage can support.\n- A unit of spare parts can also be used to jury-rig some basic, uncomplicated tool or weapon from the equipment list with ten or fifteen minutes of assembly and at least Fix-0 skill.\n- Such bodged devices rarely last longer than one scene.",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Tailored Antiallergens",
            title: "[tools, medical]",
            desc: "- A dose of tailored antiallergens can be used to render a local world’s organics largely edible by humans and its atmosphere breathable without severe allergic reactions.\n- While many worlds have been seeded with Terran life forms or have produced organics that are edible by humans, others are toxic without the appropriate chemical augmentation.\n- A dose of these antiallergens lasts for twenty-four hours.",
            cost: 5,
            enc: 0,
            tech: 4
        },
        {
            value: "Postech Toolkit",
            title: "[tools, repair]",
            desc: "- Containing a wide range of necessary tools for a particular skill set, toolkits can handle almost any job that doesn’t require a full-scale shop or lab.\n- A standard post-tech toolkit can handle electronics, small welding jobs, and basic repair on ordinary TL4 goods.",
            cost: 300,
            enc: 3,
            tech: 4
        },
        {
            value: "Pretech Toolkit",
            title: "[tools, repair]",
            desc: "- Containing a wide range of necessary tools for a particular skill set, toolkits can handle almost any job that doesn’t require a full-scale shop or lab.\n- More sophisticated pre-tech tools are necessary for working on advanced TL5 artefacts, and the tools themselves are very rare and difficult to obtain.",
            cost: 1000,
            enc: 1,
            tech: 5
        }
        
    ]
}];

// List of artificial shell bodies
var shellList = [{
    "Pick Item":[
        {
            value: "-",
            name: "empty",
            desc: "",
            cost: 0,
            enc: 0,
            tech: 0,
            ac: 0,
            shield: 0
        }
        ],
        "Armour":[
        {
        value: "Primitive Shield",
            title: "[armour]",
            ac: 13,
            shield: 1,
            cost: 10,
            enc: 2,
            tech: 0,
            desc: "- Primitive shields are usually of wood or stretched hide.\n- Grants a base AC of <br>13 (if the bearer’s AC is already equal or better, the shield simply grants a +1 AC bonus).\n- Ignored by all weapons that ignore primitive armour.\n- Renders the bearer immune to the first instance of melee Shock damage they take each round, assuming the shield is effective against the weapon being used."
        },
            {
                value: "Primitive Leather Armour",
                title: "[armour]",
                ac: 13,
                shield: 0,
                cost: 10,
                enc: 1,
                tech: 0,
                desc: "While such armour can be very effective in protecting against primitive weaponry, it is useless against advanced TL4 melee weapons and firearms of all kinds. Against these weapons, it is treated as AC 10. Note that some planets have native flora or fauna capable of naturally producing extremely effective armour materials, ones not susceptible to this limitation."
            },
            {
                value: "Primitive Half-Plate Armour",
                title: "[armour]",
                ac: 15,
                shield: 0,
                cost: 50,
                enc: 1,
                tech: 1,
                desc: "While such armour can be very effective in protecting against primitive weaponry, it is useless against advanced TL4 melee weapons and firearms of all kinds. Against these weapons, it is treated as AC 10. Note that some planets have native flora or fauna capable of naturally producing extremely effective armour materials, ones not susceptible to this limitation."
            },
            {
                
            }
    ]
}];

// List of Armours
var armourList = [{
    "Pick Item":[
        {
            value: "-",
            name: "empty",
            desc: "",
            cost: 0,
            enc: 0,
            tech: 0,
            ac: 0,
            shield: 0
        }
        ],
        "Armour":[
        {
        value: "Shield",
            title: "[Primitive, TL0]",
            ac: 13,
            shield: 1,
            cost: 10,
            enc: 2,
            tech: 0,
            desc: "- Primitive shields are usually of wood or stretched hide.\n- Grants a base AC of <br>13 (if the bearer’s AC is already equal or better, the shield simply grants a +1 AC bonus).\n- Ignored by all weapons that ignore primitive armour.\n- Renders the bearer immune to the first instance of melee Shock damage they take each round, assuming the shield is effective against the weapon being used."
        },
            {
                value: "Leather Armour",
                title: "[Primitive, TL0]",
                ac: 13,
                shield: 0,
                cost: 10,
                enc: 1,
                tech: 0,
                desc: "While such armour can be very effective in protecting against primitive weaponry, it is useless against advanced TL4 melee weapons and firearms of all kinds. Against these weapons, it is treated as AC 10. Note that some planets have native flora or fauna capable of naturally producing extremely effective armour materials, ones not susceptible to this limitation."
            },
            {
                value: "Half-Plate Armour",
                title: "[Primitive, TL1]",
                ac: 15,
                shield: 0,
                cost: 50,
                enc: 1,
                tech: 1,
                desc: "While such armour can be very effective in protecting against primitive weaponry, it is useless against advanced TL4 melee weapons and firearms of all kinds. Against these weapons, it is treated as AC 10. Note that some planets have native flora or fauna capable of naturally producing extremely effective armour materials, ones not susceptible to this limitation."
            },
            {
                value: "Full-Plate Armour",
                title: "[Primitive, TL1]",
                ac: 17,
                shield: 0,
                cost: 100,
                enc: 2,
                tech: 1,
                desc: "While such armour can be very effective in protecting against primitive weaponry, it is useless against advanced TL4 melee weapons and firearms of all kinds. Against these weapons, it is treated as AC 10. Note that some planets have native flora or fauna capable of naturally producing extremely effective armour materials, ones not susceptible to this limitation."
            },
            {
                value: "Warpaint",
                title: "[Street, TL4]",
                ac: 12,
                shield: 0,
                cost: 300,
                enc: 0,
                tech: 4,
                desc: "- TL4 gear one can wear in public without social repercussions.\n- Such armor is disguised as ordinary street clothing or is so light as to be wearable under an ordinary outfit.\n- PCs can wear street armor on most worlds without incurring any trouble from authorities.\n- Scrap-built street harness of gangers, cult enforcers, street toughs, and other marginal sorts with little money but much need for protection. Most warpaint is fashioned of scrounged scraps of TL4 materials that are exceptionally tough or rigid, filled out with gang colors, body paint, intimidating tattoos, and the usual threatening grimace.\n- It is often exceedingly impractical but inspirational to its wearer; an NPC in warpaint that is meaningful to them gains a +1 Morale bonus."
            },
            {
                value: "Armoured Undersuit",
                title: "[Street, TL4]",
                ac: 13,
                shield: 0,
                cost: 600,
                enc: 0,
                tech: 4,
                desc: "- TL4 gear one can wear in public without social repercussions.\n- Such armor is disguised as ordinary street clothing or is so light as to be wearable under an ordinary outfit.\n- PCs can wear street armor on most worlds without incurring any trouble from authorities.\n- Skin-tight bodysuit woven of advanced TL4 fibers with exceptional shock-activated rigidity and impact dispersion capabilities.\n- Transparent panels allow for it to be worn with almost any outfit without drawing notice or being detected without a close tactile examination."
            },
            {
                value: "Secure Clothing",
                title: "[Street, TL4]",
                ac: 13,
                shield: 0,
                cost: 300,
                enc: 1,
                tech: 4,
                desc: "- TL4 gear one can wear in public without social repercussions.\n- Such armor is disguised as ordinary street clothing or is so light as to be wearable under an ordinary outfit.\n- PCs can wear street armor on most worlds without incurring any trouble from authorities.\n- Skin-tight bodysuit woven of advanced TL4 fibers with exceptional shock-activated rigidity and impact dispersion capabilities.\n- Comes in assorted styles and fashions ranging from casual street wear to haute couture.\n- Normal fabrics and components are replaced with light, flexible armor components that are only slightly hindering to the wearer.\n- Only close tactile examination can distinguish secure clothing from ordinary couture.\n- Transparent panels allow for it to be worn with almost any outfit without drawing notice or being detected without a close tactile examination."
            },
            {
                value: "Armoured Vacc Suit",
                title: "[Street, TL4]",
                ac: 13,
                shield: 0,
                cost: 400,
                enc: 2,
                tech: 4,
                desc: "- TL4 gear one can wear in public without social repercussions.\n- Such armor is disguised as ordinary street clothing or is so light as to be wearable under an ordinary outfit.\n- PCs can wear street armor on most worlds without incurring any trouble from authorities.\n- Skin-tight bodysuit woven of advanced TL4 fibers with exceptional shock-activated rigidity and impact dispersion capabilities.\n- Aside from functioning as a normal vacc suit, it has only half the usual chance to tear when hit by an edged weapon or suit ripper."
            },
            {
                value: "Deflector Array",
                title: "[Street, TL5]",
                ac: 18,
                shield: 0,
                cost: 30000,
                enc: 0,
                tech: 5,
                desc: "- TL5 gear one can wear in public without social repercussions.\n- Such armor is disguised as ordinary street clothing or is so light as to be wearable under an ordinary outfit.\n- PCs can wear street armor on most worlds without incurring any trouble from authorities.\n- Consists of several force field nodes worn beneath ordinary clothing.\n- The invisible shield it produces flares only when dangerous energies or impact is impending, glowing a brief, bright blue as it deflects the attack."
            },
            {
                value: "Force Pavis",
                title: "[Street, TL5]",
                ac: 15,
                shield: 1,
                cost: 10000,
                enc: 1,
                tech: 5,
                desc: "- Cannot be effectively disguised.\n- force pavis is more effective as a shield, being a small pretech force disc projector that can absorb all manner of small arms fire.\n- Requires one free hand to use effectively."
            },
            {
                value: "Security Armor",
                title: "[Combat, TL4]",
                ac: 14,
                shield: 0,
                cost: 700,
                enc: 1,
                tech: 4,
                desc: "- Cannot be effectively disguised.\n- Ordinary working uniform of most law enforcement officials and security personnel.\n- Various rigid plates and anti-ballistic panels provide protection for the wearer at minimal extra weight."
            },
            {
                value: "Woven Body Armor",
                title: "[Combat, TL3]",
                ac: 15,
                shield: 0,
                cost: 400,
                enc: 2,
                tech: 3,
                desc: "- Cannot be effectively disguised.\n- The best armor that a TL3 world can manufacture, or an up-armored version of security armor used by TL4 high-threat response teams.\n- The design is significantly more cumbersome, but allows for multiple layers of protection."
            },
            {
                value: "Combat Field Unform",
                title: "[Combat, TL4]",
                ac: 16,
                shield: 0,
                cost: 1000,
                enc: 1,
                tech: 4,
                desc: "- Cannot be effectively disguised.\n- A sophisticated battle dress fabricated from TL4 ablative coatings, rigid plates, and shock-activated soft components.\n- Standard uniform for well-equipped TL4 front-line soldiers."
            },
            {
                value: "Icarus Harness",
                title: "[Combat, Battery, TL4]",
                ac: 16,
                shield: 0,
                cost: 8000,
                enc: 1,
                tech: 4,
                desc: "- Replaces a conventional parachute with a crude gravity damper that allows the wearer to fall an unlimited distance without harm.\n- Each fall over 3 meters drains a type A power cell.\n- The suit also functions as a vacc suit for up to 30 minutes per vacc refresh."
            },
            {
                value: "Vestimentum",
                title: "[Powered, TL5]",
                ac: 18,
                shield: 0,
                cost: 15000,
                enc: 0,
                tech: 5,
                desc: "- Heaviest personal protection gear available short of an actual mech.\n-  Most powered armor requires at least a month of training before it can be used effectively by any PC who hasn’t got a background involving such experience.\n- Someone wearing armor of this class is immune to primitive melee weapons, unarmed attacks, and any firearm or grenade-scale explosive of TL3 or less.\n- Ancient Mandate ceremonial armors meant chiefly for parade guards, ritual officiants, cultural reenactors, or other roles that put elaborate style at a premium.\n- While these outfits often look wildly unmilitary, their hyper-advanced components and micronized force fields give them the same protection against primitive weapons as any other powered armor."
            },
            {
                value: "Assault Suit",
                title: "[Powered, Battery, TL4]",
                ac: 18,
                shield: 0,
                cost: 10000,
                enc: 2,
                tech: 4,
                desc: "- Heaviest personal protection gear available short of an actual mech.\n-  Most powered armor requires at least a month of training before it can be used effectively by any PC who hasn’t got a background involving such experience.\n- Someone wearing armor of this class is immune to primitive melee weapons, unarmed attacks, and any firearm or grenade-scale explosive of TL3 or less.\n- Requires a type B power cell for 24 hours of operation, and provides integral encrypted military comms, low-light and infrared vision, and a built-in energy feed interface.\n- The latter allows the wearer to connect the suit to any one weapon or device that uses a type A power cell as a Main Action.\n- So long as the device remains connected to the suit, it is treated as having unlimited ammunition or operation time.\n- The suit also functions as a vacc suit so long as it remains powered, one that cannot be torn by edged weapons."
            },
            {
                value: "Storm Armour",
                title: "[Powered, TL5]",
                ac: 19,
                shield: 0,
                cost: 20000,
                enc: 2,
                tech: 5,
                desc: "- Heaviest personal protection gear available short of an actual mech.\n-  Most powered armor requires at least a month of training before it can be used effectively by any PC who hasn’t got a background involving such experience.\n- Someone wearing armor of this class is immune to primitive melee weapons, unarmed attacks, and any firearm or grenade-scale explosive of TL3 or less.\n- Exo-augments allow the wearer to treat their Strength as 4 points higher for encumbrance purposes.\n- Integral gravitic boosters allow the wearer to leap up to 20 meters as a Move action, either horizontally or vertically, and allow the wearer to fall up to 40 meters without suffering harm.\n- An onboard medical computer can attempt last-ditch stabilization of the wearer if all other efforts fail; when the wearer would normally die from an untreated mortal wound, they can make a Physical save to self-stabilize.\n- Storm armor requires the same type B power cell as an assault suit, and each cell powers it for 24 hours."
            },
            {
                value: "Field Emitter Panoply",
                title: "[Powered, TL5]",
                ac: 20,
                shield: 0,
                cost: 40000,
                enc: 1,
                tech: 5,
                desc: "- Heaviest personal protection gear available short of an actual mech.\n-  Most powered armor requires at least a month of training before it can be used effectively by any PC who hasn’t got a background involving such experience.\n- Someone wearing armor of this class is immune to primitive melee weapons, unarmed attacks, and any firearm or grenade-scale explosive of TL3 or less.\n- Exo-augments allow the wearer to treat their Strength as 4 points higher for encumbrance purposes.\n- Integral gravitic boosters allow the wearer to leap up to 20 meters as a Move action, either horizontally or vertically, and allow the wearer to fall up to 40 meters without suffering harm.\n- An onboard medical computer can attempt last-ditch stabilization of the wearer if all other efforts fail; when the wearer would normally die from an untreated mortal wound, they can make a Physical save to self-stabilize.\n -A half-dozen worn emitter nodes that sheath the wearer in a nimbus of close-fitting damper fields.\n- The FEP’s pale glow is obvious.\n- The FEP is particularly effective at filtering radiation, and renders the wearer immune to any dose that wouldn’t kill them in seconds.\n- Many FEPs project intimidating holographic skins over the wearer when in operation."
            }
    ]
}];

// List of weapons
var weaponList = [{
    "Pick Weapon":[
        {
            value: "-",
            title: "",
             desc: "",
            damage: "",
            shortRange: 0,
            longRange: 0,
            ammoMax: 0,
            cost: 0,
            enc: 0,
            tech: 0
        },
        ],
    "Ranged Weapon":[
        {
            value: "Primitive Bow",
            title: "[Ranged, Hunting, TL1]",
             desc: "- Bows are uncommon weapons in the far future, though some lost-worlder barbarians have nothing better.\n- Bows can be reloaded with a Move action, or faster if the Gunslinger focus is applied.",
            damage: "1d6",
            shortRange: 50,
            longRange: 75,
            ammo: 1,
            cost: 15,
            enc: 2,
            tech: 1
        },
        {
            value: "Advanced Bow",
            title: "[Ranged, Hunting, TL3]",
             desc: "- Bows are uncommon weapons in the far future, though some lost-worlder barbarians have nothing better.\n- Bows can be reloaded with a Move action, or faster if the Gunslinger focus is applied.",
            damage: "1d6",
            shortRange: 100,
            longRange: 150,
            ammo: 1,
            cost: 50,
            enc: 2,
            tech: 3
        },
        {
            value: "Conversion Bow",
            title: "[Ranged, Hunting, TL4]",
             desc: "- Uses special materials to convert the kinetic energy of the draw into a force field “glazing” around the arrow, improving penetration.\n- Bows can be reloaded with a Move action, or faster if the Gunslinger focus is applied.",
            damage: "1d8",
            shortRange: 150,
            longRange: 300,
            ammo: 1,
            cost: 500,
            enc: 2,
            tech: 4
        },
        {
            value: "Crude Pistol",
            title: "[Ranged, Handgun, TL2]",
             desc: "- Represent the rawest and most primitive form of gunpowder weaponry, usually makeshift weapons improvised by criminals or the desperate.\n- Reloading requires two rounds instead of one.",
            damage: "1d6",
            shortRange: 5,
            longRange: 15,
            ammo: 1,
            cost: 20,
            enc: 1,
            tech: 2
        },
        {
            value: "Musket",
            title: "[Ranged, Two-Handed, TL2]",
             desc: "- Represent the rawest and most primitive form of gunpowder weaponry, usually makeshift weapons improvised by criminals or the desperate.\n- Reloading requires two rounds instead of one.",
            damage: "1d12",
            shortRange: 25,
            longRange: 50,
            ammo: 1,
            cost: 30,
            enc: 2,
            tech: 2
        },
        {
            value: "Revolver",
            title: "[Ranged, Handgun, TL2]",
             desc: "- Extremely reliable and can be repaired and manufactured even by primitive metallurgists.\n- Some revolver variants are specially built to handle atmospheres that would destroy more fragile weapons.",
            damage: "1d8",
            shortRange: 30,
            longRange: 100,
            ammo: 6,
            cost: 50,
            enc: 1,
            tech: 2
        },
        {
            value: "Rifle",
            title: "[Ranged, Two-handed, TL2]",
             desc: "- The mainstays of most TL2 armies and hunters, thanks to their superior range and power.",
            damage: "1d10+2",
            shortRange: 200,
            longRange: 400,
            ammo: 6,
            cost: 75,
            enc: 2,
            tech: 2
        },
        {
            value: "Shotgun",
            title: "[Ranged, Two-handed, CQB, TL2]",
             desc: "- Shotguns are cheaper and more easily manufactured than rifles, and are popular weapons for home defence on the frontier.\n- The statistics given are for 'shot' ammunition: 'slug' rounds do 2d6 damage and have ranges of 50/75 meters.",  
            damage: "3d4",
            shortRange: 10,
            longRange: 30,
            ammo: 2,
            cost: 50,
            enc: 2,
            tech: 2
        },
        {
            value: "Semi-Auto Pistol",
            title: "[Ranged, Handgun, TL3]",
             desc: "- Trades some of the reliability of the revolver for larger magazine size.\n- They tend to be the favorite sidearm for locals on planets that lack the harsh conditions or uncertain maintenance opportunities of a frontier world.",
            damage: "1d6+1",
            shortRange: 30,
            longRange: 100,
            ammo: 12,
            cost: 75,
            enc: 1,
            tech: 3
        },
        {
            value: "Submachine gun",
            title: "[Ranged, Two-Handed, Burst, TL3]",
             desc: "- Takes pistol ammunition but fire it at a high rate of speed.\n- These weapons can fire in burst mode.\n- Can fire in burst mode, allowing the wielder to fire three rounds of ammunition for a +2 bonus to hit and damage against the target.",
            damage: "1d8*",
            shortRange: 30,
            longRange: 100,
            ammo: 20,
            cost: 200,
            enc: 1,
            tech: 3
        },
        {
            value: "Combat Rifle",
            title: "[Ranged, Two-handed, Burst, TL3]",
             desc: "- Trades some of the often unnecessary range and penetration of a conventional rifle for a larger ammunition capacity and burst fire capabilities.\n- On more strait-laced worlds such military weaponry is often illegal for civilians to possess.\n- Can fire in burst mode, allowing the wielder to fire three rounds of ammunition for a +2 bonus to hit and damage against the target.",
            damage: "1d12*",
            shortRange: 100,
            longRange: 300,
            ammo: 30,
            cost: 300,
            enc: 2,
            tech: 3
        },
        {
            value: "Combat Shotgun",
            title: "[Ranged, Two-handed, CQB, Burst, TL3]",
             desc: "- These weapons have a substantially larger ammunition capacity and can fire in burst mode, allowing the wielder to fire three rounds of ammunition for a +2 bonus to hit and damage against the target.\n- The statistics given are for shot ammunition: Slug rounds do 2d6 damage and have ranges of 50/75 meters.",
            damage: "3d4*",
            shortRange: 10,
            longRange: 30,
            ammo: 12,
            cost: 300,
            enc: 2,
            tech: 3
        },      
        {
            value: "Sniper Rifle",
            title: "[Two-Handed, Long-Range, TL3]",
             desc: "- Aside from the additional effective range of a sniper rifle, any target it mortally wounds via an execution attack will die instantly, with no chance for stabilization.\n- The execution attack must qualify according to the terms on page 52.\n- If the rifle is used outside of such conditions, it has no special qualities.",
            damage: "2d8",
            shortRange: 1000,
            longRange: 2000,
            ammo: 5,
            cost: 400,
            enc: 2,
            tech: 3
        },
        {
            value: "Void Carbine",
            title: "[Two-Handed, TL4]",
             desc: "- Designed for vacuum and zero-g use, and have essentially no recoil.\n- Their rounds cannot penetrate ordinary ship equipment plating.",
            damage: "2d6",
            shortRange: 100,
            longRange: 300,
            ammo: 10,
            cost: 400,
            enc: 2,
            tech: 4
        },
        {
            value: "Mag Pistol",
            title: "[Handgun, TL4]",
             desc: "- Involves the magnetic acceleration of metal flechettes.\n- Mag ammunition is packaged with integral power supplies, so no additional power cells are necessary to fire these weapons.",
            damage: "2d6+2",
            shortRange: 100,
            longRange: 300,
            ammo: 6,
            cost: 400,
            enc: 1,
            tech: 4
        },
        {
            value: "Mag Rifle",
            title: "[Two-Handed, TL4]",
             desc: "- Involves the magnetic acceleration of metal flechettes.\n- Mag ammunition is packaged with integral power supplies, so no additional power cells are necessary to fire these weapons.",
            damage: "2d8+2",
            shortRange: 300,
            longRange: 600,
            ammo: 10,
            cost: 500,
            enc: 2,
            tech: 4
        },
        {
            value: "Spike Thrower",
            title: "[Two-Handed, CQB, Burst, TL4]",
             desc: "- Spike throwers are the shotgun equivalents of Mag Weaponry. Mag ammunition is packaged with integral power supplies, so no additional power cells are necessary to fire these weapons.",
            damage: "3d8*",
            shortRange: 20,
            longRange: 40,
            ammo: 15,
            cost: 600,
            enc: 2,
            tech: 4
        },
        {
            value: "Laser Pistol",
            title: "[Handgun, TL4]",
             desc: "- The most common type of energy weapon, though pistols are considerably less energy-efficient.\n- Depending on the tech used in the sector, they might produce silent, invisible beams of death or noisy, brightly-coloured streaks of lethal light.\n- The phased multifrequency beam is capable of penetrating any ordinary mist or haze, but a thick cloud of thermally-resistant particulate matter such as ash or sand can seriously degrade the beam, applying up to a -4 penalty to hit and cutting ranges in half.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.",
            damage: "1d6",
            shortRange: 100,
            longRange: 300,
            ammo: 10,
            cost: 200,
            enc: 1,
            tech: 4
        },
        {
            value: "Laser Rifle",
            title: "[Two-Handed, Burst, TL4]",
             desc: "- The most common type of energy weapon.\n- Depending on the tech used in the sector, they might produce silent, invisible beams of death or noisy, brightly-coloured streaks of lethal light.\n- The phased multifrequency beam is capable of penetrating any ordinary mist or haze, but a thick cloud of thermally-resistant particulate matter such as ash or sand can seriously degrade the beam, applying up to a -4 penalty to hit and cutting ranges in half.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.\n- One Type A power cell is sufficient to recharge an energy weapon’s magazine.",
            damage: "1d10*",
            shortRange: 300,
            longRange: 500,
            ammo: 20,
            cost: 300,
            enc: 2,
            tech: 4
        },
        {
            value: "Thermal Pistol",
            title: "[Handgun, TL4]",
             desc: "- Replaces the beam of a laser with a small sphere of magnetically shaped plasma.\n- The spheres tend to dissipate at much shorter ranges than a laser beam, but do significantly more damage to targets within range and are not affected by ambient particulates.\n- They tend to be extremely loud in operation.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.\n- One Type A power cell is sufficient to recharge an energy weapon’s magazine.",
            damage: "2d6",
            shortRange: 25,
            longRange: 50,
            ammo: 5,
            cost: 300,
            enc: 1,
            tech: 4
        },
        {
            value: "Plasma Projector",
            title: "[Two-Handed, TL4]",
             desc: "- Replaces the beam of a laser with a small sphere of magnetically shaped plasma.\n- The spheres tend to dissipate at much shorter ranges than a laser beam, but do significantly more damage to targets within range and are not affected by ambient particulates.\n- They tend to be extremely loud in operation.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.\n- One Type A power cell is sufficient to recharge an energy weapon’s magazine.",
            damage: "2d8",
            shortRange: 50,
            longRange: 10,
            ammo: 6,
            cost: 400,
            enc: 2,
            tech: 4
        },
        {
            value: "Shear Rifle",
            title: "[Two-Handed, Burst, TL5]",
             desc: "- Uses miniaturized grav projectors to create dangerous repulsor fields inside a target, tearing the object apart along perfectly smooth planes.\n- Shear rifles are completely silent in operation.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.\n- One Type A power cell is sufficient to recharge an energy weapon’s magazine.",
            damage: "2d8*",
            shortRange: 100,
            longRange: 300,
            ammo: 10,
            cost: 600,
            enc: 2,
            tech: 5
        },
        {
            value: "Thunder Gun",
            title: "[Two-Handed, TL5]",
             desc: "- Named for the basso vibrations caused by their operation, a sound that can be felt as far as thirty meters away from an operator.\n- This two-handed weapon uses grav plates to create rapid, randomized disruptions in a target that increase the chance of complete structural collapse.\n- If a thunder gun hits a target with an unmodified hit roll of 16 or higher an extra 1d10 damage is rolled.\n- This bonus damage always applies to inanimate targets.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.\n- One Type A power cell is sufficient to recharge an energy weapon’s magazine.",
            damage: "2d10",
            shortRange: 100,
            longRange: 300,
            ammo: 6,
            cost: 1000,
            enc: 2,
            tech: 5
        },
        {
            value: "Distortion Cannon",
            title: "[Two-Handed, TL5]",
             desc: "- Manipulates the underlying fabric of space to disrupt a target.\n-Provided the wielder can see a target within range or accurately fix its location within one meter, the distortion cannon can ignore up to one meter of solid cover between the gun and its target.\n- The lack of recoil for non-Heavy energy weapons makes them more accurate, granting them a +1 bonus to hit rolls.\n- One Type A power cell is sufficient to recharge an energy weapon’s magazine.",
            damage: "2d12",
            shortRange: 100,
            longRange: 300,
            ammo: 6,
            cost: 1250,
            enc: 2,
            tech: 5
        }
        ],
    "Explosives":[
        {
            value: "Grenade",
            title: "[Thrown, Explosive, TL3]",
             desc: "- Always roll to attack AC 10.\n- On a miss, the grenade lands 1d10 meters away from the target in a random direction.\n- Hit or miss, the grenade then explodes for 2d6 damage to all targets within 5 meters.\n- Victims are allowed an Evasion save for half damage.\n- Targets take 1 less point of damage for each point of AC above 14.\n- Grenades can be thrown with the Exert skill instead of Shoot, if desired.",
            damage: "2d6",
            shortRange: 10,
            longRange: 30,
            ammo: 1,
            cost: 25,
            enc: 1,
            tech: 3
        },
        {
            value: "Demo Charge",
            title: "[Explosive, TL3]",
             desc: "- Can be detonated by radio signals, timers, or electrical charges, and inflict their damage on any objects within twenty meters, with an Evasion saving throw for half damage.\n- Victims within forty meters take half damage, with an Evasion save for none.\n- The charge is sufficient to blow a four-meter wide hole in anything short of a reinforced wall.\n- PCs with a background in demolitions or Fix-0 skill can shape the charge so it directs the blast in only one direction, sparing all but two meters of the rest.",
            damage: "3d10",
            shortRange: 20,
            longRange: 40,
            ammo: 1,
            cost: 250,
            enc: 1,
            tech: 3
        }
        ],
        "Heavy Ranged Weapons":[
        
        {
            value: "Heavy Machine Gun",
            title: "[Two-Handed, Heavy, Suppression, TL3]",
             desc: "- Air- or water-cooled projectile weapons that are usually fed with belts of linked ammunition.\n- HMGs require a vehicle mounting or emplaced firing position for effective results.\n- An HMG magazine contains enough ammunition for 10 rounds of firing, but each round of firing eats 25 credits worth of projectile ammunition.\n- Suppression: Double the usual ammunition is fired in one round, and every target in front of the weapon that is not under hard cover is automatically hit for half normal damage (eliminated by a successful Evasion saving throw).",
            damage: "3d6#",
            shortRange: 500,
            longRange: 2000,
            ammo: 10,
            cost: 5000,
            enc: 3,
            tech: 3
        },
        {
            value: "Rocket Launcher",
            title: "[Two-Handed, Heavy, TL3]",
             desc: "- Man-portable missile launchers of varying degrees of sophistication.\n- The weapons are usually equipped with basic tracking sensors, but are of limited accuracy against human- sized targets.\n- Rocket launchers take a -4 hit penalty against targets of human size or smaller.\n- Unlike most Heavy weapons, rocket launchers can be shoulder-fired without a prepared emplacement to support them.",
            damage: "3d10",
            shortRange: 2000,
            longRange: 4000,
            ammo: 1,
            cost: 4000,
            enc: 2,
            tech: 3
        },
        {
            value: "Railgun",
            title: "[Two-Handed, Heavy, Suppression, TL4]",
             desc: "- Scaled-up versions of personal mag rifles.\n- They accelerate large metallic slugs along the weapon’s barrel, creating a steady spray of hypervelocity rounds.\n- Ammunition sufficient for one round of firing costs 50 credits.\n- Suppression: Double the usual ammunition is fired in one round, and every target in front of the weapon that is not under hard cover is automatically hit for half normal damage (eliminated by a successful Evasion saving throw).\n- Energy weapons use Type B power cells.",
            damage: "3d8#",
            shortRange: 4000,
            longRange: 8000,
            ammo: 20,
            cost: 8000,
            enc: 0,
            tech: 4
        },
            {
            value: "Anti-Vehicle Laser",
            title: "[Two-Handed, Heavy, TL4]",
             desc: "- Less useful against soft targets, but excel at penetrating vehicle armor.\n- Against vehicles and other hard-skinned targets, damage is rolled twice and the better result is used.\n- Energy weapons use Type B power cells.",
            damage: "3d10",
            shortRange: 2000,
            longRange: 4000,
            ammo: 15,
            cost: 10000,
            enc: 0,
            tech: 4
        },
            {
            value: "Hydra Array",
            title: "[Two-Handed, Heavy, Suppression, TL4]",
             desc: "- Sequences a number of missile launchers to fire at once.\n- The gunner designates up to three targets and can then make three rolls to hit divided among them.\n- Each successful hit on a target allows the gunner to roll damage once, but only the highest damage roll is applied to the target.\n- A volley from the array costs 150 credits.\n- Suppression: Double the usual ammunition is fired in one round, and every target in front of the weapon that is not under hard cover is automatically hit for half normal damage (eliminated by a successful Evasion saving throw).",
            damage: "3d6#",
            shortRange: 4000,
            longRange: 8000,
            ammo: 10,
            cost: 20000,
            enc: 0,
            tech: 4
        },
            {
            value: "Wheatcutter Belt",
            title: "[Two-Handed, Heavy, Suppression, TL4]",
             desc: "- Antipersonnel measure often installed on gravtanks and other fighting vehicles.\n- When triggered, a belt of explosives fires off a scything blast of shrapnel on any side of the vehicle.\n- All creatures within 10 meters of that side of the vehicle must make an Evasion save for half damage.\n- Those within 20 meters take half damage, and can make an Evasion save to take none at all.\n- Wheatcutter belts do not ignore a vehicle’s Armor like other Heavy weapons do.\n- Reloading a wheatcutter belt costs 200 credits per round.",
            damage: "2d12",
            shortRange: 10,
            longRange: 20,
            ammo: 5,
            cost: 10000,
            enc: 0,
            tech: 4
        },
            {
            value: "Vortex Cannon",
            title: "[Two-Handed, Heavy, TL5]",
             desc: " -Uses controlled gravitic shear planes to cause a target to simply fall apart into component fragments.\n- The cannons are silent in operation, but so heavy and complex that they can only be mounted on gravtanks and other similar dedicated fighting vehicles.\n- Energy weapons use Type B power cells.",
            damage: "5d12",
            shortRange: 1000,
            longRange: 2000,
            ammo: 5,
            cost: 75000,
            enc: 0,
            tech: 5
        }
            
        
    ]
    
        
    
}];

// List of melee
var meleeList = [{
    "Pick Weapon":[
        {
            value: "-",
            title: "",
             desc: "",
            damage: "",
            shock: 0,
            cost: 0,
            enc: 0,
            tech: 0
        },
        ],
    "Melee Weapon":[
        {
            value: "Small Primitive Weapon",
            title: "[Str/Dex, TL0]",
             desc: "- One-handed implements no larger than a baton or knife.\n- These weapons are easily concealed in normal clothing, and can even be kept Readied up sleeves or in tailored pockets.\n- Many can be thrown at a range up to 10 meters.\n- A primitive weapon is simply one of ordinary metal or wood, with no high-tech augmentations.\n- Primitive weapons are often unable to harm targets in powered armor.\n- Kinesis wraps, spiked knuckles, and other small fist weapons may be treated as small advanced or primitive weapons that use the Punch skill and add the skill level to their rolled damage, but not to Shock.\n- Such weapons do not augment a hero with the Unarmed Combatant focus.",
            damage: "1d4",
            shock: "1/AC15",
            cost: 0,
            enc: 1,
            tech: 0
        },
        {
            value: "Medium Primitive Weapon",
            title: "[Str/Dex, TL0]",
             desc: "- One-handed swords, axes, spears, or other obvious implements of war.\n- While they can’t be effectively concealed in anything smaller than an enveloping cloak or coat, they’re also more damaging to an unfortunate victim struck by them, albeit they’re somewhat less nimble when the wielder needs to strike at unprotected flesh.\n- Spears and similar aerodynamic weapons can be thrown up to 30 meters.\n- A primitive weapon is simply one of ordinary metal or wood, with no high-tech augmentations.\n- Primitive weapons are often unable to harm targets in powered armor.",
            damage: "1d6+1",
            shock: "2/AC13",
            cost: 20,
            enc: 1,
            tech: 0
        },
        {
            value: "Large Primitive Weapon",
            title: "[Str, TL0]",
             desc: "- Two-handed implements of bodily ruin such as claymores, halberds, tetsubos, or other such weapons.\n- Unlike smaller weapons, they rely largely on Strength for their employ, and can bash through lighter forms of armor.\n- Large weapons count as two encumbrance items.\n- A primitive weapon is simply one of ordinary metal or wood, with no high-tech augmentations.\n- Primitive weapons are often unable to harm targets in powered armor.",
            damage: "1d8+1",
            shock: "2/AC15",
            cost: 30,
            enc: 2,
            tech: 0
        },
        {
            value: "Small Advanced Weapon",
            title: "[Str/Dex, TL4]",
             desc: "- One-handed implements no larger than a baton or knife.\n- These weapons are easily concealed in normal clothing, and can even be kept Readied up sleeves or in tailored pockets.\n- Many can be thrown at a range up to 10 meters.\n- An advanced weapon has been given a monoblade edge, kinetic sheathing, thermal wires, a chainsaw blade, or some other TL4 touch.\n- Advanced weapons can ignore primitive plate and hide protections.\n- Kinesis wraps, spiked knuckles, and other small fist weapons may be treated as small advanced or primitive weapons that use the Punch skill and add the skill level to their rolled damage, but not to Shock.\n- Such weapons do not augment a hero with the Unarmed Combatant focus.",
            damage: "1d6",
            shock: "1/AC15",
            cost: 40,
            enc: 1,
            tech: 4
        },
        {
            value: "Medium Advanced Weapon",
            title: "[Str/Dex, TL4]",
             desc: "- One-handed swords, axes, spears, or other obvious implements of war.\n- While they can’t be effectively concealed in anything smaller than an enveloping cloak or coat, they’re also more damaging to an unfortunate victim struck by them, albeit they’re somewhat less nimble when the wielder needs to strike at unprotected flesh.\n- Spears and similar aerodynamic weapons can be thrown up to 30 meters.\n- An advanced weapon has been given a monoblade edge, kinetic sheathing, thermal wires, a chainsaw blade, or some other TL4 touch.\n- Advanced weapons can ignore primitive plate and hide protections.",
            damage: "1d8+1",
            shock: "2/AC13",
            cost: 60,
            enc: 1,
            tech: 4
        },
        {
            value: "Large Advanced Weapon",
            title: "[Str, TL4]",
             desc: "- Two-handed implements of bodily ruin such as claymores, halberds, tetsubos, or other such weapons.\n- Unlike smaller weapons, they rely largely on Strength for their employ, and can bash through lighter forms of armor.\n- Large weapons count as two encumbrance items.\n- An advanced weapon has been given a monoblade edge, kinetic sheathing, thermal wires, a chainsaw blade, or some other TL4 touch.\n- Advanced weapons can ignore primitive plate and hide protections.",
            damage: "1d10+1",
            shock: "2/AC15",
            cost: 80,
            enc: 2,
            tech: 4
        },
        {
            value: "Stun Baton",
            title: "[Str/Dex, TL4]",
             desc: "- Common law enforcement tools.\n- The damage they do can drop a target to zero hit points, but will not kill them, the victim awakening in ten minutes with one hit point.\n- Stun batons trickle-charge from normal movement and will not run out of electrical energy under normal use conditions.",
            damage: "1d8",
            shock: "1/AC15",
            cost: 50,
            enc: 1,
            tech: 4
        },
        {
            value: "Suit Ripper",
            title: "[Str/Dex, TL4]",
             desc: "- Rods with fractal cutting surfaces designed to cripple vacc suit auto-repair routines.\n- Every hit with a suit ripper counts as a suit tear on a vacc suit-wearing enemy.\n- Unsurprisingly, these weapons are strictly illegal in space environments.",
            damage: "1d6",
            shock: "-",
            cost: 75,
            enc: 1,
            tech: 4
        },
        {
            value: "Unarmed Attack",
            title: "[Str/Dex, TL4]",
             desc: "- Ordinary kicks and punches.\n- Unarmed attacks always add the attacker’s Punch skill to damage rolls, unlike other weapons.",
            damage: "1d2",
            shock: "-",
            cost: "-",
            enc: 0,
            tech: 0
        }
        ]
        
    
}];

// List of drones
var droneList = [{
    "Pick Drone":[
        {
            value: "-",
            title: "",
             desc: "",
            ac: "",
            range: 0,
            hp: 0,
            fittings: 0,
            cost: 0,
            enc: 0,
            tech: 0
        },
        ],
    "Drone Models":[
        {
            value: "Primitive Drone",
            title: "[TL3]",
            desc: "- Represents the best flying portable drone technology for TL3 worlds.\n - While fragile, weak, and short-ranged, they are also relatively cheap.",
            ac: 12,
            range: "500m",
            hp: 1,
            fittings: 1,
            cost: 250,
            enc: 2,
            tech: 3
        },
        {
            value: "Void Hawk",
            title: "[TL4]",
            desc: "- Unlike other drones, they can operate perfectly well in space, though they only have the range to reach relatively adjacent ships or objects.",
            ac: 14,
            range: "100km",
            hp: 15,
            fittings: 4,
            cost: 5000,
            enc: 6,
            tech: 4
        },
        {
            value: "Stalker",
            title: "[TL4]",
            desc: "Stalker drones are the default TL4 workhorses of drone-kind and are available in most modern worlds.",
            ac: 13,
            range: "2km",
            hp: 5,
            fittings: 3,
            cost: 1000,
            enc: 2,
            tech: 4
        },
        {
            value: "Cuttlefish",
            title: "[TL4]",
            desc: "- Cuttlefish are specifically designed for aqueous use, and function only in a liquid medium.\n- The support of the liquid allows them to carry significantly more fittings, but the need for a sonar-based navigation system limits their available range.",
            ac: 13,
            range: "1km",
            hp: 10,
            fittings: 5,
            cost: 2000,
            enc: 6,
            tech: 4
        },
        {
            value: "Ghostwalker",
            title: "[TL4]",
            desc: "- Ghostwalkers are stealth drones, fabricated from radar-transparent materials.\n- They have an integral Sensor Transparency fitting and the sensor difficulty to spot them is 11 instead of 9.",
            ac: 15,
            range: "5km",
            hp: 1,
            fittings: 2,
            cost: 5000,
            enc: 3,
            tech: 4
        },
        {
            value: "Sleeper",
            title: "[TL4]",
            desc: "- Built to tarry on station for long periods.\n- They have the Stationkeeping fitting as an integral part of their design, and when hovering their power use slows to a trickle.\n- One day of hovering draws only five minutes worth of power from its cell. ",
            ac: 12,
            range: "500m",
            hp: 8,
            fittings: 4,
            cost: 2500,
            enc: 2,
            tech: 4
        },
        {
            value: "Pax",
            title: "[TL5]",
            desc: "- Pax drones are some of the most common pre-tech drones remaining in existence, as they were favoured by the Mandate Fleet for pacifying troublesome worlds that lacked quantum ECM.\n- While primitive by pre-tech standards, they still far excel most modern drones.",
            ac: 16,
            range: "100km",
            hp: 20,
            fittings: 4,
            cost: 10000,
            enc: 4,
            tech: 5
        },
        {
            value: "Alecto",
            title: "[TL5]",
            desc: "- Every Alecto is a full-fledged VI, an expert system so sophisticated as to seem almost sentient.\n- Its self-reinforcing cognition allows it to operate even when cut off from external signals by quantum ECM.\n- Salvaged Alectos have all exhibited “female” personalities.",
            ac: 18,
            range: "500m",
            hp: 30,
            fittings: 4,
            cost: 50000,
            enc: 4,
            tech: 5
        }
        ]
        
    
}];
// ================================================================================
// 9. Select Table Population & Automation
// ================================================================================

// Partially populate select field.
function optionTablePartial(groupName, options, targetID) {
    var $optgroup = $("<optgroup>", {
        label: groupName
    });

    $optgroup.appendTo(targetID);
    $.each(options, function (j, option) {
        var $option = $("<option>", {
            text: option.title,
            value: option.value
        });
        $option.appendTo($optgroup);
    });
}

// Populates target selection drop-down menu with data.
function selectOptionTable(data, targetID) {
    $.each(data, function (i, optgroups) {
        $.each(optgroups, function (groupName, options) {
            var $optgroup = $("<optgroup>", {
                label: groupName
            });

            $optgroup.appendTo(targetID);
            $.each(options, function (j, option) {
                var $option = $("<option>", {
                    text: option.title,
                    value: option.value
                });
                $option.appendTo($optgroup);
            });
        });
    });
}

// Retrieves the relevant description index of the specified stored value in a given list.
function getIndex(data, match) {

    for (var i = 0; i < data.length; i++) {

        if (data[i].value === match) {
            return i;
        }
    }
    return -1;
}

// ================================================================================
// 10. Bio Automation
// ================================================================================

// Updates child row with relevant background description
function BackInfo(childID, selectID) {
    
    var match = document.getElementById(selectID).value;
    var data = backgroundList[0]["Select a Background"];
    var index = getIndex(data, match);
    var info = backgroundList[0]["Select a Background"][index].desc;
    var title = backgroundList[0]["Select a Background"][index].title;
    document.getElementById("initSkill4").value = "empty";
        document.getElementById("initSkill7").value = "empty";
    if (backgroundList[0]["Select a Background"][index].bonus === "any") {
        $(".backgroundSkill").show();
    } else {
        
        var bonusSkill = backgroundList[0]["Select a Background"][index].bonus;
        document.getElementById("initSkill4").value = bonusSkill;
        $(".backgroundSkill").hide();
    }
    addLearnSkillBonus();
    document.getElementById(childID).setAttribute("data-desc",info);
    document.getElementById(childID).setAttribute("data-name",title);

    clearSelection();
}

function classInfo(childID, selectID) {
    var opGroup = Object.getOwnPropertyNames(classList[0]);
    var match = document.getElementById(selectID).value;
    var index = -1;
    for (var i = 0; i < opGroup.length; i++) {
        index = getIndex(classList[0][opGroup[i]], match);
        if (index > -1) {
            var info = classList[0][opGroup[i]][index].desc;
             var title = classList[0][opGroup[i]][index].title;
                    document.getElementById("initSkill5").value = "empty";
                 document.getElementById("initSkill6").value = "empty";
            document.getElementById("initSkill8").value = "empty";
                 document.getElementById("initSkill9").value = "empty";

            
            var playerClass = classList[0][opGroup[i]][index].value; // Get selected class.
            
            // Check for Psionic Class pick
            if (playerClass === "psychic") {
        $(".classSkill1").show();
                $(".isPsi").show();
                $(".classSkill2").show();
    } else if ((playerClass === "adventurerEP")||(playerClass === "adventurerPW")||(playerClass === "adventurerPTAI")){
        $(".classSkill1").show();
        $(".classSkill2").hide();
        $(".isPsi").show();
    }
            else{
                $(".classSkill1").hide();
                $(".classSkill2").hide();
                $(".isPsi").hide();
            }
            
            
            // Check for True AI class pick.
            if ((playerClass === "trueAI")||($("#playerClass").val() === "adventurerETAI")||($("#playerClass").val() === "adventurerPTAI")||($("#playerClass").val() === "adventurerPTAI")||($("#playerClass").val() === "adventurerWTAI")) {
                document.getElementById("isGrowthCheck").checked = false;
                $(".isAI").show();
                var skill = "fix";
                document.getElementById("initSkill8").value = skill;
                 document.getElementById("initSkill9").value = "program";
                $(".isAISkill").show();
                $(".isRandom").hide();
            }
            else{
                $(".isAI").hide();
                $(".isRandom").show();
                
            }
            isGrowth("isGrowthCheck",".randomGrowth");
            
           document.getElementById(childID).setAttribute("data-desc",info);
    document.getElementById(childID).setAttribute("data-name",title);

            addLearnSkillBonus();
            updateSkillPoolSize();
            clearSelection();
            updateMaxFociPool();
            updateAtkBonus();
            updateCoreRoutines();
            return;
        }
    }
}

function charImage(imageUrl){
$(".bounding-box").css("background-image", "url(" + imageUrl + ")");
}

// ================================================================================
// 11. Auto-Size Textarea
// ================================================================================

var observe;

if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent("on" + event, handler);
    };
} else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}
function init(id) {
    var text = document.getElementById(id);
    function resize() {
        text.style.height = "auto";
        text.style.height = text.scrollHeight + "px";
    }
    /* 0-timeout to get the already changed text */
    function delayedResize() {
        window.setTimeout(resize, 0);
    }
    observe(text, "change", resize);
    observe(text, "cut", delayedResize);
    observe(text, "paste", delayedResize);
    observe(text, "drop", delayedResize);
    observe(text, "keydown", delayedResize);

    text.focus();
    text.select();
    resize();
}

// ================================================================================
// 12. Increment Buttons
// ================================================================================

// Increment associated value.
function increment(id) {
    // Get current value and constraint.

    var currentValue = parseInt(document.getElementById(id).value);
    var max = parseInt(document.getElementById(id).getAttribute("max"));
    // Check if constraint is satisfied.
    if (!isNaN(max) && currentValue < max) {
        document.getElementById(id).value = currentValue + 1; // Increment value
    } else if (isNaN(max)) {
        document.getElementById(id).value = currentValue + 1; // Increment value
    }
    // Trigger associated 'onchange' action if exists.
    if (document.getElementById(id).getAttribute("onchange") != null) {
        document.getElementById(id).onchange();
    }
}

// Decrement associated value;
function decrement(id) {
    // Get current value and constraint.
    var currentValue = parseInt(document.getElementById(id).value);
    var min = parseInt(document.getElementById(id).getAttribute("min"));
    // Check if constraint is satisfied.
    if (min != null && currentValue > min) {
        document.getElementById(id).value = currentValue - 1; // Decrement value
    } else if (isNaN(min)) {
        document.getElementById(id).value = currentValue - 1; // Decrement value
    }
    // Trigger associated 'onchange' action if exists.
    if (document.getElementById(id).getAttribute("onchange") != null) {
        document.getElementById(id).onchange();
    }
}

// ================================================================================
// 13. Custom Alert Box
// ================================================================================

var currentCallback;

// override default browser alert
window.alert = function (msg, callback) {
    $(".messageHeader").text("ALERT!!!");
    $(".message").text(msg);
    $(".customAlert").css("animation", "fadeIn 0.3s linear");
    $(".customAlert").css("display", "inline");
    setTimeout(function () {
        $(".customAlert").css("animation", "none");
    }, 300);
    currentCallback = callback;
};

$(function () {
    // add listener for when our confirmation button is clicked
    $("#closeAlert").click(function () {
        $(".customAlert").css("animation", "fadeOut 0.3s linear");
        setTimeout(function () {
            $(".customAlert").css("animation", "none");
            $(".customAlert").css("display", "none");
        }, 300);
    });
});

// ================================================================================
// 14. Save & Load Character Data
// ================================================================================

function save_character(){
    
    var filename = ".swn";
  if (document.getElementById('playerName').value == "") {
    filename = "CharacterSheet" + filename;
  } else {
    filename = document.getElementById('playerName').value + filename;
  }
    
// Prepare form data for JSON format
  const formId = "charsheet"; // ID matches HTML form element
  var url = location.href; // Full URL of current location
  const formIdentifier = `${url} ${formId}`;
  let form = document.querySelector(`#${formId}`);
  let formElements = form.elements;
    
    let data = { [formIdentifier]: {} };
  for (const element of formElements) {
    if (element.id.length > 0) {
        
      if (element.type == 'checkbox') {
          
        var checked = ($(element).prop("checked") ? 'checked' : 'unchecked');
        data[formIdentifier][element.id] = checked;
      } else {
        data[formIdentifier][element.id] = element.value;
      }
    }
  }
    data = JSON.stringify(data[formIdentifier], null, 2);
  type = 'application/json';
    

    
    
    // Save JSON to file
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url2 = URL.createObjectURL(file);

    

        
      a.href = url2;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url2);  
      }, 0); 
  }
}

// Functions for reading character from disk
function load_character(e) {

  // Autosave character
  if ($("#autosave").prop("checked") == true) {
    save_character();
  }

  // Load character
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {



    var contents = e.target.result;

    // Set size of dynamic Inventory tables
    var savedData = JSON.parse(contents);
    while (rowNum > 1) {
      removeItemRow();
    }
    while (parseInt($("[name='counterItem']").val()) < parseInt(savedData.counter)) {
        addItemRow();
    }
      
      // Set size of dynamic Weapon tables
    while (weaponRowNum > 1) {
      removeWeaponRow();
    }
    while (parseInt($("[name='counterWeapon']").val()) < parseInt(savedData.counterWeapon)) {
        addWeaponRow();
    }
      
    // Set size of dynamic Melee tables
    while (meleeRowNum > 1) {
      removeMeleeRow();
    }
    while (parseInt($("[name='counterMelee']").val()) < parseInt(savedData.counterMelee)) {
        addMeleeRow();
    } 
      
       // Set size of dynamic Armour tables
    while (armourRowNum > 1) {
      removeArmourRow();
    }
    while (parseInt($("[name='counterArmour']").val()) < parseInt(savedData.counterArmour)) {
        addArmourRow();
    } 
      
      // Set size of dynamic psi technique tables
      while (rowNumPsi > 1) {
      removePsiRow();
    }
    while (parseInt($("[name='counterPsi']").val()) < parseInt(savedData.counterPsi)) {
        addPsiRow();
    }
      
      // Set size of dynamic routine tables
      while (rowNumRoutine > 1) {
      removeRoutineRow();
    }
    while (parseInt($("[name='counterRoutine']").val()) < parseInt(savedData.counterRoutine)) {
        addRoutineRow();
    }
      
      // Set size of dynamic shell tables
      while (shellRowNum > 1) {
      removeShellRow();
    }
    while (parseInt($("[name='counterShell']").val()) < parseInt(savedData.counterShell)) {
        addShellRow();
    }
      
       // Set size of dynamic drone tables
      while (droneRowNum > 1) {
      removeDroneRow();
    }
    while (parseInt($("[name='counterDrone']").val()) < parseInt(savedData.counterDrone)) {
        addDroneRow();
    }

   
   
    
    // Prepare form data for JSON format
    const formId = "charsheet";
    var url = location.href;
    const formIdentifier = `${url} ${formId}`;
    let form = document.querySelector(`#${formId}`);
    let formElements = form.elements;

    // Display file content
    savedData = JSON.parse(contents); // get and parse the saved data from localStorage
    for (const element of formElements) {
      if (element.id in savedData) {
        if (element.type == 'checkbox') {

          var checked = (savedData[element.id] == 'checked');
          $(element).prop("checked", checked);
        } else {
          element.value = savedData[element.id]; 
            element.dispatchEvent(new Event('input', { bubbles: true }));
            
            if (element.getAttribute("onchange") != null) {
        element.onchange();
    }
            if ($(element).is('textarea')){

                 $(element).height(0);

        $(element).attr('style', 'height: auto !important');

            }
            $(element.id).change();
            $(element.id).trigger("change");
        }
      }
    }
  };
  reader.readAsText(file);
    updateLevel();
    var skillNameList = [
        "admin",
        "connect",
        "exert",
        "fix",
        "heal",
        "know",
        "lead",
        "notice",
        "perform",
        "pilot",
        "program",
        "punch",
        "shoot",
        "sneak",
        "stab",
        "survive",
        "talk",
        "trade",
        "work",
        "biopsi",
        "metapsi",
        "precog",
        "telekinesis",
        "telepath",
        "teleport",
        "custom1",
        "custom2"
    ];
    for (var i = 0; i < skillNameList.length; i++){
        updateSkill(skillNameList[i]+"Score");
        
    }
    
}

document.getElementById('buttonload').addEventListener('change', load_character);

// ================================================================================
// 15. Save & Load Session Notes
// ================================================================================

function saveTextAsFile() {
                var textToSave = document.getElementById("inputTextToSave").value;
                var textToSaveAsBlob = new Blob([textToSave], {
                    type: "text/plain"
                });
                var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
                var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
                var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                downloadLink.innerHTML = "Download File";
                downloadLink.href = textToSaveAsURL;
                downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }

function destroyClickedElement(event) {
                document.body.removeChild(event.target);
            }

function loadFileAsText() {
                var fileToLoad = document.getElementById("fileToLoad").files[0];
                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent) {
                    var textFromFileLoaded = fileLoadedEvent.target.result;
                    document.getElementById("inputTextToSave").value = textFromFileLoaded;
                };
                fileReader.readAsText(fileToLoad, "UTF-8");
            }

// ================================================================================
// Initialise Page State
// ================================================================================

function activateChildren(){
        // Toggle expand/collapse child rows
    $('[data-toggle="toggle"]').click(function () {
        child = $(this).parents().next(".hideTr");
        if (child.is(":visible")) {
            child.slideUp(1);
            $(this).val("+");
        } else {
            var functionName = $(this).attr("data-function");
            var childID = $(this).attr("data-child");
            var selectID = $(this).attr("data-select");
            child.slideDown(1);
            $(this).val("-");
            if (typeof functionName !== "undefined") {
                window[functionName](childID, selectID);
            }
        }
    });
}

// Initialise page on ready.
$(document).ready(function () {

    $('.ibtnDel').click(function(e){e.preventDefault();}).click();
    $('.tablinks').click(function(e){e.preventDefault();}).click();
    hideTabs();
    typeWriter();
    var delayInMilliseconds = 4500; //4.5 seconds
 setTimeout(function() {
  //your code to be executed after delay second
     $('#loading').hide();
     
    $(".message").text("WECOME BACK USER#404\n---\nARE YOU READY TO BEGIN?");
                $(".messageHeader").text("E.I.N.S.");
                $(".customAlert").css("animation", "fadeIn 0.3s linear");
                $(".customAlert").css("display", "inline");
    document.getElementById("tabUI").style.display = "flex";
document.getElementById("defaultOpen").click();
    
updateBaseSkills();
charImage("https://i.ibb.co/jHgWhVR/Silhouette-woman-portrait-concept-of-unknown-anonymous-unnamed-etc.jpg");
$('textarea').on('keyup keypress click', function() {
        $(this).height(0);
        $(this).height(this.scrollHeight);
    });    
    
$(".randomGrowth").hide();
$(".backgroundSkill").hide();
$("#biopsiCoreTechnique").hide();
$("#metapsiCoreTechnique").hide();
$("#precogCoreTechnique").hide();
$("#telekinesisCoreTechnique").hide();
$("#telepathCoreTechnique").hide();
$("#teleportCoreTechnique").hide();
$(".isPsi").hide();
$(".isAI").hide();
$(".classSkill1").hide();
$(".classSkill2").hide();

for (var i = 1; i < 12; i++){
    $("#coreRoutine"+i+"Desc").val(routineCoreTechniques[i-1].desc);
    $("#CoreRoutine"+i).hide();
}
    
updateCoreRoutines();

// Populate Class Select Table
selectOptionTable(classList, "#playerClass");

// Populate Background Select Table
selectOptionTable(backgroundList, "#playerBackground");

// Populate Attribute Growth Select Tables
selectOptionTable(attrList, "#growthStat1");
selectOptionTable(attrList, "#growthStat2");
selectOptionTable(attrList, "#growthStat3");    
    
// Populate Foci Select Tables.
selectOptionTable(fociList, "#Foci1");
selectOptionTable(fociList, "#Foci2");
selectOptionTable(fociList, "#Foci3");
selectOptionTable(fociList, "#Foci4");
selectOptionTable(fociList, "#Foci5");
selectOptionTable(fociList, "#Foci6");
    
// Populate Skill Learning Select Tables
optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill1");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill1");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill1");

optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill2");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill2");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill2");

optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill3");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill3");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill3");

optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill4");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill4");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill4");

// Populate Starting Psi Skill Select Tables
optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill5");
optionTablePartial("Psychic Skills",skillList[0]["Psychic Skills"],"#initSkill5");

optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill6");
optionTablePartial("Psionic Skills",skillList[0]["Psychic Skills"],"#initSkill6");

optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill7");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill7");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill8");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill8");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill8");
    
optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill9");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill9");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill9");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill10");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill10");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill10");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill11");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill11");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill11");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill12");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill12");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill12");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill13");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill13");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill13");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill14");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill14");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill14");
    
    optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill15");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill15");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill15");
    
        optionTablePartial("Select a Skill",skillList[0]["Select a Skill"],"#initSkill16");
optionTablePartial("Non-Combat Skills",skillList[0]["Non-Combat Skills"],"#initSkill16");
optionTablePartial("Combat Skills",skillList[0]["Combat Skills"],"#initSkill16");
    
for(i=1;i<6;i++){
    var element = document.getElementById("deathBox"+i);
    if(element.getAttribute("onchange") !== null){
    element.onchange();
    }
}
     window.addEventListener("beforeunload", function(evt) {
    
        // Cancel the event (if necessary)
    evt.preventDefault();
        
    if ($("#autosave").prop("checked") == true) {

    save_character();
  }

    // Google Chrome requires returnValue to be set
    evt.returnValue = '';

    return null;
});
     
    // Hide child rows
    $(".hideTr").slideUp(1);
    
    // Toggle expand/collapse child rows
    $('[data-toggle="toggle"]').click(function () {
        child = $(this).parents().next(".hideTr");
        if (child.is(":visible")) {
            child.slideUp(1);
            $(this).val("\u25bC");
        } else {
            var functionName = $(this).attr("data-function");
            var childID = $(this).attr("data-child");
            var selectID = $(this).attr("data-select");
            child.slideDown(1);
            $(this).val("\u25b2");
            if (typeof functionName !== "undefined") {
                window[functionName](childID, selectID);
            }
        }
    });
    
     hpSlider.oninput();
     
    // Pop-up skill description.
    $(".interact").click(function () {
        var opGroup = ["Select a Skill", "Non-Combat Skills", "Combat Skills", "Psychic Skills"];
        var match = document.getElementById(this.id).id;
        var index = -1;
        for (var i = 0; i < opGroup.length; i++) {
            var groupIndex = opGroup[i];
            index = getIndex(skillList[0][groupIndex], match);
            if (index > -1) {
                var info = skillList[0][groupIndex][index].desc;
                var title = skillList[0][groupIndex][index].title;
                $(".message").text(info);
                $(".messageHeader").text(title + ":");
                $(".customAlert").css("animation", "fadeIn 0.3s linear");
                $(".customAlert").css("display", "inline");
            }
        }
    });
    
    
    // Populate Psi Core Technique descriptions
    $("#biopsiCoreDesc").attr("data-desc",psiCoreTechniques[0].desc);
    $("#metapsiCoreDesc").attr("data-desc",psiCoreTechniques[1].desc);
    $("#precogCoreDesc").attr("data-desc",psiCoreTechniques[2].desc);
    $("#telekinesisCoreDesc").attr("data-desc",psiCoreTechniques[3].desc);
    $("#telepathCoreDesc").attr("data-desc",psiCoreTechniques[4].desc);
    $("#teleportCoreDesc").attr("data-desc",psiCoreTechniques[5].desc);

    $("#routineInfo1").attr("data-desc",routineCoreTechniques[0].desc);
    $("#routineInfo2").attr("data-desc",routineCoreTechniques[1].desc);
    $("#routineInfo3").attr("data-desc",routineCoreTechniques[2].desc);
    $("#routineInfo4").attr("data-desc",routineCoreTechniques[3].desc);
    $("#routineInfo5").attr("data-desc",routineCoreTechniques[4].desc);
    $("#routineInfo6").attr("data-desc",routineCoreTechniques[5].desc);
    $("#routineInfo7").attr("data-desc",routineCoreTechniques[6].desc);
    $("#routineInfo8").attr("data-desc",routineCoreTechniques[7].desc);
    $("#routineInfo9").attr("data-desc",routineCoreTechniques[8].desc);
    $("#routineInfo10").attr("data-desc",routineCoreTechniques[9].desc);
    $("#routineInfo11").attr("data-desc",routineCoreTechniques[10].desc);
     
     $("#routineInfo1").attr("data-name",routineCoreTechniques[0].title);
    $("#routineInfo2").attr("data-name",routineCoreTechniques[1].title);
    $("#routineInfo3").attr("data-name",routineCoreTechniques[2].title);
    $("#routineInfo4").attr("data-name",routineCoreTechniques[3].title);
    $("#routineInfo5").attr("data-name",routineCoreTechniques[4].title);
    $("#routineInfo6").attr("data-name",routineCoreTechniques[5].title);
    $("#routineInfo7").attr("data-name",routineCoreTechniques[6].title);
    $("#routineInfo8").attr("data-name",routineCoreTechniques[7].title);
    $("#routineInfo9").attr("data-name",routineCoreTechniques[8].title);
    $("#routineInfo10").attr("data-name",routineCoreTechniques[9].title);
    $("#routineInfo11").attr("data-name",routineCoreTechniques[10].title);

     
    
        // Extendable Tables
    $("#addrow").on("click", addItemRow);
    $("#addrowpsi").on("click", addPsiRow);
    $("#addrow-weapon").on("click", addWeaponRow);
     $("#addrow-melee").on("click", addMeleeRow);
    $("#addrow-armour").on("click", addArmourRow);
    
    $("#addrow-routine").on("click", addRoutineRow);
    $("#addrow-shell").on("click", addShellRow);
    $("#addrow-drone").on("click", addDroneRow);

    // Add Alert Info box on info button click.
$(".interactInfo").click(function () {

var description = this.getAttribute("data-desc");
        if (description !== ""){
                $(".message").text(description);
                $(".messageHeader").text(this.getAttribute("data-name") + ":");
                $(".customAlert").css("animation", "fadeIn 0.3s linear");
                $(".customAlert").css("display", "inline");
        }
    });
    

    //Prevent Automatic Form Submission
        $('#charsheet').submit(function(e) {
        e.preventDefault();
        // or return false;
    });
     
     }, delayInMilliseconds);
});

function hideTabs(){
    var i;
    // Get all elements with class="tabcontent" and hide them
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  var tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
}

function openCity(evt, cityName) {
  // Declare all variables

  hideTabs();

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
    
    $('textarea').each(function(){
        $(this).height($(this)[0].scrollHeight );
    });
}

// Prevent automatic form submission
var form = document.getElementById("charsheet");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

//Slider Automation
var hpSlider = document.getElementById("hpRange");
var hpDisp = document.getElementById("currentHP");
var strainSlider = document.getElementById("strainRange");
var strainDisp = document.getElementById("currentStrain");
hpDisp.innerHTML = hpSlider.value;
strainDisp.innerHTML = strainSlider.value;

function update(value,target,disp){
var targetSlider = document.getElementById(target);
var targetDisp = document.getElementById(disp);
    targetSlider.max = value;
    if (parseInt(targetDisp.innerHTML)>value){
        targetDisp.innerHTML = value;
    }
    
}

function update2(value){
document.getElementById("myRange2").max = value;
}


hpSlider.oninput = function() {
  hpDisp.innerHTML = this.value;
    var deathBox = $("#deathSaveBox");
    var bleedOut = document.getElementById("deathBox1");
    if (this.value == 0){
        deathBox.show();
    }
    else{
        bleedOut.checked = false;
        bleedOut.onchange();
        deathBox.hide();
    }
};

strainSlider.oninput = function() {
  strainDisp.innerHTML = this.value;
};

var i = 0;
var txt = 'Lorem ipsum dummy text blabla.';
var speed = 0.001;

var bootMessage = 'Boot Sequence Initialised...\n|Enabling /etc/fstab swaps                              [ OK ]\n|INIT: Entering runlevel: 3                                   \n|Entering non-interactive startup                             \n|Applying Intel CPU microcode update:                   [ OK ]\n|Checking for hardware changes                          [ OK ]\n|Bringing up interface eth0:                            [ OK ]\n|Determining IP information for eth0... done.                 \n\n|Staring auditd:                                        [ OK ]\n|Starting restorecond:                                  [ OK ]\n|Starting system logger:                                [ OK ]\n|Starting kernel logger:                                [ OK ]\n|Starting irqbalance:                                   [ OK ]\n|Starting mcstransd:                                    [ OK ]\n|Starting portmap:                                      [ OK ]\n|Starting settroubleshootd:                             [ OK ]\n|Starting NFS statd:                                    [ OK ]\n|Starting mdmonitor:                                    [ OK ]\n|Starting RPC idmapd:                                   [ OK ]\n|Starting system message bus:                           [ OK ]\n|Starting Bluetooth Services:                           [ OK ]\n|Starting other filesystems:                            [ OK ]\n|Starting PC/SC smart card daemon (pcscd):              [ OK ]\n|Starting hidd:                                         [ OK ]\nBoot Sequence Successful!\nStatus:...ONLINE\n\nVERFIYING USER CREDENTIALS...\nUSER IDENTIFIED\n"WELCOME"';

function typeWriter() {
    var messageLength = bootMessage.length;
    var consoleText = document.getElementsByClassName("bootLang")[0];
  if (i < messageLength) {
    consoleText.innerHTML += bootMessage.charAt(i);
    consoleText.innerHTML += bootMessage.charAt(i+1);
      consoleText.innerHTML += bootMessage.charAt(i+2);
    i +=3;
    setTimeout(typeWriter, speed);
      
  }
}

function updateStrain(val){
    var maxStrain = document.getElementById("strainMax");
    maxStrain.innerHTML = val;
    maxStrain.value = val;
    if (maxStrain.getAttribute("onchange") != null) {
       maxStrain.onchange();
    }
}

//Load Sector
function loadSector(url){
    var mapUI = document.getElementById("mapUI");
    mapUI.src = url;
}

// Enable or disable next element.
function enableNextElement(id,nextId){
    var thisElement = document.getElementById(id);
    var nextElement = document.getElementById(nextId);
    if (thisElement.checked){
        nextElement.disabled = false;
        nextElement.style.opacity = "1";
    }
    else{
        nextElement.checked = false;

        nextElement.style.opacity = "0.5";
        if (nextElement.getAttribute("onchange") !== null){
            nextElement.onchange();
        }
        nextElement.disabled = true;
    }
}

// Check if Player is Dead.
function checkDeath(id){
    
    if(id.checked){
         $(".message").text("YOU ARE DEAD");
                $(".messageHeader").text("FLATLINED!" + ":");
                $(".customAlert").css("animation", "fadeIn 0.3s linear");
                $(".customAlert").css("display", "inline");
    }    
}