#pragma strict

private var myFloat: float;
var newFloat: float;


function Start () {
	
	myFloat = 1.0f;

	// save myFloat
	PlayerPrefsElite.SetInt("myFloat", myFloat);

	//verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyFloat("myFloat")){
		newFloat = PlayerPrefs.GetFloat("myFloat");
		Debug.Log("myFloat return true");
	}
}
