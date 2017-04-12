import System;
import System.IO;
import System.Collections.Generic;
import System.Text;
import Microsoft.Win32;


class PlayerPrefsEliteEditor extends EditorWindow {

	var icologo: Texture2D;
	var aboutlogo: Texture2D;
	private var editorSkin: GUISkin;
	private var isLoaded: boolean = false;
	private var sort: boolean = false;
	private var sortaz: boolean = false;
	var tryedit: boolean = false;
	var editkey: int=0;
	private var olddata: System.Object;
	private var _loadFiles : boolean = false;
	private var path: String;
	var icostandart: Texture2D;
	var icosecure: Texture2D;
	var icolocked: Texture2D;
	var myString = "Hello World";
	var groupEnabled = false;
	var myBool = true;
	var myFloat = 1.23;
	private var secureKeysManager : SecureKeysManager;
	private var scrollPosition: Vector2;
	private var scrollPositionEdit: Vector2;
	var showAlerts: boolean;
	var deleteLinked: boolean;
	var rtUpdate: boolean;
	var updInterval: float = 0.2f;
	var updIntervalNP: float = 1.0f;
	var showAbout: boolean;
	var showSettings: boolean;
	var isplaying: boolean=false;
	var showCode: boolean;
	var showInfo: boolean;
	var saveProtected: boolean;
	var lockProtected: boolean;
	var showdrop= new boolean[6];
	var sortid:int=0;
	private var keyfieldsize: int = 80;
	private var valuefieldsize: int = 227;

	@MenuItem ("Window/PlayerPrefs Elite")

	static function Init () {
		var window = ScriptableObject.CreateInstance.<PlayerPrefsEliteEditor>();
    	window.Show();
	}
    
	function setDefault(){
   		EditorPrefs.SetInt("PPEshowAlerts",1);
   		EditorPrefs.SetInt("PPEdeleteLinked",1);
   		EditorPrefs.SetInt("PPElockProtected",1);
		EditorPrefs.SetInt("rtUpdate",1);
		EditorPrefs.SetFloat("updInterval",0.3);
		EditorPrefs.SetInt("PPEkeyfieldsize",80);
		EditorPrefs.SetInt("PPEvaluefieldsize",227);
	}
    var warningicon: Texture2D;
    
	function SetGFX(){
		var path: String = "Assets/Editor/PlayerPrefsElite/Gui/Images/";
		if (EditorGUIUtility.isProSkin){
			icologo = AssetDatabase.LoadAssetAtPath(path + "dark-pp-menu-background.png", Texture2D) as Texture2D; 
			aboutlogo = AssetDatabase.LoadAssetAtPath(path + "dark-texture-about.png", Texture2D) as Texture2D;
			icostandart = AssetDatabase.LoadAssetAtPath(path + "dark-icon-data.png", Texture2D) as Texture2D; 
			icosecure = AssetDatabase.LoadAssetAtPath(path + "dark-icon-data-sheeld.png", Texture2D) as Texture2D; 
			icolocked = AssetDatabase.LoadAssetAtPath(path + "dark-icon-data-sheeld-locked.png", Texture2D) as Texture2D; 
			warningicon = AssetDatabase.LoadAssetAtPath(path + "dark-warning-icon.png", Texture2D) as Texture2D; 
		}else{
			icologo = AssetDatabase.LoadAssetAtPath(path + "pp-menu-background.png", Texture2D) as Texture2D; 
			aboutlogo = AssetDatabase.LoadAssetAtPath(path + "texture-about.png", Texture2D) as Texture2D; 
			icostandart = AssetDatabase.LoadAssetAtPath(path + "icon-data.png", Texture2D) as Texture2D; 
			icosecure = AssetDatabase.LoadAssetAtPath(path + "icon-data-sheeld.png", Texture2D) as Texture2D; 
			icolocked = AssetDatabase.LoadAssetAtPath(path + "icon-data-sheeld-locked.png", Texture2D) as Texture2D; 
			warningicon = AssetDatabase.LoadAssetAtPath(path + "warning-icon.png", Texture2D) as Texture2D; 
		}
		LoadSkin();
		EditorApplication.RepaintProjectWindow();
	}
    
	function LoadSkin(){
		if (EditorGUIUtility.isProSkin){
			editorSkin = AssetDatabase.LoadAssetAtPath("Assets/Editor/PlayerPrefsElite/Gui/Images/skind.guiskin", GUISkin) as GUISkin; 
		}else{
			editorSkin = AssetDatabase.LoadAssetAtPath("Assets/Editor/PlayerPrefsElite/Gui/Images/skin.guiskin", GUISkin) as GUISkin; 
		}
	}

	function OnEnable(){	
    	if (!EditorPrefs.HasKey("PPEshowAlerts")){
			setDefault();
		}	
		tryedit=false;
		showAlerts = EditorPrefs.GetInt("PPEshowAlerts")  == 1 ? true : false;
		deleteLinked = EditorPrefs.GetInt("PPEdeleteLinked")  == 1 ? true : false;
		lockProtected = EditorPrefs.GetInt("PPElockProtected")  == 1 ? true : false;
		updInterval = EditorPrefs.GetFloat("updInterval");    
		isplaying=EditorApplication.isPlaying;
		tmpTime=0;
		SetGFX();
	}

	private var  _names = new System.Collections.Generic.List.<String>();
	private var _key: String[];
	private var _oldkey: String[];
	private var _newkey: String[];
	private var _value: Object[];
    
	class _PlayerPrefs{
   		var key: String;
   		var value: Object;
   		var type: String = "other";
   		var secure: boolean=false;
   		var locked: boolean=false;
   		var securename: String = null;
   		var linkid: int;
   		var keyid: int;
   		var array: boolean=false;
   		var bool: boolean = false;
	}

	var _file: FileInfo;
	var data : _PlayerPrefs[];
	private var _plist: Dictionary.<String, Object>;
    
	function loadFiles(){

		if (Application.platform == RuntimePlatform.OSXEditor){
			_file = new FileInfo(Environment.GetFolderPath(Environment.SpecialFolder.Personal) + "/Library/Preferences/" + "unity." + PlayerSettings.companyName + "." + PlayerSettings.productName + ".plist");
			if (_file.Exists){
				_plist = PlistCS.Plist.readPlist(_file.FullName) as Dictionary.<String, Object>;		
				_key = new String[_plist.Count];
				_value = new Object[_plist.Count];
				_plist.Keys.CopyTo(_key, 0);
    			_plist.Values.CopyTo(_value, 0);
      			data = new _PlayerPrefs[_plist.Count];        
				for (var i: int = 0; i<_plist.Count;i++){
					data[i] = new _PlayerPrefs();
					data[i].key = _key[i];
					data[i].value = _value[i];
					if (_value[i].GetType() == typeof(String)){
						data[i].type = "string";
					}else
					if (_value[i].GetType() == typeof(int)){
						data[i].type = "int";
					}else
					if (_value[i].GetType() == typeof(double)){
						data[i].type = "float";
					}else{
						data[i].type = "other";
					}
					for (var y: int=0; y<secureKeysManager.keys.length; y++){
						if (PlayerPrefs.HasKey(PlayerPrefsElite.sum((PlayerPrefsElite.prefix+data[i].key), secureKeysManager.keys[y] ))){
							data[i].secure = true;
							data[i].securename = PlayerPrefsElite.sum(PlayerPrefsElite.prefix+data[i].key, secureKeysManager.keys[y] );
							data[i].keyid = y;
							break;
						}else
						if (PlayerPrefs.HasKey(PlayerPrefsElite.sum((PlayerPrefsElite.prefix2+data[i].key), secureKeysManager.keys[y] ))){
							data[i].secure = true;
							data[i].array = true;
							data[i].securename = PlayerPrefsElite.sum(PlayerPrefsElite.prefix2+data[i].key, secureKeysManager.keys[y] );
							data[i].keyid = y;
							break;
						}else
						if (PlayerPrefs.HasKey(PlayerPrefsElite.sum((PlayerPrefsElite._prefix2+data[i].key), secureKeysManager.keys[y] ))){
							data[i].secure = true;
							data[i].bool = true;
							data[i].securename = PlayerPrefsElite.sum(PlayerPrefsElite._prefix2+data[i].key, secureKeysManager.keys[y] );
							data[i].keyid = y;
							break;
						}else
						if (data[i].key.Length>3){
							if (data[i].key.Substring(0,3)==PlayerPrefsElite._prefix){
								data[i].locked = true;
								data[i].keyid = y;
								break;
							}
						}
					}
				}			
				if (sort){
					var sortArray: Array;
					sortArray = new Array();
					for (var x: int = 0; x<data.length; x++){
						sortArray.push(data[x].key);
					}
					if (sortaz){
						sortArray.Sort(SortStringA);
					}else{
						sortArray.Sort(SortStringB);
					}
					var tempdata: _PlayerPrefs[];
					tempdata =  new _PlayerPrefs[_plist.Count];      
					for (i=0; i<_plist.Count;i++){
						for(x=0;x<_plist.Count;x++){
							if (data[x].key==sortArray[i]){
								tempdata[i]=data[x];
								break;
							}
						}		
					}
					data = tempdata;
				}
				for (i=0;i<data.length;i++){
		 			if (data[i].secure == true){
		 		 		for (y=0;y<data.length;y++){
		 	 				if (data[i].securename == data[y].key){
		 	 					data[y].secure = true;
		 	 					data[y].locked = true;
		 	 					data[y].linkid = i;
		 	 					data[i].linkid = y; 
		 	 				}		 	 
		 	 			}		
		 	 		}
		 		}
		 		dataold=data;
			}
		}else
		if (Application.platform == RuntimePlatform.WindowsEditor){
			var unityKey: RegistryKey = Registry.CurrentUser.CreateSubKey("Software\\Unity\\UnityEditor\\" + PlayerSettings.companyName + "\\" + PlayerSettings.productName);

			_newkey = unityKey.GetValueNames();
			if (_newkey == _oldkey){
				return;
			}
			_oldkey = _newkey;
			_key= unityKey.GetValueNames();
			_value = new Object[_key.Length];
		
      		data = new _PlayerPrefs[_key.Length];        
			for ( i = 0; i<_key.Length;i++){
				data[i] = new _PlayerPrefs();
				data[i].key = _key[i].Substring(0, _key[i].LastIndexOf("_"));
				if (PlayerPrefs.GetString(_key[i], "String") != "String"){
					data[i].type = "string";
				}else
				if (PlayerPrefs.GetString(_key[i], "gnirtS") != "gnirtS"){
					data[i].type = "string";
				}else
				if (PlayerPrefs.GetInt(_key[i], 1) != 1){
					data[i].type = "int";
				}else
				if (PlayerPrefs.GetInt(_key[i], 0) != 0){
					data[i].type = "int";
				}else
				if (PlayerPrefs.GetFloat(_key[i], 1.0f) != 1.0f){
					data[i].type = "float";
				}else
				if (PlayerPrefs.GetFloat(_key[i], 0.0f) != 0.0f){
					data[i].type = "float";
				}else{
					data[i].type = "other";
				}
				for (y=0; y<secureKeysManager.keys.length; y++){
					if (PlayerPrefs.HasKey(PlayerPrefsElite.sum((PlayerPrefsElite.prefix+data[i].key), secureKeysManager.keys[y] ))){
						data[i].secure = true;
						data[i].securename = PlayerPrefsElite.sum(PlayerPrefsElite.prefix+data[i].key, secureKeysManager.keys[y] );
						data[i].keyid = y;
						break;
					}else
					if (PlayerPrefs.HasKey(PlayerPrefsElite.sum((PlayerPrefsElite.prefix2+data[i].key), secureKeysManager.keys[y] ))){
						data[i].secure = true;
						data[i].array = true;
						data[i].securename = PlayerPrefsElite.sum(PlayerPrefsElite.prefix2+data[i].key, secureKeysManager.keys[y] );
						data[i].keyid = y;
						break;
					}else
					if (PlayerPrefs.HasKey(PlayerPrefsElite.sum((PlayerPrefsElite._prefix2+data[i].key), secureKeysManager.keys[y] ))){
						data[i].secure = true;
						data[i].bool = true;
						data[i].securename = PlayerPrefsElite.sum(PlayerPrefsElite._prefix2+data[i].key, secureKeysManager.keys[y] );
						data[i].keyid = y;
						break;
					}else
					if (data[i].key.Length>3){
						if (data[i].key.Substring(0,3)==PlayerPrefsElite._prefix){
							data[i].locked = true;
							data[i].keyid = y;
							break;
						}
					}
				}
			}
		
			if (sort){
				sortArray = new Array();
				for (x = 0; x<data.length; x++){
					sortArray.push(data[x].key);
				}
				if (sortaz){
					sortArray.Sort(SortStringA);
				}else{
					sortArray.Sort(SortStringB);
				}
				tempdata =  new _PlayerPrefs[_key.Length];      
				for (i=0; i<_plist.Count;i++){
					for(x=0;x<_plist.Count;x++){
						if (data[x].key==sortArray[i]){
							tempdata[i]=data[x];
							break;
						}
					}		
				}
				data = tempdata;
			}
			for (i=0;i<data.length;i++){
		 		if (data[i].secure == true){
		 	 		for (y=0;y<data.length;y++){
		 	 			if (data[i].securename == data[y].key){
		 	 				data[y].secure = true;
		 	 				data[y].locked = true;
		 	 				data[y].linkid = i;
		 	 				data[i].linkid = y; 
		 	 			}		 	 
		 	 		}		
		 	 	}
		 	}
		}
	}

	var objNames : String = "";

	function SortStringA(a: String, b: String){
		return String.Compare(a, b);
	}

	function SortStringB(a: String, b: String){
		return String.Compare(b, a);
	}
        
	function StringToUTF8ByteArray(pXmlString : String){
		var encoding : UTF8Encoding  = new UTF8Encoding();
		var byteArray : byte[]  = encoding.GetBytes(pXmlString);
		return byteArray;
	}   


	function resetmenu(){
		if (showAbout){
			showAbout = !showAbout;
		}
		if (showSettings){
			showSettings = !showSettings;
		}
	}

	function disablemenu(id: int){
		for(var i:int=1;i<6;i++){
			if (i!=id){
				showdrop[i]=false;
			}
		}
	}

	function OnGUI () {
		if( editorSkin == null ){
			editorSkin = AssetDatabase.LoadAssetAtPath("Assets/Editor/PlayerPrefsElite/Gui/Images/skin.guiskin", GUISkin) as GUISkin; 	  
		}
	
		var myStyle: GUIStyle = new GUIStyle (GUI.skin.toggle);
    	myStyle.overflow.top=-2;  	
    
    	GUILayout.Label(icologo, editorSkin.customStyles[11], GUILayout.Width(438), GUILayout.Height(126)); 
  		if (GUI.Button(Rect(4,63,92,62), "", editorSkin.customStyles[12])){
   			if (tryedit)return;
   			disablemenu(0);
        	loadFiles();
        	PlayerPrefs.Save();
		} 
	
		if (!showdrop[0] && !showdrop[1]){
			if (GUI.Button(Rect(97,63,111,62), "", editorSkin.customStyles[13])){
				if (tryedit)return;
				disablemenu(1);
				showdrop[1] = !showdrop[1];
			} 
		}else
		if (showdrop[0] && !showdrop[1]){
			if (GUI.Button(Rect(97,63,111,62), "", editorSkin.customStyles[14])){
				if (tryedit)return;
				disablemenu(1);
				showdrop[1] = !showdrop[1];
			} 
		}
		if (!showdrop[0] && showdrop[1]){
			if (GUI.Button(Rect(97,63,111,62), "", editorSkin.customStyles[41])){
				if (tryedit)return;
				disablemenu(1);
				showdrop[1] = !showdrop[1];
			} 
		}else
		if (showdrop[0] && showdrop[1]){
			if (GUI.Button(Rect(97,63,111,62), "", editorSkin.customStyles[42])){
				if (tryedit)return;
				disablemenu(1);
				showdrop[1] = !showdrop[1];
			} 
		}
	
	
		if (!showdrop[2] && sortid==0 && !showdrop[3]){
			if (GUI.Button(Rect(209,63,123,62), "", editorSkin.customStyles[15])){
				if (tryedit)return;
				disablemenu(3);
				showdrop[3] = !showdrop[3];
			} 
		}else
		if (!showdrop[2] && sortid==0 && showdrop[3]){
			if (GUI.Button(Rect(209,63,123,62), "", editorSkin.customStyles[43])){
				if (tryedit)return;
				disablemenu(3);
				showdrop[3] = !showdrop[3];
			} 
		}else
		if (!showdrop[2] && sortid==1 && !showdrop[3]){
			if (GUI.Button(Rect(209,63,123,62), "", editorSkin.customStyles[16])){
				if (tryedit)return;
				disablemenu(3);
				showdrop[3] = !showdrop[3];
			} 
		}
		else
		if (!showdrop[2] && sortid==1 && showdrop[3]){
			if (GUI.Button(Rect(209,63,123,62), "", editorSkin.customStyles[44])){
				if (tryedit)return;
				disablemenu(3);
				showdrop[3] = !showdrop[3];
			} 
		}
		else
		if (!showdrop[2] && sortid==2 && !showdrop[3]){
			if (GUI.Button(Rect(209,63,123,62), "", editorSkin.customStyles[17])){
				if (tryedit)return;
				disablemenu(3);
				showdrop[3] = !showdrop[3];
			} 
		}else
		if (!showdrop[2] && sortid==2 && showdrop[3]){
			if (GUI.Button(Rect(209,63,123,62), "", editorSkin.customStyles[45])){
				if (tryedit)return;
				disablemenu(3);
				showdrop[3] = !showdrop[3];
			} 
		}
	
		if (!showdrop[4]){
			if (GUI.Button(Rect(333,63,56,62), "", editorSkin.customStyles[18])){
				disablemenu(4);
				showdrop[4] = !showdrop[4];
			}
		}else{
			if (GUI.Button(Rect(333,63,56,62), "", editorSkin.customStyles[39])){
				disablemenu(4);
				showdrop[4] = !showdrop[4];
			}	
		}
		if (!showdrop[5]){
			if (GUI.Button(Rect(390,63,50,62), "", editorSkin.customStyles[19])){
				disablemenu(5);
				showdrop[5] = !showdrop[5];
			} 
		}else{
			if (GUI.Button(Rect(390,63,50,62), "", editorSkin.customStyles[40])){
				disablemenu(5);
				showdrop[5] = !showdrop[5];
			} 
		}
	
		if (showdrop[5]){
	
			GUILayout.BeginHorizontal ();
 			GUILayout.Label(aboutlogo, editorSkin.customStyles[11]); 
 			GUILayout.FlexibleSpace();
			GUILayout.EndHorizontal ();
	
			if (GUI.Button(Rect(61,270,114,21), "", editorSkin.customStyles[20])){
				Application.OpenURL ("http://unityplugins.eu");
			} 
			GUILayout.Space (60);
		}
	
		if (showdrop[4]){
			GUILayout.Space (15);
       		GUILayout.BeginHorizontal();
       		GUILayout.Label("", GUILayout.Width( 10 ));
       		GUILayout.Label("Show Alerts", GUILayout.Width( 90 ));
       		showAlerts = EditorGUILayout.Toggle(showAlerts, myStyle);
			GUILayout.EndHorizontal();

	 	  	GUILayout.BeginHorizontal();
    	   	GUILayout.Label("", GUILayout.Width( 10 ));
       		GUILayout.Label("Delete Linked", GUILayout.Width( 90 ));
       		deleteLinked = EditorGUILayout.Toggle(deleteLinked, myStyle);
			GUILayout.EndHorizontal();
		
			GUILayout.BeginHorizontal();
    	   	GUILayout.Label("", GUILayout.Width( 10 ));
       		GUILayout.Label("Lock Secure\nData", GUILayout.Width( 90 ));
       		lockProtected = EditorGUILayout.Toggle(lockProtected, myStyle);
			GUILayout.EndHorizontal();
			
			GUILayout.BeginHorizontal();
    	   	GUILayout.Label("", GUILayout.Width( 10 ));
       		GUILayout.Label("Key field size", GUILayout.Width( 90 ));
       		keyfieldsize = EditorGUILayout.IntField ("", keyfieldsize, GUILayout.MaxWidth(30));
			GUILayout.EndHorizontal();
			
			GUILayout.BeginHorizontal();
    	   	GUILayout.Label("", GUILayout.Width( 10 ));
       		GUILayout.Label("Value field size", GUILayout.Width( 90 ));
       		valuefieldsize = EditorGUILayout.IntField ("", valuefieldsize, GUILayout.MaxWidth(30));
			GUILayout.EndHorizontal();
		
			GUILayout.BeginHorizontal();
    	    GUILayout.FlexibleSpace();
			GUILayout.Label("Time, sec:", GUILayout.MinWidth( Screen.width-332));
        	GUILayout.EndHorizontal();   	
        
	        GUILayout.BeginHorizontal();    	
    	    GUILayout.Label("", GUILayout.Width( 10 ));
        	GUILayout.Label("Update interval \nin play mode:", GUILayout.Width( 90 ));
        	updInterval = GUILayout.HorizontalSlider (updInterval, 0.1, 2.0, GUILayout.MaxWidth( 201));
			updInterval = EditorGUILayout.FloatField(updInterval, GUILayout.Width( 72 ));
			if (updInterval<0.1){
				updInterval=0.1;
			}
			if (updInterval>2){
				updInterval=2;
			}
			GUILayout.EndHorizontal();
		
			GUILayout.Space (10);
			GUILayout.BeginHorizontal();    	
        	GUILayout.Label("", GUILayout.Width( 10 ));
			if(GUILayout.Button ("Reset to Default", GUILayout.Width( 105 ) )){
				setDefault();
				showAlerts = EditorPrefs.GetInt("PPEshowAlerts")  == 1 ? true : false;
				deleteLinked = EditorPrefs.GetInt("PPEdeleteLinked")  == 1 ? true : false;
				rtUpdate = EditorPrefs.GetInt("rtUpdate")  == 1 ? true : false;
				lockProtected = EditorPrefs.GetInt("PPElockProtected")  == 1 ? true : false;
				updInterval = EditorPrefs.GetFloat("updInterval");   
				keyfieldsize = 80;
				valuefieldsize = 227;
			}
			GUILayout.EndHorizontal();
			
			GUILayout.Space (10);
			GUILayout.BeginHorizontal();
			GUILayout.Label("", GUILayout.Width( 10 ));
			GUILayout.Label("Removes all keys\nand values from\nthe preferences", GUILayout.Width( 120 ));
			GUILayout.EndHorizontal();
			
			GUILayout.Space (10);
			GUILayout.BeginHorizontal();    	
        	GUILayout.Label("", GUILayout.Width( 10 ));
			if(GUILayout.Button ("Delete All", GUILayout.Width( 105 ) )){
				if (showAlerts){
     				if (EditorUtility.DisplayDialog("Delete all keys and values from the preferences?", "This operation cannot be undone", "Yes", "Cancel")){
     					PlayerPrefs.DeleteAll();
						PlayerPrefs.Save();	
					}	
	    		}else{
	    			PlayerPrefs.DeleteAll();
					PlayerPrefs.Save();	
	    		}
			}
			
			GUILayout.EndHorizontal();
			
		 
			GUILayout.Space (10);
			if(GUI.changed){
    			EditorPrefs.SetInt("PPEshowAlerts", showAlerts ? 1 : 0);    
    			EditorPrefs.SetInt("PPEdeleteLinked", deleteLinked ? 1 : 0);    
    			EditorPrefs.SetInt("PPElockProtected", lockProtected ? 1 : 0);  
    			EditorPrefs.SetFloat("updInterval", updInterval);  
    			EditorPrefs.SetInt("PPEkeyfieldsize", keyfieldsize);
				EditorPrefs.SetInt("PPEvaluefieldsize", valuefieldsize);  
    		}
		}
	
			
	    if (secureKeysManager==null){
    		GUILayout.Space (40);
	    	GUILayout.Box ("",  editorSkin.customStyles[57], GUILayout.MaxWidth( 438 ));
	    	GUILayout.Box (warningicon,  editorSkin.customStyles[57], GUILayout.MaxWidth( 438 ));
	    	GUILayout.Box ("\nSecureKeysManager prefab not found!\n \n Drag \"SecureKeysManager\" prefab into Hierarchy\n(from Project tab - \"PlayerPrefsElite/Prefab/\")\n",  editorSkin.customStyles[57], GUILayout.MaxWidth( 438 )); 
   			return;
    	}else
	    if (secureKeysManager.keys.length < 1){
    		GUILayout.Space (40);
	    	GUILayout.Box ("",  editorSkin.customStyles[57], GUILayout.MaxWidth( 438 ));
	    	GUILayout.Box (warningicon,  editorSkin.customStyles[57], GUILayout.MaxWidth( 438 ));
	    	GUILayout.Box("\n   Generate new key in \"SecureKeysManager\"\t\n",  editorSkin.customStyles[57], GUILayout.MaxWidth( 438 ));    	
    	
		   return;
    	}


		if (data!=null){
			GUILayout.Space (20);

		    if (tryedit){
    			GUILayout.Space(2);
				scrollPositionEdit = GUILayout.BeginScrollView(scrollPositionEdit);
				GUILayout.Space (2);	
   				GUILayout.BeginHorizontal();
  				GUILayout.Box(new GUIContent(getImage(data[editkey].secure, data[editkey].locked), secureString(editkey)),  editorSkin.customStyles[36], GUILayout.Width(20));
  				GUILayout.Label(data[editkey].key, editorSkin.customStyles[37], GUILayout.Width(100), GUILayout.Height(30));
  				GUILayout.Label("", editorSkin.customStyles[6], GUILayout.Width(10));
 				
  				if (data[editkey].type=="string"){
  			
		  			olddata = EditorGUILayout.TextField ("", olddata,  GUILayout.MinWidth(30), GUILayout.MaxWidth(227));
  					if (GUILayout.Button(new GUIContent("", "Restore"), editorSkin.customStyles[48])){
  						GUIUtility.hotControl = 0;
    					GUIUtility.keyboardControl = 0;
						olddata = GetValue(data[editkey].key, data[editkey].type);
     				}
  				}else
  				if (data[editkey].type=="int"){
  					olddata = EditorGUILayout.IntField ("", olddata, GUILayout.MaxWidth(227));
  					if (GUILayout.Button(new GUIContent("", "Restore"), editorSkin.customStyles[48])){
  						GUIUtility.hotControl = 0;
    					GUIUtility.keyboardControl = 0;
						olddata = GetValue(data[editkey].key, data[editkey].type);
     				}
  				}else
 				if (data[editkey].type=="float"){
  					olddata = EditorGUILayout.FloatField ("", olddata, GUILayout.MaxWidth(227));  
  					if (GUILayout.Button(new GUIContent("", "Restore"), editorSkin.customStyles[48])){
  						GUIUtility.hotControl = 0;
    					GUIUtility.keyboardControl = 0;
						olddata = GetValue(data[editkey].key, data[editkey].type);
     				}		
  				}
  		
    			GUILayout.EndHorizontal();
    			GUILayout.Space (5);
    
    
			if (showInfo){
		
			    GUILayout.BeginHorizontal();
    			GUILayout.Label("Detailed Info", editorSkin.customStyles[46], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.Space (5);
    
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("Name: \t\t\t" + data[editkey].key, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("Value: \t\t\t" + GetValue(data[editkey].key, data[editkey].type).ToString(), editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("Type: \t\t\t" + data[editkey].type, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    
    			if (data[editkey].secure){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secured: \t\tYes", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
     
   					if (!data[editkey].locked){
   						GUILayout.BeginHorizontal();
    					GUILayout.Box("Secure key id: \t" +data[editkey].keyid, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    					GUILayout.EndHorizontal();
    				}
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Linked to: \t\t" +data[data[editkey].linkid].key, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();

    			}
    			if (!data[editkey].secure && data[editkey].locked){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secured: \t\tYes, encrypt", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secure key id: \t" +data[editkey].keyid, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    			}
    			if (data[editkey].array){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secured: \t\tYes, Array", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secure key id: \t" +data[editkey].keyid, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    			}
    			if (data[editkey].bool){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secured: \t\tYes, Boolean", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secure key id: \t" +data[editkey].keyid, editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    			}
    			else{
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Secured: \t\tNo", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();    
    			}
    
    			GUILayout.Space (5);
    			GUILayout.BeginHorizontal();
    			GUILayout.Label("", editorSkin.customStyles[46], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(4));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Label("", GUILayout.Width(262));
    			if (GUILayout.Button(new GUIContent("", "Hide Detailed Info"), editorSkin.customStyles[51], GUILayout.Width(110), GUILayout.Height(20) )){
					showInfo = false;
				}
				GUILayout.EndHorizontal();
			}else{
    
   				GUILayout.BeginHorizontal();
    			GUILayout.Label("Detailed Info", editorSkin.customStyles[46], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.Space (5);
    
    			GUILayout.BeginHorizontal();
    			GUILayout.Label("", GUILayout.Width(262));
    			if (GUILayout.Button(new GUIContent("", "Show Detailed Info"), editorSkin.customStyles[50], GUILayout.Width(110), GUILayout.Height(20) )){
					showInfo = true;
				}	
				GUILayout.EndHorizontal();
   			}
    
    		GUILayout.Space (10);
    		if (data[editkey].locked){
    			saveProtected=false;
    			GUI.enabled = false;
    		}
    
		    if (showCode){
			    GUILayout.BeginHorizontal();
    			GUILayout.Label("Code Example", editorSkin.customStyles[46], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.Space (5);
	    		GUILayout.BeginHorizontal();
    			GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(4)); 
    			GUILayout.EndHorizontal();  
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("Save value:", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    
		    	if (data[editkey].type=="string" && !data[editkey].array){  
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("static function PlayerPrefsElite.SetString (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("\tkey : String, value : String, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    		
		    		GUILayout.BeginHorizontal();
    				GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Example:", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    
	   			if (data[editkey].keyid==0){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetString(\"" + data[editkey].key + "\", \"Foobar\");", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetString(\"" + data[editkey].key + "\", \"Foobar\");";
     				}
	     			GUILayout.EndHorizontal();
   				}else{
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetString(\"" + data[editkey].key + "\", \"Foobar\", " + data[editkey].keyid +");", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetString(\"" + data[editkey].key + "\", \"Foobar\", " + data[editkey].keyid +");";
     				}
     				GUILayout.EndHorizontal();
    			}
    		
    		}else
    		if (data[editkey].type=="int" && data[editkey].bool){  
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("static function PlayerPrefsElite.SetBoolean (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("\tkey : String, value : boolean, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    		
		    		GUILayout.BeginHorizontal();
    				GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Example:", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    
	   			if (data[editkey].keyid==0){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetBoolean(\"" + data[editkey].key + "\", true);", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetBoolean(\"" + data[editkey].key + "\", true);";
     				}
	     			GUILayout.EndHorizontal();
   				}else{
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetBoolean(\"" + data[editkey].key + "\", true, " + data[editkey].keyid +");", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetBoolean(\"" + data[editkey].key + "\", true, " + data[editkey].keyid +");";
     				}
     				GUILayout.EndHorizontal();
    			}
    		
    		}else
    		if (data[editkey].type=="string" && data[editkey].array){  
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("static function PlayerPrefsElite.SetStringArray (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("\tkey : String, value : Array, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("static function PlayerPrefsElite.SetIntArray (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("\tkey : String, value : Array, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("static function PlayerPrefsElite.SetFloatArray (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("\tkey : String, value : Array, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    		
    		
    		
		    		GUILayout.BeginHorizontal();
    				GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("Example:", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    				GUILayout.EndHorizontal();
    
	   			if (data[editkey].keyid==0){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("var Foobar: String[];", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				GUILayout.EndHorizontal();
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetStringArray(\"" + data[editkey].key + "\", Foobar);", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetStringArray(\"" + data[editkey].key + "\", Foobar);";
     				}
	     			GUILayout.EndHorizontal();
   				}else{
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetStringArray(\"" + data[editkey].key + "\", Foobar, " + data[editkey].keyid +");", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetStringArray(\"" + data[editkey].key + "\", Foobar, " + data[editkey].keyid +");";
     				}
     				GUILayout.EndHorizontal();
    			}
    		
    		}else
   			if (data[editkey].type=="int"){  
	    		GUILayout.BeginHorizontal();
    			GUILayout.Box("static function PlayerPrefsElite.SetInt (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("\tkey : String, value : int, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("Example:", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    
	   			if (data[editkey].keyid==0){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetInt(\"" + data[editkey].key + "\", 10);", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetInt(\"" + data[editkey].key + "\", 10);";
     				}
     				GUILayout.EndHorizontal();
   				}else{
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetInt(\"" + data[editkey].key + "\",  10, " + data[editkey].keyid +");", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetInt(\"" + data[editkey].key + "\",  10, " + data[editkey].keyid +");";
     				}
     				GUILayout.EndHorizontal();
    			}
   
	     	}else
   			if (data[editkey].type=="float"){ 
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("static function PlayerPrefsElite.SetFloat (", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("\tkey : String, value : float, secureKey : int", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box(") : void", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    		
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    			GUILayout.BeginHorizontal();
    			GUILayout.Box("Example:", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    			GUILayout.EndHorizontal();
    
   				if (data[editkey].keyid==0){
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetFloat(\"" + data[editkey].key + "\", 10.0f);", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetFloat(\"" + data[editkey].key + "\", 10.0f);";
     				}
     				GUILayout.EndHorizontal();
   				}else{
    				GUILayout.BeginHorizontal();
    				GUILayout.Box("PlayerPrefsElite.SetFloat(\"" + data[editkey].key + "\",  10.0f, " + data[editkey].keyid +");", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
    				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  						EditorGUIUtility.systemCopyBuffer = "PlayerPrefsElite.SetFloat(\"" + data[editkey].key + "\",  10.0f, " + data[editkey].keyid +");";
     				}
     				GUILayout.EndHorizontal();
    			}

    		}
    		GUILayout.BeginHorizontal();
    		GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(4)); 
    		GUILayout.EndHorizontal();  
    		GUILayout.Space (5);
                             
  			GUILayout.BeginHorizontal();
    		GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(4)); 
    		GUILayout.EndHorizontal();  
    
    		GUILayout.BeginHorizontal();
    		GUILayout.Box("Verify value:", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    		GUILayout.EndHorizontal();
    		GUILayout.BeginHorizontal();
    		GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    		GUILayout.EndHorizontal();     
                     
		             
    		var dk: String="";
    		if (data[editkey].type=="string" && !data[editkey].array){
    			dk="String";
    		}else
    		if (data[editkey].type=="int" && data[editkey].bool){
    			dk="Boolean";
    		}else
    		if (data[editkey].type=="int"){
    			dk="Int";
    		}else
    		if (data[editkey].type=="float"){
    			dk="Float";
    		}else
    		if (data[editkey].array){
    			dk="Array";
    		}
    		
    		GUILayout.BeginHorizontal();
			GUILayout.Box("PlayerPrefsElite.Verify"+dk+"(key:String, secureKey:int) : boolean", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
			GUILayout.EndHorizontal();
			GUILayout.BeginHorizontal();
   			GUILayout.Box("", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
   			GUILayout.EndHorizontal();
   			GUILayout.BeginHorizontal();
   			GUILayout.Box("Example:", editorSkin.customStyles[47], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
   			GUILayout.EndHorizontal();   
    	
    		if (data[editkey].keyid==0){                                  
				GUILayout.BeginHorizontal();
   				GUILayout.Box("if (!PlayerPrefsElite.Verify"+dk+"(\"" + data[editkey].key + "\")){", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
   				GUILayout.EndHorizontal(); 
   				GUILayout.BeginHorizontal();
   				GUILayout.Box("\t// return false", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
   				GUILayout.EndHorizontal(); 
   				GUILayout.BeginHorizontal();
   				GUILayout.Box("\t// modified value detected", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
   				GUILayout.EndHorizontal(); 
   				GUILayout.BeginHorizontal();
   				GUILayout.Box("\t// do something", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
   				GUILayout.EndHorizontal(); 
   				GUILayout.BeginHorizontal();
   				GUILayout.Box("}", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(18));
   		
   				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  					EditorGUIUtility.systemCopyBuffer = "if (!PlayerPrefsElite.Verify"+dk+"(\"" + data[editkey].key + "\")){\n\t// return false\n\t// modified value detected\n\t// do something\n}";
   				}
   				GUILayout.EndHorizontal();                
   			}else{
    			GUILayout.BeginHorizontal();
   				GUILayout.Box("if (!PlayerPrefsElite.Verify"+dk+"(\"" + data[editkey].key + "\", " + data[editkey].keyid +")){\n\t// return false\n\t// modified value detected\n\t// do something\n}", editorSkin.customStyles[54], GUILayout.MinWidth(100), GUILayout.MaxWidth(343));
   				if (GUILayout.Button(new GUIContent("", "Copy to Clipboard"), editorSkin.customStyles[49])){
  					EditorGUIUtility.systemCopyBuffer = "if (!PlayerPrefsElite.Verify"+dk+"(\"" + data[editkey].key + "\", " + data[editkey].keyid +")){\n\t// return false\n\t// modified value detected\n\t// do something\n}";                
    			} 
    			GUILayout.EndHorizontal();                   
    		}               

	    	GUILayout.Space (5);
    		GUILayout.BeginHorizontal();
    		GUILayout.Label("", editorSkin.customStyles[46], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(4));
    		GUILayout.EndHorizontal();
    		GUILayout.BeginHorizontal();
    		GUILayout.Label("", GUILayout.Width(262));
    		if (GUILayout.Button(new GUIContent("", "Hide Detailed Info"), editorSkin.customStyles[53], GUILayout.Width(110), GUILayout.Height(20) )){
				showCode = false;
			}
			GUILayout.EndHorizontal();
		}else{
   			GUILayout.BeginHorizontal();
    		GUILayout.Label("Code Example", editorSkin.customStyles[46], GUILayout.MinWidth(100), GUILayout.MaxWidth(343), GUILayout.Height(16));
    		GUILayout.EndHorizontal();
    		GUILayout.Space (5);
    
    		GUILayout.BeginHorizontal();
    		GUILayout.Label("", GUILayout.Width(262));
    		if (GUILayout.Button(new GUIContent("", "Show Code Example"), editorSkin.customStyles[52], GUILayout.Width(110), GUILayout.Height(20) )){
				showCode = true;
			}
			GUILayout.EndHorizontal();
    	}
    
    	GUILayout.Space (15);
    	GUILayout.BeginHorizontal();
    	GUILayout.Label("", GUILayout.Width( 25 ));
    	saveProtected = EditorGUILayout.Toggle(saveProtected, myStyle, GUILayout.Width(20));
    	if (data[editkey].secure){
    		GUILayout.Label("Save as protected", GUILayout.Width(200 ), GUILayout.Height(18));
    	}else{
    		GUILayout.Label("Convert to protected", GUILayout.Width(200 ), GUILayout.Height(18));
    	}
		GUILayout.EndHorizontal();
    	GUILayout.Space (20);
    	if (!GUI.enabled){
			GUI.enabled = true;
		}	
 		GUILayout.BeginHorizontal();
 		GUILayout.Label("", GUILayout.Width(25));
		if(GUILayout.Button ("Save", GUILayout.Width(100), GUILayout.Width(105) )){
			if (saveProtected){
				PlayerPrefsElite.setKeys(secureKeysManager.keys);
				if (data[editkey].secure){
					if (data[editkey].type=="string" && !data[editkey].array){
						PlayerPrefsElite.SetString(data[editkey].key, olddata, data[editkey].keyid);
					}else
					if (data[editkey].type=="int" && data[editkey].bool){
						PlayerPrefsElite.SetBoolean(data[editkey].key, olddata, data[editkey].keyid);
					}else
					if (data[editkey].type=="int"){
						PlayerPrefsElite.SetInt(data[editkey].key, olddata, data[editkey].keyid);
					}else
					if (data[editkey].type=="float"){
						PlayerPrefsElite.SetFloat(data[editkey].key, olddata, data[editkey].keyid);
					}else
					if (data[editkey].type=="string" && data[editkey].array){
						PlayerPrefs.SetString(data[editkey].key, olddata);
						PlayerPrefs.SetString(PlayerPrefsElite.sum(PlayerPrefsElite.prefix2+data[editkey].key, PlayerPrefsElite.key[data[editkey].keyid]), PlayerPrefsElite.sum(olddata.ToString(), PlayerPrefsElite.key[data[editkey].keyid]));
					}
				}else{
					if (data[editkey].type=="string"){
						PlayerPrefsElite.SetString(data[editkey].key, olddata);
					}else
					if (data[editkey].type=="int"){
						PlayerPrefsElite.SetInt(data[editkey].key, olddata);
					}else
					if (data[editkey].type=="float"){
						PlayerPrefsElite.SetFloat(data[editkey].key, olddata);
					}
				}
				PlayerPrefs.Save();		
				GUIUtility.hotControl = 0;
    			GUIUtility.keyboardControl = 0;
    			tryedit=false;
			}else{
				if (data[editkey].type=="string"){
					PlayerPrefs.SetString(data[editkey].key, olddata);
				}else
				if (data[editkey].type=="int"){
					PlayerPrefs.SetInt(data[editkey].key, olddata);
				}else
				if (data[editkey].type=="float"){
					PlayerPrefs.SetFloat(data[editkey].key, olddata);
				}
				GUIUtility.hotControl = 0;
    			GUIUtility.keyboardControl = 0;
    			tryedit=false;
			}
		}
	
		GUILayout.Label("", GUILayout.Width(2));
	
		if(GUILayout.Button ("Cancel", GUILayout.Width( 100 ), GUILayout.Width(105))){
			GUIUtility.hotControl = 0;
    		GUIUtility.keyboardControl = 0;
    		tryedit=false;
 		}
 	
	 	GUILayout.EndHorizontal();
 	
 		EditorGUILayout.EndScrollView();
		GUILayout.Space(5);
	
    	return;
    	}
   
 		GUILayout.Space(5);
		scrollPosition = GUILayout.BeginScrollView(scrollPosition) ;

 		for (var i: int = 0; i < data.Length; i++){
 			if (showException(i)){
				EditorGUILayout.BeginHorizontal();
 		
 				GUILayout.Box(new GUIContent(getImage(data[i].secure, data[i].locked), secureString(i)), editorSkin.customStyles[36], GUILayout.Width(20));
				GUILayout.Label(data[i].key, editorSkin.customStyles[37], GUILayout.Width(keyfieldsize), GUILayout.MaxHeight(30));
				GUILayout.Label("", editorSkin.customStyles[6], GUILayout.Width(10));
				GUILayout.Label(GetValue(data[i].key, data[i].type).ToString(), editorSkin.customStyles[38], GUILayout.MinWidth(30), GUILayout.MaxWidth(valuefieldsize),GUILayout.Height(30) );
				
 				if (PlayerPrefs.HasKey(data[i].key)){
 					if (lockProtected && data[i].locked){
 						if (GUILayout.Button(new GUIContent("", "Locked"), editorSkin.customStyles[34])){}
 					}else{
 						if (GUILayout.Button(new GUIContent("", "Edit"), editorSkin.customStyles[33])){
							editkey=i;
							olddata = GetValue(data[i].key, data[i].type);
							showInfo = false;
							showCode = false;
							if (data[i].secure){
								saveProtected = true;
							}else{
								saveProtected = false;
							}
							disablemenu(0);
							tryedit = true;
     					}
     				}
 				}
 			
 				if (PlayerPrefs.HasKey(data[i].key)){
 					if (lockProtected && data[i].locked){
 						GUILayout.Label("", editorSkin.customStyles[6], GUILayout.Width(11));
 						if (GUILayout.Button(new GUIContent("", "Locked"),editorSkin.customStyles[32])){}
 					}else{
     					GUILayout.Label("", editorSkin.customStyles[6], GUILayout.Width(11));
     					if (GUILayout.Button(new GUIContent("", "Delete"),editorSkin.customStyles[31])){
     						if (showAlerts){
     							if (EditorUtility.DisplayDialog("Delete \"" + data[i].key  + "\" Key", "This operation cannot be undone", "Yes", "Cancel")){
     								PlayerPrefs.DeleteKey(data[i].key);
									if (deleteLinked){
										PlayerPrefs.DeleteKey(data[i].securename);
										if (data[i].locked){
											PlayerPrefs.DeleteKey(data[data[i].linkid].key);
										}
									}
									PlayerPrefs.Save();	
								}	
	    					}else{
								PlayerPrefs.DeleteKey(data[i].key);
								if (deleteLinked){
									PlayerPrefs.DeleteKey(data[i].securename);
									if (data[i].locked){
										PlayerPrefs.DeleteKey(data[data[i].linkid].key);
									}
								}
								PlayerPrefs.Save();	
							}				
     					}
     				}
 				}else{
 					if (GUILayout.Button("",editorSkin.customStyles[35])){}
	    			GUILayout.Label("", editorSkin.customStyles[6], GUILayout.Width(11));
	    			if (GUILayout.Button("",editorSkin.customStyles[32])){}	
 					}
 					EditorGUILayout.EndHorizontal();
 				}
    		}
    		EditorGUILayout.EndScrollView();
			GUILayout.Space(5);
		}
	
		if (showdrop[1] && !showdrop[0]){
			if (GUI.Button(Rect(97,125,112,25), "", editorSkin.customStyles[23])){
				showdrop[1] = !showdrop[1];
			} 
			if (GUI.Button(Rect(97,150,112,25), "", editorSkin.customStyles[22])){	
				showdrop[1] = !showdrop[1];
				showdrop[0] = !showdrop[0];
				showall = true;
			} 
		}
		if (showdrop[1] && showdrop[0]){
			if (GUI.Button(Rect(97,125,112,25), "", editorSkin.customStyles[24])){
				showdrop[1] = !showdrop[1];
				showdrop[0] = !showdrop[0];
				showall = false;
			} 
			if (GUI.Button(Rect(97,150,112,25), "", editorSkin.customStyles[21])){	
				showdrop[1] = !showdrop[1];
			} 
		}
	
		if (showdrop[3]){
			if (sortid==0){
			if (GUI.Button(Rect(209,125,126,25), "", editorSkin.customStyles[27])){
				showdrop[3] = !showdrop[3];
				sortid=0;
				sort = false;
			} 
			if (GUI.Button(Rect(209,150,126,21), "", editorSkin.customStyles[26])){	
				showdrop[3] = !showdrop[3];
				sortid=1;
				sort=true;
				sortaz=true;
			} 
			if (GUI.Button(Rect(209,171,126,25), "", editorSkin.customStyles[30])){	
				showdrop[3] = !showdrop[3];
				sortid=2;
				sort=true;
				sortaz=false;
			}
		}else
		if (sortid==1){
			if (GUI.Button(Rect(209,125,126,25), "", editorSkin.customStyles[28])){
				showdrop[3] = !showdrop[3];
				sortid=0;
				sort = false;
			} 
			if (GUI.Button(Rect(209,150,126,21), "", editorSkin.customStyles[25])){
				showdrop[3] = !showdrop[3];
				sortid=1;
				sort=true;
				sortaz=true;
			} 
			if (GUI.Button(Rect(209,171,126,25), "", editorSkin.customStyles[30])){
				showdrop[3] = !showdrop[3];
				sortid=2;
				sort=true;
				sortaz=false;
			}
		}else
		if (sortid==2){
			if (GUI.Button(Rect(209,125,126,25), "", editorSkin.customStyles[28])){
				showdrop[3] = !showdrop[3];
				sortid=0;
				sort = false;
				sort = false;
			} 
			if (GUI.Button(Rect(209,150,126,21), "", editorSkin.customStyles[26])){	
				showdrop[3] = !showdrop[3];
				sortid=1;
				sort=true;
				sortaz=true;
			} 
			if (GUI.Button(Rect(209,171,126,25), "", editorSkin.customStyles[29])){	
				showdrop[3] = !showdrop[3];
				sortid=2;
				sort=true;
				sortaz=false;
				}
			}
		}
	} 

	function getImage(secure: boolean, locked: boolean){
		if (!secure && !locked){
    		return icostandart;
    	}else
    	if (secure && !locked){
    		return icosecure;
    	}else
    	if (!secure && locked){
    		return icolocked;
    	}else
    	if (secure && locked){
    		return icolocked;
    	}else{
    		return icostandart;
    	}
	}
    
	function  secureString(i: int){
		var returnString: String="";
		if (data[i].secure && data[i].locked){
			returnString = "This data is protected, identified by key \"" +data[data[i].linkid].key + "\"";
		}else
		if (data[i].secure && !data[i].locked){
			returnString =  "This data is protected";
		}else
		if (!data[i].secure && data[i].locked){
			returnString =  "This data is protected, encrypt";
		}else{
			returnString =  "This data is not protected";
		}
		if (!data[i].locked){
		returnString += ", " + data[i].type;
		}
		return returnString;
	}  

	function OnInspectorUpdate() {
		if (EditorApplication.isPlaying){
			if (secureKeysManager==null){
   				secureKeysManager = FindObjectOfType(SecureKeysManager) as SecureKeysManager;
   			}
    		if (EditorApplication.timeSinceStartup > tmpTime){
    			if (secureKeysManager!=null && secureKeysManager.keys.length>0){
    				loadFiles();
    			}
		   		this.Repaint();
	    		tmpTime = EditorApplication.timeSinceStartup + updInterval;
	    	}
	   		if (isplaying != EditorApplication.isPlayingOrWillChangePlaymode && !isplaying){
	    		isplaying=EditorApplication.isPlaying;	PlayerPrefs.Save();tryedit=false;
	  		}
		}else{
			if (EditorApplication.timeSinceStartup > tmpTime){
    			if (secureKeysManager==null){
   					secureKeysManager = FindObjectOfType(SecureKeysManager) as SecureKeysManager;
   				}
    			if (secureKeysManager!=null && secureKeysManager.keys.length>0){
    				loadFiles();
    			}
    			this.Repaint();
    			tmpTime = EditorApplication.timeSinceStartup + updIntervalNP;
   			}
   			if (isplaying){
    			isplaying=false;
    			if (secureKeysManager==null){
   					secureKeysManager = FindObjectOfType(SecureKeysManager) as SecureKeysManager;
   				}
    		}
    	}	
	}
 
	var tmpTime: float;
    private var showall: boolean = false;
 
    
    function showException(i: int){
    	if (showall){
    		return true;
    	}else
    	if (data[i].key == "UnityGraphicsQuality"){
    		return false;
    	}else
    	if (data[i].locked){
    		return false;
    	}
    	
    	else{
    		return true;
    	}
    
    }

    function GetValue(name: String, _str: String){
    if (PlayerPrefs.HasKey(name)){
    	if (_str=="string"){
    		return PlayerPrefs.GetString(name);
    	}else
    	if (_str=="int"){
    		return PlayerPrefs.GetInt(name);
    	}else
    	if (_str=="float"){
    		return PlayerPrefs.GetFloat(name);
    	}else
    	if (_str=="other"){
    		return PlayerPrefs.GetString(name);
    	}else{
    		return PlayerPrefs.GetString(name);
    	}
    }else{
    	return "" as String;
    }
    }
    


    
}


/*
<!ENTITY % plistObject "(array | data | date | dict | real | integer | string | true | false )" >
<!ELEMENT plist %plistObject;>
<!ATTLIST plist version CDATA "1.0" >

<!-- Collections -->
<!ELEMENT array (%plistObject;)*>
<!ELEMENT dict (key, %plistObject;)*>
<!ELEMENT key (#PCDATA)>

<!--- Primitive types -->
<!ELEMENT string (#PCDATA)>
<!ELEMENT data (#PCDATA)> <!-- Contents interpreted as Base-64 encoded -->
<!ELEMENT date (#PCDATA)> <!-- Contents should conform to a subset of ISO 8601 (in particular, YYYY '-' MM '-' DD 'T' HH ':' MM ':' SS 'Z'.  Smaller units may be omitted with a loss of precision) -->

<!-- Numerical primitives -->
<!ELEMENT true EMPTY>  <!-- Boolean constant true -->
<!ELEMENT false EMPTY> <!-- Boolean constant false -->
<!ELEMENT real (#PCDATA)> <!-- Contents should represent a floating point number matching ("+" | "-")? d+ ("."d*)? ("E" ("+" | "-") d+)? where d is a digit 0-9.  -->
<!ELEMENT integer (#PCDATA)> <!-- Contents should represent a (possibly signed) integer number in base 10 -->
*/