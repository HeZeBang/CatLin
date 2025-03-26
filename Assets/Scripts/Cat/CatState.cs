using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CatState
{
    protected Cat cat;
    protected CatStateMachine stateMachine;
    protected string animBoolName;

    protected BoxCollider2D cld;

    protected float timer;
    protected float timeUpperBound;

    public CatState(Cat _cat, CatStateMachine _stateMachine, string _animBoolName)
    {
        this.cat = _cat;
        this.stateMachine = _stateMachine;
        this.animBoolName = _animBoolName;
    }

    public virtual void Enter()
    {
        cld = cat.cld;
        cat.anim.SetBool(this.animBoolName, true);
        timer = 0;
    }

    public virtual void Update()
    {
        Debug.Log(cat.anim.transform.localScale);
    }

    public virtual void Exit()
    {
        cat.anim.SetBool(this.animBoolName, false);
    }
}
