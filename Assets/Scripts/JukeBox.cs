using UnityEngine;
using System.Collections;

public class JukeBox : MonoBehaviour {

	public static JukeBox instance;
	public static string key_SFX;
	public static string key_MSC;

	private bool PlayMusic;
	private bool PlaySound;
	[SerializeField]
	private AudioSource[] MusicPlayers;
	[SerializeField]
	private AudioSource[] SoundPlayers;


	void Awake(){
		if (!instance) {
			instance = this;
		}

		key_MSC = "Music Controller";
		key_SFX = "Sound Controller";
	}

	void Start(){
		if(!PlayerPrefs.HasKey(key_SFX)){
			PlayerPrefsElite.SetBoolean(key_SFX,true);
		}
		if(!PlayerPrefs.HasKey(key_MSC)){
			PlayerPrefsElite.SetBoolean(key_MSC,true);
		}

		PlaySound = PlayerPrefsElite.GetBoolean(key_SFX);
		PlayMusic = PlayerPrefsElite.GetBoolean(key_MSC);

		updateSFX ();
		updateMSC ();
	}

	void updateSFX (){
		PlayerPrefsElite.SetBoolean (key_SFX, PlaySound);
		for (int i = 0; i < SoundPlayers.Length; i++) {
			SoundPlayers [i].enabled = PlaySound;
			if (SoundPlayers [i].gameObject.GetComponent<AudioResume> ())
				SoundPlayers [i].gameObject.SetActive (PlaySound);
		}
	}

	void updateMSC (){
		PlayerPrefsElite.SetBoolean (key_MSC, PlayMusic);
		for (int i = 0; i < MusicPlayers.Length; i++) {
			MusicPlayers [i].enabled = PlayMusic;
			if (MusicPlayers [i].gameObject.GetComponent<AudioResume> ())
				MusicPlayers [i].gameObject.SetActive (PlayMusic);
		}
	}

	public bool getSFX(){
		return PlaySound;
	}

	public bool getMSC(){
		return PlayMusic;
	}

	public void switchSFX(){
		PlaySound = !PlaySound;
		updateSFX ();
	}

	public void switchMSC(){
		PlayMusic = !PlayMusic;
		updateMSC ();
	}
}
