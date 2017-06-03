using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class Display : MonoBehaviour {

	public Text m_Title;
	public Text m_Index;
	public Text m_Unlocked;
	public Text m_Cost;
	public MeshRenderer m_sprite;
	public RectTransform image;
	public GameObject m_prefab;
	public Image Sticker;
	public Button m_Button;
	public bool active;

	protected Collection m_collection;

	protected Button click;

	// Use this for initialization
	protected virtual void Start () {
		checkIfEquipped();
		click = m_Button;
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

	public void setPrefab(Material obj, GameObject part, float size){
		m_sprite.material = obj;
		GameObject intsant = Instantiate (part,new Vector3(0,-1000,0),Quaternion.identity,m_prefab.transform) as GameObject;
		intsant.GetComponent<RectTransform> ().localPosition = new Vector3 (0, 0, -30);
		image.localScale = new Vector3 (size, size, 0);
	}

	public virtual void changeButton(int i){
		int num = int.Parse(m_Unlocked.text);
		if(i == 2 && num == 0){
			Sticker.enabled = false;
		}else if(active){
			Sticker.enabled = true;
		}else if(num == 0){
			Sticker.enabled = false;
		}else{
			Sticker.enabled = false;
		}

	}
}
