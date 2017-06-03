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
//	public static string key_LIVES;
	public static string key_GIFT;

	//UI
	public GameObject Cin_Display;
	public GameObject Bst_Display;
	public GameObject Scr_Divider;
	public GameObject Gift;
	public Text BestScore;
	public Text RecentScore;
	public Text Coins;
//	public Text LifeCounter;

	public GameObject Scores;
	public GameObject PauseMenu;
	public GameObject GameplayMenu;
	public GameObject GameOverMenu;
	public GameObject MenuItems;
	public Tutorial m_Tutorial;

	public Movement m_Player;

	private bool gift_Active = false;

	// Use this for initialization
	void Awake () {
		instance = this;

		key_BESTSCORE = "BEST_SCORE_";
		key_RECENTSCORE = "RECENT_SCORE_";
		key_COINS = "COINS_";
		key_SOUNDFX = "SOUNDFX";
		key_TUTORIAL = "TUTORIAL";
//		key_LIVES = "LIVES";
		key_GIFT = "GIFT";
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
//		if (!PlayerPrefs.HasKey (key_LIVES))
//			PlayerPrefs.SetInt (key_LIVES, 3);
		if (!PlayerPrefs.HasKey (key_GIFT))
			PlayerPrefs.SetInt (key_GIFT, 5);
	}

	void Start(){
		setKeys ();
		setDelegates ();

		BestScore.text = PlayerPrefs.GetInt (key_BESTSCORE).ToString();
		RecentScore.text = PlayerPrefs.GetInt (key_RECENTSCORE).ToString();
		Coins.text = PlayerPrefs.GetInt (key_COINS).ToString();
//		LifeCounter.text = PlayerPrefs.GetInt (key_LIVES).ToString ();
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

	void GiftLottery ()
	{
		int raffel = 0;
		raffel = PlayerPrefs.GetInt (key_GIFT) + 1;
		PlayerPrefs.SetInt (key_GIFT, raffel);
		if (Random.value > (4.0f / raffel) || gift_Active)
			Gift.SetActive (true);
			gift_Active = true;
		
	}

	void ShowGameOver(int num){
		UIAnimator.instance.UIClick (6);
		if(GameOverMenu)
		GameOverMenu.SetActive (true);
		if(GameplayMenu)
		GameplayMenu.SetActive (false);
		if(Scores)
		Scores.SetActive (false);
		GiftLottery ();
	}

	public void UpdateCoins(int num){
		num += PlayerPrefs.GetInt (key_COINS);
		num = Mathf.Clamp (num, 0, 9999999);
		PlayerPrefs.SetInt (key_COINS, num);
		Coins.text = num.ToString ();
	}
//
//	public void UpdateLives(int num){
//		num += PlayerPrefs.GetInt (key_LIVES);
//		num = Mathf.Clamp (num, 0, 9999999);
//		PlayerPrefs.SetInt (key_LIVES, num);
//		LifeCounter.text = num.ToString ();
//	}

	public void resetRecentScore(){
		PlayerPrefs.SetInt (key_RECENTSCORE, 0);
	}

	public void clearLottery(){
		gift_Active = false;
		PlayerPrefs.SetInt (key_GIFT, 0);
	} 

	public void PlayGame(){
		MenuItems.SetActive (false);
		Bst_Display.SetActive (false);
		Scr_Divider.SetActive (false);
		Cin_Display.SetActive (false);
		BestScore.gameObject.SetActive (false);
		GameplayMenu.SetActive (true);
		RecentScore.text = "0";
		GameManager.instance.EnableAssets ();
		if (PlayerPrefs.GetInt (key_TUTORIAL) == 0)
			m_Tutorial.startClip (m_Player);
	}

	public void PlayTutorial(){
		PlayerPrefs.SetInt (key_TUTORIAL, 0);
	}

	public void PauseGame(){
		GameplayMenu.SetActive (false);
		PauseMenu.SetActive (true);
		Time.timeScale = 0;
		GameManager.instance.Paused ();
	}

	public void ResumeGame(){
		GameplayMenu.SetActive (true);
		GameOverMenu.SetActive (false);
		Scores.SetActive (true);
		PauseMenu.SetActive (false);
		Time.timeScale = 1;
		GameManager.instance.Resume ();
	}

//	public void RevivePlayer(){
//		if (PlayerPrefs.GetInt (key_LIVES) > 0) {
//			GameManager.instance.revivePlayer ();
//			ResumeGame ();
//		}
//	}

	public void MainMenu(bool reset){
		if(reset)
			LevelManager.instance.restart = true;
		GameManager.instance.ReturnToMenu ();
		LevelManager.instance.ResetGame ();
	}


}
