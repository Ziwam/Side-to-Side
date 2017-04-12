#pragma strict

private var myInt: int;
var newInt: int;


function Start () {
	
	myInt = 100;

	// save myInt
	PlayerPrefsElite.SetInt("myInt", myInt);

	//verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyInt("myInt")){
		newInt = PlayerPrefs.GetInt("myInt");
		Debug.Log("myInt return true");
	}
}
