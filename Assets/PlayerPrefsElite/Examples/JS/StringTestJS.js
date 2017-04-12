#pragma strict

private var myString: String;
var newString: String;


function Start () {
	
	myString = "I choose to believe what I was programmed to believe!";

	// save myString
	PlayerPrefsElite.SetString("myString", myString);

	//verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyString("myString")){
		newString = PlayerPrefs.GetString("myString");
		Debug.Log("myString return true");
	}
}
