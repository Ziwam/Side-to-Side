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
	public int SpawnMax;

	private List<GameObject> ActiveCoins;
	private float timer;
	private float GamePlayTimer;
	private float DimensionsX;
	private float DimensionsY;
	private float SpawnTimeRange;
	private ObjectPooling coinPool;
	private int ticket;


	// Use this for initialization
	void Awake () {
		ActiveCoins = new List<GameObject> ();
		DimensionsX = camMain.ScreenToWorldPoint (new Vector3( Screen.width, 0, 0)).x + SpawnOffset;
		DimensionsY = camMain.ScreenToWorldPoint (new Vector3( 0, Screen.height, 0)).y + SpawnOffset;
		SpawnTimeRange = SpawnTime;

		coinPool = ObjectPooling.instance;
		if (coinPool)
			ticket = coinPool.CreateList (CoinsToSpawn [0], SpawnMax, false);
	}

	public void spawnCoin (int triggered){
		int num = (triggered / 19) + 3;

		float buffX = DimensionsX * SpawnBuffer;
		float buffY = DimensionsY * SpawnBuffer;

		num = Mathf.Clamp (num, 1, SpawnMax);

		float deltax = 0;
		float deltay = 0;
		coinPool.DeactivateList (ticket);
		for (int j = 0; j < num; j++) {
			deltax = Random.Range (-1 * buffX, buffX);
			deltay = Random.Range (-1 * buffY, buffY);
			coinPool.getObject (ticket, new Vector3 (deltax, deltay, .5f), Quaternion.identity);
		}
//		Debug.Log ("SPAWN " + num);
	}

}
