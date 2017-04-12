using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Movement : MonoBehaviour {
	
	public LockOn m_Pointer;
	protected Rigidbody2D body;

	void Awake(){
		m_Pointer = GetComponentInChildren<LockOn> ();
		body = GetComponent<Rigidbody2D> ();
	}

	void OnCollisionEnter2D(Collision2D obj){
		if(m_Pointer)
		m_Pointer.ColliderDetected (obj);
	}

	public bool isZooming(){
		return m_Pointer.getZooming ();
	}

	public LockOn getLockOn(){
		return m_Pointer;
	}

	public void setMass(float num){
		body.mass = num;
	}
}
