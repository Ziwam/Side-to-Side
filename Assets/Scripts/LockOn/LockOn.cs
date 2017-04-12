using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public abstract class LockOn : MonoBehaviour {

	public float Attforce;
	public Color rest_Color;
	public Color locked_Color;
	public float LockOnShift;
	public float ZoomCooldown;
	public Image laser;
	public RectTransform mask;
	public string TargetTag;
	public float delayLaunch;

	protected SpriteRenderer sprtRen;
	protected float col_timer;
	protected bool zooming;
	protected Transform parentTrans;
	protected GameObject parentGameObj;
	protected List<Transform> Targets;
	protected Transform target;

	private Vector2 startPos;
	private Rigidbody2D body;

	// Use this for initialization
	protected virtual void Awake () {
		Targets = new List<Transform> ();
		parentTrans = transform.parent.transform;
		parentGameObj = parentTrans.gameObject;
		body = transform.parent.GetComponent<Rigidbody2D> ();
		sprtRen = transform.parent.GetComponent<SpriteRenderer> ();
		zooming = false;
	}
	
	// Update is called once per frame
	void Update () {
		cleanTargets ();
		LockOnto ();
	}

	void cleanTargets ()
	{
		int alive = Targets.Count;
		if (Time.frameCount % 14 == 0 && alive > 0) {
			for (int i = Targets.Count - 1; i > -1; i--) {
				if (!Targets [i])
					Targets.RemoveAt (i);
			}
		}
	}

	void LockOnto ()
	{
		if (!target && Targets.Count>0) {
			for (int i = 0; i < Targets.Count; i++) {
				if (Targets [i])
					target = Targets [i];
			}
		}
		if (target) {
			Vector3 diff = target.position - parentTrans.position;
			float rot_z = Mathf.Atan2 (diff.y, diff.x) * Mathf.Rad2Deg;
			transform.rotation = Quaternion.Euler (0, 0, rot_z);
			prepareLaunch ();
			if (laser.enabled) {
				float dis = Vector2.Distance (target.position, parentTrans.position);
				mask.sizeDelta = new Vector2(dis,.39f);
			}


		} else if(col_timer != 0 || !target) {
			restLaunch ();
		}
	}

	protected abstract void restLaunch ();

	protected abstract void prepareLaunch ();
		
	void stopZoom(){
		zooming = false;
	}


	void OnTriggerEnter2D(Collider2D col){
		GameObject obj = col.gameObject;
		Transform objtrans = obj.transform;
		if (!target && obj.tag == TargetTag && !Targets.Contains(objtrans)) {
			target = objtrans;
			Targets.Add (objtrans);
			laser.enabled = true;		
		}else if (obj.tag == TargetTag && !Targets.Contains(objtrans)) {
			Targets.Add (obj.transform);
		}
	}

//	void OnTriggerStay2D(Collider2D col){
//		GameObject obj = col.gameObject;
//		Transform objtrans = obj.transform;
//		if (!target && obj.tag == TargetTag && !Targets.Contains(objtrans)) {
//			target = objtrans;
//			Targets.Add (objtrans);
//			laser.enabled = true;		
//		}else if (obj.tag == TargetTag && !Targets.Contains(objtrans)) {
//			Targets.Add (objtrans);	
//		} 
//	}

	void OnTriggerExit2D(Collider2D col){
		GameObject obj = col.gameObject;
		Transform objtrans = obj.transform;
		if (obj.transform == target) {
			target = null;
			Targets.Remove (objtrans);	
		}else if(Targets.Contains(objtrans)){
			Targets.Remove (objtrans);	
		}
	}

	public abstract void TriggerDetected (Collider2D obj);

	public abstract void ColliderDetected (Collision2D obj);

	public void Launch ()
	{
		if (col_timer >= LockOnShift + delayLaunch) {
			zooming = true;
			Vector2 dir = target.position - parentTrans.position;
			body.AddForce ((dir / dir.magnitude) * (Attforce*body.mass));
			sprtRen.color = rest_Color;
			col_timer = 0;
			CancelInvoke ();
			Invoke ("stopZoom", ZoomCooldown);
		}
	}

	public bool getZooming(){
		return zooming;
	}
}
