#pragma strict

var counter: int;
var PlayerName: String;
var Lives: int;
var Weapon01: int;
var Weapon02: int;

var demoStringArray: String[]; 
var demoIntArray: int[];
var demoFloatArray: float[]; 

function Start() {

	ResetToDefault();
	counter = 0;	// reset counter

}


// set default PlayerPrefs values
function ResetToDefault(){
	PlayerPrefsElite.SetString("Player Name", "Joe");					// Player name
	PlayerPrefsElite.SetInt("Lives", 3);								// lives
	PlayerPrefsElite.SetInt("Weapon01", 0);								// weapon01
	PlayerPrefsElite.SetInt("Weapon02", 0);								// weapon02
	SaveCombinedLineOne();												// Create a chain of variables
	SaveCombinedLineTwo();												// Create a chain of variables
	PlayerPrefsElite.SetStringArray ("demoStringArray",  demoStringArray);		// save string array
	PlayerPrefsElite.SetIntArray ("demoIntArray",  demoIntArray);				// save int array
	PlayerPrefsElite.SetFloatArray ("demoFloatArray",  demoFloatArray);			// save float array
	Debug.Log("Reset");
}

// Create a chain of variables and save them using PlayerPrefsElite
function SaveCombinedLineOne(){
	PlayerPrefsElite.Encrypt("CombinedLineOne", PlayerPrefs.GetString("PlayerName") + PlayerPrefs.GetInt("Lives").ToString()+PlayerPrefs.GetInt("Weapon01").ToString());
	Debug.Log("Create a chain of variables");
}


// Verify a chain of variables
function VerifyCombinedLineOne(){
	if (!PlayerPrefsElite.CompareEncrypt("CombinedLineOne", PlayerPrefs.GetString("PlayerName") + PlayerPrefs.GetInt("Lives").ToString()+PlayerPrefs.GetInt("Weapon01").ToString())){
		// Modified value detected
		Debug.Log(false + " Modified value detected");
	}else{
		Debug.Log(true);
	}
}

// Create a chain of variables and save them using PlayerPrefsElite
function SaveCombinedLineTwo(){
	PlayerPrefsElite.Encrypt("CombinedLineTwo", PlayerPrefs.GetInt("Lives").ToString()+PlayerPrefs.GetInt("Weapon02").ToString());
	Debug.Log("Create a chain of variables");
}

// Verify a chain of variables
function VerifyCombinedLineTwo(){
	if (!PlayerPrefsElite.CompareEncrypt("CombinedLineTwo", PlayerPrefs.GetInt("Lives").ToString()+PlayerPrefs.GetInt("Weapon02").ToString())){
		// Modified value detected
		Debug.Log(false + " Modified value detected");
	}else{
		Debug.Log(true);
	}
}


 

function Update(){
	// show reattime update through Visual PlayerPrefs Editor
	PlayerPrefs.SetFloat("RealTime", Time.realtimeSinceStartup );
	PlayerPrefs.SetInt("Counter", counter); 
	counter++;
}





function OnGUI(){ 

	GUI.Label(Rect(20,5,Screen.width,Screen.height),"by default values is:\nPlayer Name: Joe\nLives: 3\nWeapon01: 0\nWeapon02: 0");



	GUI.Label (Rect (20, 120, 150, 25), "Lives: " + PlayerPrefs.GetInt("Lives").ToString() );
	
	if (GUI.Button(Rect(190,145,150,25),"Set random Lives")){
		PlayerPrefs.SetInt("Lives", Random.Range(50, 1000));
	}
	
	if (GUI.Button(Rect(18,145,150,25),"Verify Lives")){
		if (!PlayerPrefsElite.VerifyInt("Lives")){
			Debug.Log("Modified value detected!");
		}else{
			Debug.Log("Verified");
		}
	}
	

	

	
	
	GUI.Label (Rect (20, 205, 150, 25), "Weapon01: " + PlayerPrefs.GetInt("Weapon01").ToString() );
	
	if (GUI.Button(Rect(18,230,150,25),"Verify Weapon01")){
		if (!PlayerPrefsElite.VerifyInt("Weapon01")){
			Debug.Log("Modified value detected!");
		}else{
			Debug.Log("Verified");
		}
	}
	
	if (GUI.Button(Rect(190,230,150,25),"Set random Weapon01")){
		PlayerPrefs.SetInt("Weapon01", Random.Range(5, 100));
	}
	
	
	GUI.Label (Rect (20, 285, 150, 25), "Weapon02: " + PlayerPrefs.GetInt("Weapon02").ToString() );
	
	if (GUI.Button(Rect(18,310,150,25),"Verify Weapon02")){
		if (!PlayerPrefsElite.VerifyInt("Weapon02")){
			Debug.Log("Modified value detected!");
		}else{
			Debug.Log("Verified");
		}
	}
	
	if (GUI.Button(Rect(190,310,150,25),"Set random Weapon02")){
		PlayerPrefs.SetInt("Weapon02", Random.Range(5, 100));
	}
	
	
	GUI.Label (Rect (20, 370, 400, 25), "chain of PlayerName + Lives + Weapon01");
	
	if (GUI.Button(Rect(18,395,150,25),"Save current values")){
		SaveCombinedLineOne();
	}
	
	if (GUI.Button(Rect(190,395,150,25),"Verify saved values")){
		VerifyCombinedLineOne();
	}
	
	
	GUI.Label (Rect (20, 455, 400, 25), "chain of Lives + Weapon02");
	
	if (GUI.Button(Rect(18,480,150,25),"Save current values")){
		SaveCombinedLineTwo();
	}
	
	if (GUI.Button(Rect(190,480,150,25),"Verify saved values")){
		VerifyCombinedLineTwo();
	}
	
	if (GUI.Button(Rect(190,45,150,25),"Reset To Default")){
		ResetToDefault();
	}
	
	
	if (GUI.Button(Rect(18,540,150,25),"Save string array")){
		PlayerPrefsElite.SetStringArray ("demoStringArray",  demoStringArray);	
	}
	
	if (GUI.Button(Rect(190,540,150,25),"Verify string array")){
		if (!PlayerPrefsElite.VerifyArray("demoStringArray")){
			Debug.Log("Modified array detected!");
		}else{
			Debug.Log("Verified");
		}
	}
	
		if (GUI.Button(Rect(18,580,150,25),"Save int array")){
		PlayerPrefsElite.SetIntArray ("demoIntArray",  demoIntArray);	
	}
	
	if (GUI.Button(Rect(190,580,150,25),"Verify int array")){
		if (!PlayerPrefsElite.VerifyArray("demoIntArray")){
			Debug.Log("Modified array detected!");
		}else{
			Debug.Log("Verified");
		}
	}
	
		if (GUI.Button(Rect(18,620,150,25),"Save float array")){
		PlayerPrefsElite.SetFloatArray ("demoFloatArray",  demoFloatArray);	
	}
	
	if (GUI.Button(Rect(190,620,150,25),"Verify float array")){
		if (!PlayerPrefsElite.VerifyArray("demoFloatArray")){
			Debug.Log("Modified array detected!");
		}else{
			Debug.Log("Verified");
		}
	}

}