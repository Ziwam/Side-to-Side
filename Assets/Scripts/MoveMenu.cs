using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveMenu : MonoBehaviour {

	public Vector2 OutView;

	private RectTransform trans;
	private Vector2 InView;

	// Use this for initialization
	void Start () {
		trans = GetComponent<RectTransform> ();
		InView = Vector2.zero;
		OffScreen ();
	}
	
	public void OffScreen(){
		trans.offsetMax = new Vector2(0,OutView.x);
		trans.offsetMin = new Vector2(0,OutView.y);
	}

	public void OnScreen(){
		trans.offsetMax = new Vector2(0,InView.x);
		trans.offsetMin = new Vector2(0,InView.y);
	}
}
