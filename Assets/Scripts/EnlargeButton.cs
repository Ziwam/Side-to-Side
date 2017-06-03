using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class EnlargeButton : MonoBehaviour {

	public Vector2 posCenter;
	public Vector2 sizeDelta;

	private Button btn;
	private Image img;
	private RectTransform trans;

#if (UNITY_ANDROID|| UNITY_IOS)
	// Use this for initialization
	void Awake () {
		trans = GetComponent<RectTransform> ();
		btn = GetComponent<Button> ();
		GameObject objt = new GameObject ();
		objt.transform.SetParent (gameObject.transform);
		objt.AddComponent<Image> ();
		img = objt.GetComponent<Image> ();
		btn.targetGraphic = img;
		img.rectTransform.localScale = new Vector3 (1, 1, 1);
		img.rectTransform.localPosition = new Vector3 (posCenter.x, posCenter.y, 0);
		img.rectTransform.sizeDelta = sizeDelta;
		img.color = new Color (1, 1, 1, 0f);
	}
#endif
}
