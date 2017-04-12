using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;

public class Collection : MonoBehaviour {

	public RectTransform m_Container;
	public GameObject m_DisplayPrefab;

	private ShopManager shopManager;
	private Purchasable[] shopItems;
	private List<GameObject> Banners;
//	private ScrollRect scrollbar;

	// Use this for initialization
	void Start () {
		shopManager = ShopManager.instance;
//		scrollbar = GetComponent<ScrollRect> ();
		shopManager.setColl (this);
		Banners = new List<GameObject>();
		SetCategory();

	}

	void UpdateCollection(){
		GameObject obj = m_DisplayPrefab;

		foreach(Transform child in m_Container.transform){
			Destroy(child.gameObject);
		}
		for (int i = 0; i < shopItems.Length; i++) {
			createBanner (i,obj);
		}
	}

	void updateBanners()
	{
		for (int i = 0; i < Banners.Count; i++) {
			Display info;
			Purchasable item = shopItems[i];

			GameObject obj = Banners[i];
			info = obj.GetComponent<Display>();
			info.setUnlocked(item.unlocked.ToString());
			info.setCost(item.cost.ToString());
			info.setActive(item.active);
		}
	}

	void createBanner (int index, GameObject spawnedDisplay){
		Display info;
		Purchasable item = shopItems[index];

		var obj = Instantiate (spawnedDisplay, Vector3.zero, Quaternion.identity) as GameObject;
		obj.name = index.ToString();
		obj.transform.SetParent(m_Container.transform);
		obj.GetComponent<RectTransform>().localScale = new Vector3 (1,1,1);
		Banners.Add(obj);
	
		info = obj.GetComponent<Display>();
		info.setCollection(this);
		info.setTitle(item.name);
		info.setIndex(index.ToString());
		info.setUnlocked(item.unlocked.ToString());
		info.setCost(item.cost.ToString());
		info.setPrefab(item.image, item.size, item.rotation);
		info.setActive(item.active);
		info.checkIfEquipped();

	}

	public void SetCategory(){
		Banners.Clear();
		m_Container.anchoredPosition = new Vector3(0,0,0);

		UpdateCollection();
//		scrollbar.decelerationRate = 0;
//		Invoke ("scrollRate", 0.2f);
	}

//	void scrollRate (){
//		scrollbar.decelerationRate = 0.135f;
//		CancelInvoke ();
//	}


	public void RefeshCategory(){
		UpdateCollection ();
	}

	public void setShopItems(Purchasable[] items){
		shopItems = items;
	}

	public void requestPurchase(int index){
		Display info;
		if(shopManager.purchase(index)){
			for(int i =0; i < Banners.Count; i++){
				GameObject obj = Banners[i];
				info = obj.GetComponent<Display>();
				if(index != i){
					info.setActive(false);
					info.changeButton(2);
				}else{
					info.setActive(true);
					info.changeButton(1);
				}
			}
			updateBanners();
		}
	}

	public void equip(int index){
		Display info;
		if(shopManager.equip(index)){
			for(int i =0; i < Banners.Count; i++){
				GameObject obj = Banners[i];
				info = obj.GetComponent<Display>();
				if(index != i){
					info.setActive(false);
					info.changeButton(2);
				}else{
					info.setActive(true);
					info.changeButton(1);
				}
			}
			updateBanners();
		}
	}

}