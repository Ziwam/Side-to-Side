using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Movement : MonoBehaviour {
	
	public LockOn m_Pointer;
	public Rigidbody2D body;
	public Transform parentTans;
	public AudioSource m_Zoom;

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

	public void setProps(float num,float del){
		if(!body)
			body = GetComponent<Rigidbody2D> ();
		body.mass = num;
		if(!m_Pointer)
			m_Pointer = GetComponentInChildren<LockOn> ();
		m_Pointer.delayLaunch = del;
	}
}
