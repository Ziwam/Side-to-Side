using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ObjectPooling : MonoBehaviour {

	public static ObjectPooling instance;

	private int ticket = -1;

	List<GameObject> poolList;

	void Awake(){
		instance = this;
		poolList = new List<GameObject> ();
	}

	public int CreateList(GameObject objt, int amount, bool grows){
		++ticket;
		GameObject obj = new GameObject (ticket.ToString());
		obj.AddComponent<Pool> ();
		obj.GetComponent<Pool> ().CreateList (objt, amount, grows);
		poolList.Add (obj);
		obj.transform.SetParent(gameObject.transform);
		return ticket;
	}

	public GameObject getObject(int index, Vector3 position, Quaternion rotation){
		GameObject objt = poolList [index].GetComponent<Pool> ().getPooledObject ();
		if (!objt)
			return null;
		objt.transform.position = position;
		objt.transform.rotation = rotation;
		objt.SetActive (true);
		return objt;
	}

	public int numActive(int index){
		return poolList [index].GetComponent<Pool> ().activeCount();
	}

	public List<GameObject> getList(int index){
		return poolList [index].GetComponent<Pool> ().getList();
	}

	public void DeactivateList(int index){
		poolList [index].GetComponent<Pool> ().DeactivateList ();
	}
}
