using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CatTiredState : CatState
{
    private Vector3 preScale;

    public CatTiredState(Cat _cat, CatStateMachine _stateMachine, string _animBoolName) : base(_cat, _stateMachine, _animBoolName)
    {
    }

    public override void Enter()
    {
        base.Enter();
        // cld.offset = new Vector2(-0.08095586f, -0.07425693f);
        // cld.size = new Vector2(1.880327f, 1.089688f);
        //我要修改anim的transform的scale
        preScale = cat.anim.transform.localScale;
        cat.anim.transform.localScale = new Vector3(0.15f, 0.15f, cat.anim.transform.localScale.z);
        timeUpperBound = 3f;
    }

    public override void Update()
    {
        base.Update();
        timer += Time.deltaTime;
        if (timer >= timeUpperBound)
        {
            stateMachine.ChangeState(cat.idleState);
        }
    }

    public override void Exit()
    {
        base.Exit();
        cat.anim.transform.localScale = preScale;
    }
}
