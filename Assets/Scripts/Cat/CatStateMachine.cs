using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CatStateMachine
{
    public CatState currentState { get; private set; }

    public void Initialize(CatState _startingState)
    {
        currentState = _startingState;
        currentState.Enter();
    }

    public void ChangeState(CatState _newState)
    {
        currentState.Exit();
        currentState = _newState;
        currentState.Enter();
    }
}