// JavaScript Document
	

var charList = [{ name: "Bob", baseInit: 5, initRoll: 0, fullInit: 0, finished: false},
				 { name: "Sue", baseInit: 2, initRoll: 0, fullInit: 0, finished: false },
				 { name: "Jim", baseInit: 3, initRoll: 0, fullInit: 0, finished: true }];
				 
				 
var fileHeader = "/ECHelperWebsite/start";
var defaultSettingsFileName = "./InitiativeList.json";


function initialize()
{
    "use strict";
    // Load data from JSON
	var inputElement = document.getElementById("openCharList");
	inputElement.addEventListener("change", LoadCharList, false);
	// Load Character List from InitiativeList.json
	

	writeCharactersInitiative();
}


function defaultToolFunc(tName)
{
	if(tName == "NewChars")
	{
		// todo
		writeCharacterList();
		return;
	}
	if(tName == "Aptitudes")
	{
		// todo
		return;
	}
    if(tName == "Initiative")
    {
        writeCharactersInitiative();
        return;
	}
	if (tName == "CombatSkills")
	{
		//$("#CombatSkillsTextArea").load(defaultSettingsFileName);
		// Cannot load files from user's computer - security settings prevent this
		return;
	}
}


function openTool(evt, toolName) {
	"use strict";
	
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(toolName).style.display = "block";
    evt.currentTarget.className += " active";

    // Run the default function for the tool
    defaultToolFunc(toolName);
}

function Delete(index)
{
	"use strict";
	charList.splice(index, 1);
	writeCharacterList();
    writeCharactersInitiative();
}

function CalcInit()
{
	UpdateInit();
    for (var i = 0; i < charList.length; i++)
    {
        charList[i].fullInit = charList[i].baseInit + charList[i].initRoll;
    }
	// Sort initiative
	sortChars();
	writeCharactersInitiative();
}

function UpdateInit()
{
	var val;
	var id;
	for (var i = 0; i < charList.length; i++) {
		if(!charList[i].finished)
		{
			id = i + "Rand";
			val = parseInt(document.getElementById(id).value);
			charList[i].initRoll = val;
		}
	}
}

function AddCharInit()
{
	"use strict";
    var cname, initial, newChar;

    cname = document.getElementById("CharNameInit").value;
    initial = parseInt(document.getElementById("CharInitVal").value);
    if (!Number.isInteger(initial))
    {
        alert("Error: Please enter an integer for the initiative.");
        document.getElementById("CharInitVal").value = 0;
        return;
    }
    newChar = { name:cname, baseInit:initial, initRoll:0, fullInit:0};

    charList.push(newChar);
	writeCharactersInitiative();
	writeCharacterList();
}

function SaveCharList()
{
	"use strict";
	// Check for custom header
	var json;
	json = fileHeader;
	json += JSON.stringify(charList);
	download(json, "InitiativeList.json", "application/json");
}

function LoadCharListFromFile(fileName)
{
	var json;
	var fileString;
	var reader;

	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
  	} else {
		alert('The File APIs are not fully supported in this browser.');
		return;
  	}
}

function LoadCharList()
{
	var json;
	var fileString;
	var reader = loadFile(document.getElementById("openCharList"));
	if(reader != 0)
	{
		reader.onload = function(event) {
		    // The file's text will be printed here
			fileString = event.target.result;
		    console.log(fileString);
			// Convert file to java objects	
			// Check for custom header		

			if(fileString.indexOf(fileHeader) >= 0)
			{
				fileString = fileString.slice(fileHeader.length);
				console.log(fileString);
				json = JSON.parse(fileString);
				charList = json;
				writeCharactersInitiative();
			}
	    };
	}
}

function LoadCharListByName(filename)
{
	var reader = loadFileByName(filename);
	if(reader != 0)
	{
		alert("LoadCharListByName: " + filename);
		reader.onload = function(event) {
			alert("Inside onload function");
		    // The file's text will be printed here
			fileString = event.target.result;
		    console.log(fileString);
			// Convert file to java objects	
			// Check for custom header	

			if(fileString.indexOf(fileHeader) >= 0)
			{
				fileString = fileString.slice(fileHeader.length);
				console.log(fileString);
				var json = JSON.parse(fileString);
				charList = json;
				for(var i = 0;i < charList.length; i++)
					charList[i].finished = false;
				writeCharactersInitiative();
			}
	    };
	}
	
}

function generateRandom()
{
	"use strict";
    for (var i = 0; i < charList.length; i++) {
		charList[i].initRoll = Math.floor(Math.random() * 10) ;
		document.getElementById(i + "Rand").value = charList[i].initRoll;
	}
	CalcInit();
	sortChars();
	writeCharactersInitiative();
}

function sortChars()
{
	"use strict";
	charList.sort(function(a, b) {return b.fullInit - a.fullInit});
}

function nextChar()
{
	var i = 0;
	var currTurn = charList[i].finished;
	charList[i].finished = true;
	
	// Find the first character whose turn isn't over
	while(currTurn && (i < charList.length))
	{
		currTurn = charList[i].finished;
		console.log(charList[i].name + " " + charList[i].finished);
		charList[i].finished = true;
		i++;
	}
	writeCharactersInitiative();	
}

function nextTurn()
{
    for (var i = 0; i < charList.length; i++) {
		charList[i].finished = false;
	}
	writeCharactersInitiative();
}

function writeCharacterList() {
	"use strict";
	var outputString = "";

    outputString += "<table width=\"100%\">";

    outputString += "<tr>";
    outputString += "<td width=\"10%\"> Character Name </td>";
    outputString += "<td> Delete Entry</td>";
    outputString += "</tr>";


    for (var i = 0; i < charList.length; i++) {
		outputString += "<tr>";
		outputString += "<td width=\"10%\">" + charList[i].name + "</td>";
		outputString += "<td>" + "<button name=\"" + charList[i].name + "Delete\" onclick=\"Delete(" + i + ")\">X</button>" + "</td>";
		outputString += "</tr>";
    }
    outputString += "</table>";
    document.getElementById("TotalCharacterList").innerHTML = outputString;
}


function writeCharactersInitiative() {
	"use strict";
	var outputString = "";

    outputString += "<table width=\"100%\">";

    outputString += "<tr>";
    outputString += "<td width=\"10%\"> Character Name </td>";
    outputString += "<td width=\"7%\" align=\"center\"> Base Init</td > ";
    outputString += "<td width=\"7%\" align=\"center\"> Rolled Init</td>";
    outputString += "<td width=\"7%\" align=\"center\"> Final Init</td>";
    outputString += "<td> Delete Entry</td>";
    outputString += "</tr>";


    for (var i = 0; i < charList.length; i++) {
		if(!charList[i].finished)
		{
			outputString += "<tr>";
			outputString += "<td width=\"10%\">" + charList[i].name + "</td>";
			outputString += "<td align=\"center\">" + charList[i].baseInit + "</td > ";
			outputString += "<td align=\"center\">" + "<textarea rows=\"1\" cols=\"4\" id=\"" + i + "Rand\">" + charList[i].initRoll + "</textarea>" + "</td>";
			outputString += "<td align=\"center\">" + charList[i].fullInit + "</td > ";
			outputString += "<td>" + "<button name=\"" + charList[i].name + "Delete\" onclick=\"Delete(" + i + ")\">X</button>" + "</td>";
			outputString += "</tr>";
		}
    }
    outputString += "</table>";
    document.getElementById("CharacterList").innerHTML = outputString;
}

