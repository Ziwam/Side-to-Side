using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BackgroundLight : MonoBehaviour {

	public GameObject BG_Light;

	// Use this for initialization
	void Awake () {
		GameObject obj = Instantiate (BG_Light, BG_Light.transform.position, BG_Light.transform.rotation) as GameObject;
		obj.transform.SetParent (transform);
		obj.transform.localPosition = BG_Light.transform.localPosition;
		obj.transform.localRotation = BG_Light.transform.localRotation;
		obj.transform.localScale = BG_Light.transform.localScale;
	}
}
