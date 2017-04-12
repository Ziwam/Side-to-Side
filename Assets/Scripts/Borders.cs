using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Borders : MonoBehaviour {

	public Transform topLeft;
	public Transform bottomRight;

	// Use this for initialization
	void Awake () {
		Camera camMain = Camera.main;
		topLeft.position = camMain.ScreenToWorldPoint(new Vector3 (0, Screen.height, topLeft.position.y - camMain.transform.position.y));
		bottomRight.position = camMain.ScreenToWorldPoint(new Vector3 (Screen.width, 0, bottomRight.position.y - camMain.transform.position.y));
	}
}
