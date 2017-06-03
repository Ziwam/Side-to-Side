using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Pool : MonoBehaviour {
	
	public List<GameObject> pool;
	public GameObject m_objt;
	public bool willGrow;
	public bool spawnedAll = false;

	public void CreateList(GameObject objt, int amount, bool grows){
		pool = new List<GameObject> ();
		m_objt = objt;
		willGrow = grows;

//		for (int i = 0; i <amount; i++) {
//			GameObject obj = Instantiate(m_objt) as GameObject;
//			obj.SetActive(false);
//			pool.Add(obj);
//			obj.transform.SetParent(gameObject.transform);
//		}
		StartCoroutine (onCreatePool (amount));
	}

	IEnumerator onCreatePool(int amount)
	{
		int i = 0;
		while(i< amount) 
		{ 
			GameObject obj = Instantiate(m_objt) as GameObject;
			obj.SetActive(false);
			pool.Add(obj);
			obj.transform.SetParent(gameObject.transform);
			i++;
			yield return new WaitForSeconds(0.1f);
		}
		spawnedAll = true;
	}

	public GameObject getPooledObject(){
		
		for (int i = 0; i < pool.Count; i++) {
			if(!pool[i].activeInHierarchy){
				return pool[i];
			}
		}
		
		if (willGrow) {
			GameObject obj = Instantiate(m_objt) as GameObject;
			pool.Add(obj);
			obj.transform.SetParent(gameObject.transform);
			return obj;
		}
		
		return null;
	}

	public int activeCount(){
		int num = 0;
		for(int i = 0; i< pool.Count;i++){
			if (pool [i].activeInHierarchy)
				num++;
		}
		return num;
	}

	public List<GameObject> getList(){
		return pool;
	}

	public void DeactivateList(){
		for (int i = 0; i < pool.Count; i++) {
			pool[i].SetActive(false);
		}
	}
}
