using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class Display : MonoBehaviour {

	public Text m_Title;
	public Text m_Index;
	public Text m_Unlocked;
	public Text m_Cost;
	public Image prefab;
	public GameObject Sticker;
	public bool active;

	protected Collection m_collection;

	protected Button click;

	// Use this for initialization
	protected virtual void Start () {
		checkIfEquipped();
		click = Sticker.GetComponent<Button>();
		click.onClick.AddListener(() => clickButton());
		changeButton(1);
	}

	void clickButton(){
		if (int.Parse(m_Unlocked.text) == 0){
			m_collection.requestPurchase( int.Parse(gameObject.name));
		}else {
			m_collection.equip( int.Parse(gameObject.name));
		}
	}

	public void setTitle(string text){
		m_Title.text = text;
	}

	public void setIndex(string text){
		m_Index.text = text;
	}

	public void setUnlocked(string text){
		m_Unlocked.text = text;
	}

	public void setCost(string text){
		int num = int.Parse(m_Unlocked.text);
		if (num != 0) {
			m_Cost.enabled = false;
		} else {
			m_Cost.text = text;
		}
	}

	public void setCollection(Collection col){
		m_collection = col;
	}

	public void setActive(bool bol){
		active = bol;
	}

	public void checkIfEquipped(){
		if(active){
			m_collection.equip( int.Parse(gameObject.name));
		}
	}

	public void setPrefab(Sprite obj, float size, float rot){
		prefab.sprite = obj;
		prefab.SetNativeSize ();
		prefab.rectTransform.localScale = new Vector3(size/100,size/100,0);
		prefab.rectTransform.rotation = Quaternion.AngleAxis(rot,Vector3.forward);
	}

	public virtual void changeButton(int i){
		int num = int.Parse(m_Unlocked.text);
		if(i == 2 && num == 0){
			Sticker.GetComponent<SpriteFrameArray>().frameIndex = 0;
		}else if(active){
			Sticker.GetComponent<SpriteFrameArray>().frameIndex = 1;
		}else if(num == 0){
			Sticker.GetComponent<SpriteFrameArray>().frameIndex = 0;
		}else{
			Sticker.GetComponent<SpriteFrameArray>().frameIndex = 2;
		}

	}
}
