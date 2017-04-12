#pragma strict

// ArrayList declaration
var myArrayList = new ArrayList();
	
function Start () {

	// add an new item to the end of the myArrayList
	myArrayList.Add("sometext");
	
	// save it
	PlayerPrefsElite.SetStringArray("myArrayList", myArrayList);

	//now verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyArray("myArrayList")){
	
		// Assign the myArrayList from player preferences to myOtherArrayList
		var myOtherArrayList: ArrayList = new ArrayList (PlayerPrefsElite.GetStringArray("myArrayList"));
		
		// log
		Debug.Log("myArrayList return true, myOtherArrayList now contained " + myOtherArrayList.Count + " number of elements and retrieve \"" + myOtherArrayList[0] +  "\" from myOtherArrayList[0]");
		
	}
		
}
