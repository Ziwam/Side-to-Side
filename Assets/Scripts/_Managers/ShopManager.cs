using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShopManager : MonoBehaviour {

	public static string key_CATEGORY;
	public static ShopManager instance;

	public delegate void DelegateInt(int num);
	public DelegateInt Wallet;

	public SpriteRenderer m_PlayerSprite;

	[SerializeField]
	private Purchasable[] Skins;

	private Collection m_Collection;

	void Awake(){
		instance = this;

		key_CATEGORY = "CATEGORY_SKINS";
	}

	// Use this for initialization
	void Start () {
		if (!PlayerPrefs.HasKey (key_CATEGORY)) {
			ArrayList list = new ArrayList ();
			list.Add (9999);
			PlayerPrefsElite.SetIntArray (key_CATEGORY, list);
		} else {

			ArrayList registry = new ArrayList (PlayerPrefsElite.GetIntArray (key_CATEGORY));
//				//PRINT LIST
//			Debug.Log (printList(registry));
			if (registry.Count < Skins.Length) {
				for(int x = registry.Count; x<= Skins.Length ; x++){
					registry.Add (0);
				}
			}


			for (int j= 0; j < Skins.Length; j++) {
				Purchasable item = Skins [j];
				int num = (int)registry [j];

				if (num != 0) {
					item.unlocked = Random.Range(100,10000);
					item.active = ((num % (j + 10))==1);
				}
			}

		}

	}

	string printList(ArrayList list){
		string wrd = "";
		for (int i = 0; i < list.Count; i++) {
			wrd += list [i]+"|";
		}
		return wrd;
	}

	void checknum (int index,ref ArrayList registry)
	{
		if (registry.Count <= index) {
			registry.Add (9999);
			checknum (index,ref registry);
		}
	}

	void registerItem (int index, Purchasable item)
	{
		ArrayList registry = new ArrayList (PlayerPrefsElite.GetIntArray (key_CATEGORY));
		checknum (index, ref registry);
		int num = index;
		num += 10;
		if (item.active)
			num += 1;
		if (item.unlocked == 0)
			num = 0;
		registry [index] = num;
		PlayerPrefsElite.SetIntArray (key_CATEGORY, registry);
		PlayerPrefs.Save();
	}

	bool ValidateTransation(float cost){

		float money = PlayerPrefsElite.GetInt (UIManager.key_COINS);

		if(money >= cost){
			money -= cost;
		}else{
			return false;
		}

		PlayerPrefsElite.SetInt(UIManager.key_COINS, (int)money);
		Wallet (0);
		return true;
	}

	void setSkin(Purchasable obj){
		m_PlayerSprite.sprite = obj.GetComponent<Skin> ().getSkin ();
	}

	public bool purchase(int index){

		Purchasable obj = Skins[index];

		if(obj.unlocked !=0)
			Debug.Log("already Purchased");

		if(!ValidateTransation(obj.cost)){
			Debug.Log("not Enough Money!");
			return false;
		}

			
		for(int i = 0; i< Skins.Length;i++){
			Purchasable catobj = Skins [i];
			catobj.active = false;
			registerItem (i,catobj);
		}

		obj.unlocked = Random.Range(100,10000);
		obj.active = true;

		setSkin(obj);

		registerItem (index,obj);
		return true;
	}

	public bool equip(int index){

		for(int i = 0; i< Skins.Length;i++){
			Purchasable catobj = Skins [i];
			catobj.active = false;
			registerItem (i,catobj);
		}

		Purchasable obj = Skins[index];
		obj.unlocked = Random.Range(100,10000);
		obj.active = true;
		registerItem (index,obj);

		setSkin(obj);
		return true;

	}

	public void setColl(Collection col){
		m_Collection = col;
		m_Collection.setShopItems (Skins);
	}

}
