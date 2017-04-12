using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour {

	public static UIManager instance;
	public static string key_BESTSCORE;
	public static string key_RECENTSCORE;
	public static string key_COINS;
	public static string key_SOUNDFX;
	public static string key_TUTORIAL;

	//UI
	public GameObject Txt_Display;
	public Text BestScore;
	public Text RecentScore;
	public Text Coins;

	public GameObject PauseMenu;
	public GameObject GameplayMenu;
	public GameObject GameOverMenu;
	public GameObject MenuItems;

	public Movement m_Player;

	// Use this for initialization
	void Awake () {
		instance = this;

		key_BESTSCORE = "BEST_SCORE_";
		key_RECENTSCORE = "RECENT_SCORE_";
		key_COINS = "COINS_";
		key_SOUNDFX = "SOUNDFX";
		key_TUTORIAL = "TUTORIAL";
	}

	 void setKeys (){
		if (!PlayerPrefs.HasKey (key_BESTSCORE))
			PlayerPrefs.SetInt (key_BESTSCORE, 0);
		if (!PlayerPrefs.HasKey (key_RECENTSCORE))
			PlayerPrefs.SetInt (key_RECENTSCORE, 0);
		if (!PlayerPrefs.HasKey (key_COINS))
			PlayerPrefs.SetInt (key_COINS, 0);
		if (!PlayerPrefs.HasKey (key_SOUNDFX))
			PlayerPrefs.SetInt (key_SOUNDFX, 1);
		if (!PlayerPrefs.HasKey (key_TUTORIAL))
			PlayerPrefs.SetInt (key_TUTORIAL, 0);
	}

	void Start(){
		setKeys ();
		setDelegates ();

		BestScore.text = PlayerPrefs.GetInt (key_BESTSCORE).ToString();
		RecentScore.text = PlayerPrefs.GetInt (key_RECENTSCORE).ToString();
		Coins.text = PlayerPrefs.GetInt (key_COINS).ToString();
		PlayerPrefs.Save ();
	}

	void setDelegates (){
		LockOn locker = m_Player.getLockOn ();
		if (locker.GetType () == typeof(LockOnPlayer)) {
			LockOnPlayer locked = locker as LockOnPlayer;
			locked.AddPoint += UpdateScore;
			locked.GameOver += ShowGameOver;
			locked.AddCoin += UpdateCoins;
			ShopManager.instance.Wallet += UpdateCoins;
		}
	}


	//Delegate Methods
	void UpdateScore(int num){
		if (num > PlayerPrefs.GetInt (key_BESTSCORE))
			PlayerPrefs.SetInt (key_BESTSCORE, num);

		PlayerPrefs.SetInt (key_RECENTSCORE, num);
		RecentScore.text = num.ToString ();
	}

	void ShowGameOver(int num){
		if(GameOverMenu)
		GameOverMenu.SetActive (true);
		if(GameplayMenu)
		GameplayMenu.SetActive (false);
	}

	void UpdateCoins(int num){
		num += PlayerPrefs.GetInt (key_COINS);
		PlayerPrefs.SetInt (key_COINS, num);
		Coins.text = num.ToString ();
	}

	public void resetRecentScore(){
		PlayerPrefs.SetInt (key_RECENTSCORE, 0);
	}

	public void PlayGame(){
		MenuItems.SetActive (false);
		Txt_Display.SetActive (false);
		BestScore.gameObject.SetActive (false);
		GameplayMenu.SetActive (true);
		RecentScore.text = "0";
		GameManager.instance.EnableAssets ();
	}

	public void PauseGame(){
		GameplayMenu.SetActive (false);
		PauseMenu.SetActive (true);
		Time.timeScale = 0;
		GameManager.instance.Paused ();
	}

	public void ResumeGame(){
		GameplayMenu.SetActive (true);
		PauseMenu.SetActive (false);
		Time.timeScale = 1;
		GameManager.instance.Resume ();
	}

	public void MainMenu(){
		LevelManager.instance.ResetGame ();
	}


}
