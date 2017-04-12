#pragma strict

private var myItem: boolean;


function Start () {
	
	myItem = true;

	// save myItem
	PlayerPrefsElite.SetBoolean("myItem", myItem);;

	//verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyBoolean("myItem")){
		Debug.Log("myItem verified");
	}
}
