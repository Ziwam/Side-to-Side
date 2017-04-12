using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoinSpawner : MonoBehaviour {
	
	public Camera camMain;
	public GameObject[] CoinsToSpawn;
	public float SpawnOffset;
	[Range(.5f,1f)]
	public float SpawnBuffer;
	public float SpawnTime = 4;

	private List<GameObject> ActiveEnemies;
	private float timer;
	private float GamePlayTimer;
	private float DimensionsX;
	private float DimensionsY;
	private float SpawnTimeRange;

	// Use this for initialization
	void Awake () {
		ActiveEnemies = new List<GameObject> ();
		DimensionsX = camMain.ScreenToWorldPoint (new Vector3( Screen.width, 0, 0)).x + SpawnOffset;
		DimensionsY = camMain.ScreenToWorldPoint (new Vector3( 0, Screen.height, 0)).y + SpawnOffset;
		SpawnTimeRange = SpawnTime;
	}

	// Update is called once per frame
	void Update () {
		GamePlayTimer += Time.deltaTime;
	}

	public void spawnCoin (int triggered){
		int num = (triggered / 12) + 1;
		GameObject obj = null;

		float buffX = DimensionsX * SpawnBuffer;
		float buffY = DimensionsY * SpawnBuffer;

		num = Mathf.Clamp (num, 1, 2);

		float deltax = 0;
		float deltay = 0;
		for (int j = 0; j < num; j++) {
			deltax = Random.Range (-1 * buffX, buffX);
			deltay = Random.Range (-1 * buffY, buffY);
			obj = Instantiate (CoinsToSpawn [0], new Vector3 (deltax, deltay, 0), Quaternion.identity) as GameObject;
		}
//		Debug.Log ("SPAWN " + num);
	}
}
