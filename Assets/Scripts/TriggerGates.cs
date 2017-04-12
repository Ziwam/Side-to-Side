using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TriggerGates : MonoBehaviour {

	public int numBoxes;
	public Gate m_Gate;

	[Header("Spawners")]
	public EnemySpawner m_EnemySpawner;
	public CoinSpawner m_CoinSpawner;

	[Header("Borders")]
	public GateBorder Gate_Top;
	public GateBorder Gate_Left;
	public GateBorder Gate_Right;
	public GateBorder Gate_Bottom;

	private List<GateBorder> Room;
	private int maxSpawn=0;
	private int num_triggered = -1;
	private int active_Border = -1;

	void Awake(){
		Room = new List<GateBorder> ();
		Room.Add (Gate_Top);
		Room.Add (Gate_Bottom);
		Room.Add (Gate_Left);
		Room.Add (Gate_Right);

		for (int i = 0; i < Room.Count; i++) {
			Room [i].setGate (m_Gate);
			Room [i].GateTriggered += OpenNextGate;
			Room [i].BorderActivated += BorderActive;
			Room [i].Border_Index = i;
		}

	}
	
	// Update is called once per frame
	void Update () {
		if(Room[0].number_Gates < numBoxes)
		addGates ();
		
		numBoxes = (num_triggered + 9) / 7;
	}

	void addGates (){

		for (int i = 0; i < Room.Count; i++) {
			Room [i].createGate (numBoxes);
		}

	}

	void BorderActive(int num){
		active_Border = num;
		if (num_triggered > 0) {
			m_EnemySpawner.spawnEnemy (num_triggered);
			m_CoinSpawner.spawnCoin (num_triggered);
		}

	}

	void DeactivateBorder(){
		if (active_Border != -1) {
			Room [active_Border].DeactivateGate ();
			active_Border = -1;
		}
	}

	void OpenFirstGate(){
		num_triggered++;
		int num = 0;
		Room [num].ActivateFirstGate ();
		active_Border = num;
	}

	public void OpenNextGate(){
		num_triggered++;

		int left = Room [active_Border].LeftCount ();
		int right = Room [active_Border].RightCount ();
//		Debug.Log ("active border "+ active_Border);
//		Debug.Log ("left "+ left);
//		Debug.Log ("right "+ right);
		GateBorder[] borders = new GateBorder[3];
		List<Gate> gates = new List<Gate> ();

		switch(active_Border)
		{
		case 0:
			borders [0] = Room [1];
			borders [1] = Room [2];
			borders [2] = Room [3];

			borders [0].ActivateRandomGate (ref gates);
			if (left > 0)
				borders [1].ActivateFromTop (left, ref gates);
			if (right > 0)
				borders [2].ActivateFromTop (right, ref gates);
			break;
		
		case 1:
			borders [0] = Room [0];
			borders [1] = Room [2];
			borders [2] = Room [3];

			borders [0].ActivateRandomGate (ref gates);
			if (left > 0)
				borders [1].ActivateFromBottom (left, ref gates);
			if (right > 0)
				borders [2].ActivateFromBottom (right, ref gates);
			break;

		case 2:
			borders [0] = Room [3];
			borders [1] = Room [1];
			borders [2] = Room [0];

			borders [0].ActivateRandomGate (ref gates);
			if (left > 0)
				borders [1].ActivateFromBottom (left, ref gates);
			if (right > 0)
				borders [2].ActivateFromBottom (right, ref gates);
			break;

		case 3:
			borders [0] = Room [2];
			borders [1] = Room [1];
			borders [2] = Room [0];

			borders [0].ActivateRandomGate (ref gates);
			if (left > 0)
				borders [1].ActivateFromTop (left, ref gates);
			if (right > 0)
				borders [2].ActivateFromTop (right, ref gates);
			break;

		default:
			break;
			
		}

		gates [Random.Range (0, gates.Count)].IsActive = true;
	}

	public void EnableAssets(){
		m_EnemySpawner.enabled = true;
		m_CoinSpawner.enabled = true;
		OpenFirstGate ();
	}

//	void OnDrawGizmos(){
//		Gizmos.color = Color.red;
//		Camera camMain = Camera.main;
//		float height = camMain.orthographicSize;
//		float width = height * camMain.aspect;
//
//		Gizmos.DrawWireCube (Vector3.zero, Vector3.one);
//
//		//TOP
//		for (int i = 0; i < numBoxes; i++) {
//			Vector3 top = new Vector3 ((width/numBoxes)*(i*2) + (width/numBoxes) - width, height, 0);
//			Gizmos.DrawWireCube (top, new Vector3(1* width*(2f/numBoxes), thickness,1));
//		}
//
//		//BOTTM
//		for (int i = 0; i < numBoxes; i++) {
//			Vector3 top = new Vector3 ((width/numBoxes)*(i*2) + (width/numBoxes) - width, height*-1, 0);
//			Gizmos.DrawWireCube (top, new Vector3(1* width*(2f/numBoxes), thickness,1));
//		}
//
//		//LEFT
//		for (int i = 0; i < numBoxes; i++) {
//			Vector3 left = new Vector3 (width*-1, (height/numBoxes)*(i*2) + (height/numBoxes) - height, 0);
//			Gizmos.DrawWireCube (left, new Vector3(thickness, 1* height*(2f/numBoxes),1));
//		}
//
//		//RIGHT
//		for (int i = 0; i < numBoxes; i++) {
//			Vector3 left = new Vector3 (width, (height/numBoxes)*(i*2) + (height/numBoxes) - height, 0);
//			Gizmos.DrawWireCube (left, new Vector3(thickness, 1* height*(2f/numBoxes),1));
//		}
//
//	}



}
