// JavaScript Document

// function for downloading content to the client's computer
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function loadFile(element)
{
	"use strict";
	var fileList = element.files;
	var file = fileList[0];
	var reader = new FileReader();
	//alert("Type: " + file.type);
	if(fileList.length === 0)
	{
		alert("No files included");
		return 0;
	}
	reader.readAsText(file);
	return reader;
}


function randomD10()
{
	return Math.floor(Math.random() * (10)) + 1;
}