using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySpawner : MonoBehaviour {

	public Camera camMain;
	public GameObject[] EnemiesToSpawn;
	public float SpawnOffset;
	[Range(.5f,1f)]
	public float SpawnBuffer;
//	public int ActiveLimit = 4;
	public int SpawnTime = 4;
	public int StartTime = 0;

//	private List<GameObject> ActiveEnemies;
	private float timer;
	private float DimensionsX;
	private float DimensionsY;
	private int maxSpawn;
	private ObjectPooling enemyPool;
	private int ticket;

	// Use this for initialization
	void Awake () {
//		ActiveEnemies = new List<GameObject> ();
		DimensionsX = camMain.ScreenToWorldPoint (new Vector3( Screen.width, 0, 0)).x + SpawnOffset;
		DimensionsY = camMain.ScreenToWorldPoint (new Vector3( 0, Screen.height, 0)).y + SpawnOffset;
		enemyPool = ObjectPooling.instance;
		if (enemyPool)
			ticket = enemyPool.CreateList (EnemiesToSpawn [0], 5, true);
	}
	
//	// Update is called once per frame
//	void Update () {
//		cleanEnemyList ();
//	}
//
//	void cleanEnemyList ()
//	{
//		int alive = ActiveEnemies.Count;
//		if (Time.frameCount % 14 == 0 && alive > 0) {
//			for (int i = ActiveEnemies.Count - 1; i > -1; i--) {
//				if (!ActiveEnemies [i])
//					ActiveEnemies.RemoveAt (i);
//			}
//		}
//	}

	void setProps(float num){
		float mass = (num/50)+.95f;
		float delay = ((-1*num)/300)+.57f;
		delay = Mathf.Clamp (delay,0.3f, .5f);
		List<GameObject> ActiveEnemies = enemyPool.getList (ticket);
		for (int i = ActiveEnemies.Count - 1; i > -1; i--) {
			GameObject enem = ActiveEnemies [i];
			if (enem)
				enem.GetComponent<Movement> ().setProps (mass,delay);
		}
	}

	public void spawnEnemy (int triggered)
	{
		int ActiveLimit = (int)(20f* Mathf.Sin ((triggered - 3f) / 21f) + 4f);
		if (ActiveLimit > maxSpawn)
			maxSpawn = ActiveLimit;

		int alive = enemyPool.numActive (ticket);
		if (alive < maxSpawn) {
			int spawnNum = maxSpawn - alive;
			GameObject obj;
			float deltax = 0;
			float deltay = 0;
			for (int i = 0; i <= spawnNum; i++) {
				float buffX = DimensionsX * SpawnBuffer;
				float buffY = DimensionsY * SpawnBuffer;
				deltax = Random.Range (-1 * buffX, buffX);
				deltay = Random.Range (-1 * buffY, buffY);
				//SPAWN 1
				if (spawnNum - 1 >= 0) {
					//SPAWN 2
					if (spawnNum - 2 >= 0) {
						//SPAWN 4
						if (spawnNum - 4 >= 0) {
							//TOP
							obj = enemyPool.getObject (ticket, new Vector3 (deltax, DimensionsY, 0), Quaternion.identity);
							//BOTTOM
							obj = enemyPool.getObject (ticket,new Vector3 (-1 * deltax, -1 * DimensionsY, 0), Quaternion.identity);
							//RIGHT
							obj = enemyPool.getObject (ticket, new Vector3 (DimensionsX, deltay, 0), Quaternion.identity);
							//LEFT
							obj = enemyPool.getObject (ticket, new Vector3 (-1 * DimensionsX, -1 * deltay, 0), Quaternion.identity);
							//							Debug.Log ("SPAWN 4");
							setProps (triggered);
							return;
						}
						if (Random.value > .5f) {
							//TOP
							obj = enemyPool.getObject (ticket, new Vector3 (deltax, DimensionsY, 0), Quaternion.identity);
							//BOTTOM
							obj = enemyPool.getObject (ticket, new Vector3 (-1 * deltax, -1 * DimensionsY, 0), Quaternion.identity);
						}
						else {
							//RIGHT
							obj = enemyPool.getObject (ticket, new Vector3 (DimensionsX, deltay, 0), Quaternion.identity);
							//LEFT
							obj = enemyPool.getObject (ticket, new Vector3 (-1 * DimensionsX, -1 * deltay, 0), Quaternion.identity);
						}
						//						Debug.Log ("SPAWN 2");
						setProps (triggered);
						return;
					}
					if (Random.value > .5f) {
						if (Random.value > .5f) {
							//TOP
							obj = enemyPool.getObject (ticket, new Vector3 (deltax, DimensionsY, 0), Quaternion.identity);
						}
						else {
							//BOTTOM
							obj = enemyPool.getObject (ticket, new Vector3 (-1 * deltax, -1 * DimensionsY, 0), Quaternion.identity);
						}
					}
					else {
						if (Random.value > .5f) {
							//RIGHT
							obj = enemyPool.getObject (ticket, new Vector3 (DimensionsX, deltay, 0), Quaternion.identity);
						}
						else {
							//LEFT
							obj = enemyPool.getObject (ticket, new Vector3 (-1 * DimensionsX, -1 * deltay, 0), Quaternion.identity);
						}
					}
					//					Debug.Log ("SPAWN 1");
					setProps (triggered);
					return;
				}
			}
		}
	}
}
