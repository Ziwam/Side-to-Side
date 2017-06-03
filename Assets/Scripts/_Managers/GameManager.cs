using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour {

	public static GameManager instance;
	public enum g_States {Menu, Play, Pause, GameOver};

	public GameObject m_Player;
	public TriggerGates m_Gates;
	private Movement m_PlayerMov;
	private g_States Game_State;
	public g_States CurrentState{
		get{ 
			return Game_State;
		}
	}

	// Use this for initialization
	void Awake(){
		instance = this;
		Game_State = g_States.Menu;
		m_PlayerMov = m_Player.GetComponent<Movement> ();
	}


	void Start(){
		setDelegates ();
		Game_State = g_States.Play;
		Time.timeScale = 1;
	}

	void setDelegates (){
		LockOn locker = m_PlayerMov.getLockOn ();
		if (locker.GetType () == typeof(LockOnPlayer)) {
			LockOnPlayer locked = locker as LockOnPlayer;
			locked.GameOver += PlayerDied;
		}
	}

	void PlayerDied(int score){
//		Time.timeScale = 0;
		Game_State = g_States.GameOver;

	}

//	public void revivePlayer(){
//		if (Game_State == g_States.GameOver) {
//			m_Player.SetActive (true);
//		}
//	}

	public void EnableAssets(){
		m_PlayerMov.enabled = true;
		m_Gates.EnableAssets ();
	}

	public void Paused(){
		m_PlayerMov.enabled = false;
		Game_State = g_States.Pause;
	}

	public void Resume(){
		m_PlayerMov.enabled = true;
		Game_State = g_States.Play;
	}

	public void ReturnToMenu(){
		Game_State = g_States.Menu;
	}


}
