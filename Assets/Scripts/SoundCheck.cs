using UnityEngine;
using System.Collections;

public class SoundCheck : MonoBehaviour {

	private SpriteFrameArray Frames;

	// Use this for initialization
	void Start () {
		Frames = GetComponent<SpriteFrameArray> ();
	}

	void Update(){
		if (PlayerPrefsElite.GetBoolean (JukeBox.key_SFX)) {
			Frames.frameIndex = 0;
		} else {
			Frames.frameIndex = 1;
		}
	}
}
