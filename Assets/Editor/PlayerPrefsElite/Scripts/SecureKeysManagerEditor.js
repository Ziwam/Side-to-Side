@CustomEditor(SecureKeysManager)
@CanEditMultipleObjects

class SecureKeysManagerEditor extends Editor {

var boolarray = new System.Collections.Generic.List.<boolean>();

var m_Object: SerializedObject;
var m_Property: SerializedProperty;
var icologo: Texture2D;
var keyon: Texture2D;
var keyoff: Texture2D;
var pplistofkeys: Texture2D;
var myIterator: SerializedProperty;
private var editorSkin: GUISkin;
var _toggleArray: Array;
var showAlerts : boolean=true;

private var path: String;
function OnEnable() {
	if (!EditorPrefs.HasKey(PlayerSettings.companyName + PlayerSettings.productName)){
		EditorPrefs.SetInt("showAlerts",0);
		EditorPrefs.SetInt("minVal",10);
		EditorPrefs.SetInt("maxVal",16);
		EditorPrefs.SetString(PlayerSettings.companyName + PlayerSettings.productName,"");
	}	
var s : SecureKeysManager = FindObjectOfType(SecureKeysManager) as SecureKeysManager;
allKeys = s;
getboolarray();
showAlerts = EditorPrefs.GetInt("showAlerts")  == 1 ? true : false;
minVal = EditorPrefs.GetInt("minVal");    
maxVal = EditorPrefs.GetInt("maxVal");   
m_Object = new SerializedObject(target);
SetGFX();
}



function SetGFX(){
var path: String = "Assets/Editor/PlayerPrefsElite/Gui/Images/";
	if (EditorGUIUtility.isProSkin){
		icologo = AssetDatabase.LoadAssetAtPath(path + "secure-manager-logo-on-dark.png", Texture2D) as Texture2D; 
		keyon = AssetDatabase.LoadAssetAtPath(path + "dark-key-set.png", Texture2D) as Texture2D; 
		keyoff = AssetDatabase.LoadAssetAtPath(path + "dark-key-not-set.png", Texture2D) as Texture2D; 
		pplistofkeys = AssetDatabase.LoadAssetAtPath(path + "dark-pp-list-of-keys.png", Texture2D) as Texture2D; 
	}else{
		icologo = AssetDatabase.LoadAssetAtPath(path + "secure-manager-logo-on-light.png", Texture2D) as Texture2D; 
		keyon = AssetDatabase.LoadAssetAtPath(path + "key-set.png", Texture2D) as Texture2D; 
		keyoff = AssetDatabase.LoadAssetAtPath(path + "key-not-set.png", Texture2D) as Texture2D; 
		pplistofkeys = AssetDatabase.LoadAssetAtPath(path + "pp-list-of-keys.png", Texture2D) as Texture2D; 
	}
	LoadSkin();
	EditorApplication.RepaintProjectWindow();
}

private var rndKeys = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM0123456789".ToCharArray();
private var newKey: String = "";

function genKey(){
	var _newkey: String = "";
	var _count: int = Random.Range(minVal, maxVal+1);
	for (var i: int = 0; i<_count;i++){
		_newkey+= rndKeys[Random.Range(0, rndKeys.length)];
	}
	return _newkey;
}

function LoadSkin(){
	if (EditorGUIUtility.isProSkin){
		editorSkin = AssetDatabase.LoadAssetAtPath("Assets/Editor/PlayerPrefsElite/Gui/Images/skind.guiskin", GUISkin) as GUISkin; 
	}else{
		editorSkin = AssetDatabase.LoadAssetAtPath("Assets/Editor/PlayerPrefsElite/Gui/Images/skin.guiskin", GUISkin) as GUISkin; 
	}
}

private var allKeys : SecureKeysManager;
public override function OnInspectorGUI() {

GUILayout.Space (20);
	GUILayout.BeginHorizontal ();
 	GUILayout.Label(icologo, GUILayout.MinWidth(72)); 
 	GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal ();
	GUILayout.Space (10);
if (EditorApplication.isPlaying){
	GUILayout.BeginHorizontal ();
	 	GUILayout.FlexibleSpace();
	 	EditorGUILayout.HelpBox("\nLocked in Play mode\t\t  \n", MessageType.Info , true);
	    GUILayout.FlexibleSpace();
	    GUILayout.EndHorizontal ();
	return;
	}
	if( editorSkin == null ){
		LoadSkin();
		  
	}
	if (allKeys==null){
	 GUILayout.Space (20);
	 	GUILayout.BeginHorizontal ();
	 	GUILayout.FlexibleSpace();
	 	EditorGUILayout.HelpBox("\nDrag SecureKeysManager prefab into Hierarchy window\t\t  \n", MessageType.Info , true);
	    GUILayout.FlexibleSpace();
	    GUILayout.EndHorizontal ();
    	return;
    }
    if (!Selection.activeTransform){
    GUILayout.Space (20);
	 	GUILayout.BeginHorizontal ();
	 	GUILayout.FlexibleSpace();
	 	EditorGUILayout.HelpBox("\nSelect SecureKeysManager in Hierarchy window\t\t  \n", MessageType.Info , true);
	    GUILayout.FlexibleSpace();
	    GUILayout.EndHorizontal ();
    	return;
    }
    var myStyle: GUIStyle = new GUIStyle (GUI.skin.toggle);
    myStyle.overflow.top=-2;  
	//serializedObject.Update ();
	

     if (!settings){
     	if (GUILayout.Button("", editorSkin.customStyles[7])){
     		settings=true;
     		}
     	}else
     	if(settings) {
            if (GUILayout.Button("", editorSkin.customStyles[8])){
    		settings=false;
	     }
       	GUILayout.Space (5);
       	GUILayout.BeginHorizontal();
       	GUILayout.Label("Show Alerts", GUILayout.Width( 84 ));
       	showAlerts = EditorGUILayout.Toggle(showAlerts, myStyle);
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
        GUILayout.FlexibleSpace();
		GUILayout.Label("Key Length:");
        GUILayout.Label("", GUILayout.Width(0));
        GUILayout.EndHorizontal();   	
        GUILayout.BeginHorizontal();
        GUILayout.Label("Min value:", GUILayout.MinWidth( 85 ));
        minVal = GUILayout.HorizontalSlider (minVal, 8, 56, GUILayout.MaxWidth( Screen.width ));
		minVal = EditorGUILayout.IntField(minVal, GUILayout.Width( 72 ));
		if (minVal<8){minVal=8;}if (minVal>56){minVal=56;}
		if (minVal>maxVal){maxVal=minVal;}
		GUILayout.EndHorizontal();
		GUILayout.BeginHorizontal();
		GUILayout.Label("Max value:", GUILayout.MinWidth( 85 ));
		maxVal = GUILayout.HorizontalSlider (maxVal, 8, 56, GUILayout.MaxWidth( Screen.width ));
		maxVal = EditorGUILayout.IntField(maxVal, GUILayout.Width( 72 ));
		if (maxVal<8){maxVal=8;}if (maxVal>56){maxVal=56;}
		if (maxVal<minVal){minVal=maxVal;}
		GUILayout.EndHorizontal();			
		GUILayout.Space (10);

	if(GUILayout.Button ("Reset to Default", GUILayout.Width( 105 ) )){
		EditorPrefs.SetInt("showAlerts", 1);    
    	EditorPrefs.SetInt("minVal", 10);    
    	EditorPrefs.SetInt("maxVal", 16);    
    	showAlerts = EditorPrefs.GetInt("showAlerts")  == 1 ? true : false;
		minVal = EditorPrefs.GetInt("minVal");    
		maxVal = EditorPrefs.GetInt("maxVal");   
	}
	GUILayout.Space (10);
		if(GUI.changed){
    		EditorPrefs.SetInt("showAlerts", showAlerts ? 1 : 0);    
    		EditorPrefs.SetInt("minVal", minVal);    
    		EditorPrefs.SetInt("maxVal", maxVal);     
    	}
    }
	
	GUILayout.Space (15);
	m_Property = m_Object.FindProperty("keys");
	if (m_Property.arraySize<1){
 		EditorGUILayout.HelpBox("At least one key must be generated", MessageType.Warning, true);
 		GUILayout.Space (10);
	}
	EditorGUILayout.BeginVertical();
	do {
	if (m_Property.propertyPath != "keys" && !m_Property.propertyPath.StartsWith("keys" + ".") ) {
	break;
	}

	if (m_Property.name=="size"){
		var count: int = 0;
	    GUILayout.BeginHorizontal();
    	GUILayout.Label(pplistofkeys, editorSkin.customStyles[9], GUILayout.Width( 86 ) , GUILayout.Height( 20 ) );
    	if (allKeys.keys.length<1){
    		GUILayout.Label( keyoff, editorSkin.customStyles[9], GUILayout.Width( 18 ) , GUILayout.Height( 22 ) );
    	}else{
    		GUILayout.Label( keyon, editorSkin.customStyles[9], GUILayout.Width( 18 ) , GUILayout.Height( 22 ) );
    	}
    	GUILayout.Label(allKeys.keys.length.ToString());
    	GUILayout.FlexibleSpace();
    	if (allKeys.keys.length < 1){
    	GUI.enabled = false;
    	}
    	if(GUILayout.Button ("", editorSkin.customStyles[56])){
    		SaveKeys();
    	}
    	if (!GUI.enabled){
    		GUI.enabled=true;
    	}
    	if (!EditorPrefs.HasKey(PlayerSettings.companyName + PlayerSettings.productName + ".AllKeys")){
    	GUI.enabled = false;
    	}
    	if(GUILayout.Button ("", editorSkin.customStyles[55] )){   		
    			LoadKeys();
    	}
    	if (!GUI.enabled){
    		GUI.enabled=true;
    	}
    	GUILayout.EndHorizontal();
    	EditorGUILayout.Space();
    }else
    if (m_Property.name=="data"){
    	GUILayout.BeginHorizontal();

    	GUILayout.Label( "key " + count.ToString(), GUILayout.Width( 40 ) );
    	GUILayout.Label( "( " + m_Property.stringValue.Length + " )", editorSkin.customStyles[10], GUILayout.Width( 40 ) );
		if (count < boolarray.Count){
    		boolarray[count] = EditorGUILayout.Toggle(boolarray[count], myStyle, GUILayout.Width(20));    	
		}    	
    	EditorGUILayout.PropertyField( m_Property, GUIContent.none, true, GUILayout.MinWidth( 60 ) );
    	
		if (GUILayout.Button("", editorSkin.customStyles[2])){
    		GUIUtility.hotControl = 0;
    		GUIUtility.keyboardControl = 0;
    		m_Property.stringValue = genKey();
 		}
    	GUILayout.EndHorizontal();
    	
    	count++;
		}
	} 
	while (m_Property.NextVisible(true));

	EditorGUILayout.EndVertical();

	GUILayout.Space (20);

 	GUILayout.BeginHorizontal();
	if(GUILayout.Button ("Delete Selected", GUILayout.Width( 105 ) )){
	
		if (getToogle()){
			if (showAlerts){
				if (EditorUtility.DisplayDialog("Delete Key", "This operation cannot be undone", "Yes", "Cancel")){
    				var newarray = new Array(allKeys.keys);
    				_toggleArray.Sort();
    				for (var i: int=_toggleArray.Count;i>0;i--){
    				newarray.RemoveAt(_toggleArray[i-1]);
    			}
    			allKeys.keys = newarray.ToBuiltin(String);
    			getboolarray();
    			m_Object = new SerializedObject(target);
    			EditorUtility.SetDirty(target);
    			}
   			}else{
   				newarray = new Array(allKeys.keys);
    			_toggleArray.Sort();
    			for (i=_toggleArray.Count;i>0;i--){
    				newarray.RemoveAt(_toggleArray[i-1]);
    			}
    			allKeys.keys = newarray.ToBuiltin(String);
    			getboolarray();
    			m_Object = new SerializedObject(target);
    			EditorUtility.SetDirty(target);
   			}
   		}  
   		GUIUtility.hotControl = 0;
    	GUIUtility.keyboardControl = 0;  
   		
 	}
 	
 	
	if(GUILayout.Button ("Generate new key", GUILayout.MinWidth( 124 ))) {
    	newKey = "";
    	newarray = new Array(allKeys.keys);
    	newarray.Add(genKey());	
    	allKeys.keys = newarray.ToBuiltin(String);
    	getboolarray();
    	m_Object = new SerializedObject(target);
    	EditorUtility.SetDirty(target);
    	GUIUtility.hotControl = 0;
    	GUIUtility.keyboardControl = 0;
 	}
 	GUILayout.EndHorizontal();
	m_Object.ApplyModifiedProperties();
}


var settings : boolean;
var minVal : int = 10;
var maxVal : int = 16;

function SaveKeys(){
	var allkeys: String = "";
	for (var i: int=0;i<allKeys.keys.length;i++){
		allkeys+=allKeys.keys[i];
		if (i<allKeys.keys.length-1){
			allkeys+=",";
		}
	}
	EditorPrefs.SetString(PlayerSettings.companyName + PlayerSettings.productName + ".AllKeys", allkeys);
	GUIUtility.hotControl = 0;
    GUIUtility.keyboardControl = 0;
    if (showAlerts){
			EditorUtility.DisplayDialog("Keys Saved", "", "Ok");
	}
}

function LoadKeys(){   				
	if (EditorPrefs.GetString(PlayerSettings.companyName + PlayerSettings.productName + ".AllKeys") == "" || !EditorPrefs.HasKey(PlayerSettings.companyName + PlayerSettings.productName + ".AllKeys")){
		if (showAlerts){
			EditorUtility.DisplayDialog("Nothing to load", "", "Ok");
		}
		}else{
		allKeys.keys=null;
		boolarray = new System.Collections.Generic.List.<boolean>();
		var pt = EditorPrefs.GetString(PlayerSettings.companyName + PlayerSettings.productName + ".AllKeys").Split(","[0]);
		allKeys.keys = pt;
    	getboolarray();
    	m_Object = new SerializedObject(target);
    	EditorUtility.SetDirty(target);
    	m_Object.ApplyModifiedProperties();
    	GUIUtility.hotControl = 0;
    	GUIUtility.keyboardControl = 0;
    	if (showAlerts){
			EditorUtility.DisplayDialog("Loaded Successfully", "", "Ok");
		}
	}
}

function OnInspectorUpdate() {
  	this.Repaint();
  	
}
	    
function getboolarray(){
		if (allKeys!=null){
			boolarray = new System.Collections.Generic.List.<boolean>();
    		for (var i: int=0; i<allKeys.keys.length;i++){
    			boolarray.Add (false);
    		}
    	}
}    
	    
	    
function getToogle(){
		_toggleArray = new Array();
			for (var i: int = 0; i<boolarray.Count; i++){
				if (boolarray[i]){
					_toggleArray.Add(i);
				}
			}
		if (_toggleArray.Count > 0){
			return true;
		}else{
			return false;
		}

	}
	
}

