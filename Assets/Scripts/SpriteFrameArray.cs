using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class SpriteFrameArray : MonoBehaviour {

	public Sprite[] frames;
	private int frameindex;
	private SpriteRenderer render;
	private Image renderTex;

	// Use this for initialization
	void Awake () {
		render = GetComponent<SpriteRenderer> ();
		if (!render) {
			renderTex = GetComponent<Image> ();
		}
	}


	public int frameIndex{
		get
		{ 
			return frameindex;
		}

		set
		{
			frameindex = value;
			if (value >= frames.Length) {
				frameindex = frames.Length - 1;
			}else if (value < 0){
				frameindex = 0;
			}
			if (render) {
				render.sprite = frames [frameindex];
			} else {
				renderTex.sprite = frames [frameindex];
			}

		}
	}

}