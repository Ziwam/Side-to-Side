#pragma strict

// setup built in array in editor
private var IntArray: int[];	
	
// built in empty array
private var StringArray: String[];

// built in empty array
private var FloatArray: float[];

// declare arrays for test
var testIntArray: int[];	
var testStringArray: String[];
var testFloatArray: float[];
	
// Use this for initialization	
function Start () {
	//set values for IntArray at startup
	IntArray = new int[5];
	IntArray = [1,2,3,4,5];

	//set values for StringArray at startup
	StringArray = new String[2];
	StringArray = ["abc", "bcd"];

	//set values for FloatArray at startup
	FloatArray = new float[3];
	FloatArray = [0.1f, 100, Random.Range(-10.0f, 10.0f)];

	// save it
	PlayerPrefsElite.SetIntArray("IntArray", IntArray);
	PlayerPrefsElite.SetStringArray("StringArray", StringArray);
	PlayerPrefsElite.SetFloatArray("FloatArray", FloatArray);

	//now verify and read from PlayerPrefs
	if (PlayerPrefsElite.VerifyArray("IntArray")){
		testIntArray = PlayerPrefsElite.GetIntArray("IntArray");
		Debug.Log("IntArray return true");
	}

	if (PlayerPrefsElite.VerifyArray("StringArray")){
		testStringArray = PlayerPrefsElite.GetStringArray("StringArray");
		Debug.Log("StringArray return true");
	}

	if (PlayerPrefsElite.VerifyArray("FloatArray")){
		testFloatArray = PlayerPrefsElite.GetFloatArray("FloatArray");
		Debug.Log("FloatArray return true");
	}
}
