#pragma strict

// Array class is only available in Javascript and JavaScript PlayerPrefs Elite version.

/* <= remove this if you use the JavaScript PlayerPrefs Elite version.

// Array declaration
var myArray = new Array();
	
function Start () {

	// add an new item to the end of the myArray
	myArray.Add("sometext");
	
	// save it
	PlayerPrefsElite.SetStringArray("myArray", myArray);

	//now verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyArray("myArray")){
	
		// Assign the myArray from player preferences to myOtherArray
		var myOtherArray: Array = new Array(PlayerPrefsElite.GetStringArray("myArray"));
		
		// log
		Debug.Log("myArray return true, myOtherArray now contained " + myOtherArray.Count + " number of elements and retrieve \"" + myOtherArray[0] +  "\" from myOtherArray[0]");
		
	}
		
}

*/ //<= remove this if you use the JavaScript PlayerPrefs Elite version.
