using UnityEngine;
using System.Collections;

public class MusicCheck : MonoBehaviour {

	private SpriteFrameArray Frames;

	// Use this for initialization
	void Start () {
		Frames = GetComponent<SpriteFrameArray> ();
	}

	void Update(){
		if (PlayerPrefsElite.GetBoolean (JukeBox.key_MSC)) {
			Frames.frameIndex = 0;
		} else {
			Frames.frameIndex = 1;
		}
	}
}
