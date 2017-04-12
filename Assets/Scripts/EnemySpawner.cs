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
	public int StartTime=0;

	private List<GameObject> ActiveEnemies;
	private float timer;
	private float DimensionsX;
	private float DimensionsY;
	private int maxSpawn;

	// Use this for initialization
	void Awake () {
		ActiveEnemies = new List<GameObject> ();
		DimensionsX = camMain.ScreenToWorldPoint (new Vector3( Screen.width, 0, 0)).x + SpawnOffset;
		DimensionsY = camMain.ScreenToWorldPoint (new Vector3( 0, Screen.height, 0)).y + SpawnOffset;
	}
	
	// Update is called once per frame
	void Update () {
		cleanEnemyList ();
	}

	void cleanEnemyList ()
	{
		int alive = ActiveEnemies.Count;
		if (Time.frameCount % 14 == 0 && alive > 0) {
			for (int i = ActiveEnemies.Count - 1; i > -1; i--) {
				if (!ActiveEnemies [i])
					ActiveEnemies.RemoveAt (i);
			}
		}
	}

	void setMass(float num){
		num = Mathf.Pow((num/26f),1.8f)+1;
		for (int i = ActiveEnemies.Count - 1; i > -1; i--) {
			if (ActiveEnemies [i])
				ActiveEnemies [i].GetComponent<Movement> ().setMass (num);
		}
	}

	public void spawnEnemy (int triggered)
	{
		int ActiveLimit = (int)(20f* Mathf.Sin ((triggered - 3f) / 21f) + 4f);
		if (ActiveLimit > maxSpawn)
			maxSpawn = ActiveLimit;

		int alive = ActiveEnemies.Count;
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
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (deltax, DimensionsY, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
							//BOTTOM
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (-1 * deltax, -1 * DimensionsY, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
							//RIGHT
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (DimensionsX, deltay, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
							//LEFT
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (-1 * DimensionsX, -1 * deltay, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
							//							Debug.Log ("SPAWN 4");
							setMass (triggered);
							return;
						}
						if (Random.value > .5f) {
							//TOP
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (deltax, DimensionsY, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
							//BOTTOM
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (-1 * deltax, -1 * DimensionsY, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
						}
						else {
							//RIGHT
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (DimensionsX, deltay, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
							//LEFT
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (-1 * DimensionsX, -1 * deltay, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
						}
						//						Debug.Log ("SPAWN 2");
						setMass (triggered);
						return;
					}
					if (Random.value > .5f) {
						if (Random.value > .5f) {
							//TOP
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (deltax, DimensionsY, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
						}
						else {
							//BOTTOM
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (-1 * deltax, -1 * DimensionsY, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
						}
					}
					else {
						if (Random.value > .5f) {
							//RIGHT
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (DimensionsX, deltay, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
						}
						else {
							//LEFT
							obj = Instantiate (EnemiesToSpawn [0], new Vector3 (-1 * DimensionsX, -1 * deltay, 0), Quaternion.identity) as GameObject;
							ActiveEnemies.Add (obj);
						}
					}
					//					Debug.Log ("SPAWN 1");
					setMass (triggered);
					return;
				}
			}
		}
	}
}
