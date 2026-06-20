import { useCallback, useReducer } from 'react';
import { requestPlan } from '../api/planApi';
import type { BudgetTooHigh, BudgetTooLow, FeasiblePlan, PlanResult, TripInput } from '../api/types';

export type PlannerState =
  | { step: 'input'; initialInput?: TripInput }
  | { step: 'submitting'; lastInput: TripInput }
  | { step: 'destinationSuggesting'; lastInput: TripInput; result: PlanResult }
  | { step: 'budgetRevision'; lastInput: TripInput; result: BudgetTooLow | BudgetTooHigh }
  | { step: 'results'; lastInput: TripInput; result: FeasiblePlan }
  | { step: 'requestFailed'; lastInput: TripInput; message: string };

type Action =
  | { type: 'SUBMIT'; input: TripInput }
  | { type: 'PLAN_SUCCEEDED'; result: PlanResult }
  | { type: 'PLAN_FAILED'; message: string }
  | { type: 'CONFIRM_DESTINATION' }
  | { type: 'EDIT_INPUT' };

function reducer(state: PlannerState, action: Action): PlannerState {
  switch (action.type) {
    case 'SUBMIT':
      return { step: 'submitting', lastInput: action.input };

    case 'PLAN_FAILED':
      if (state.step === 'input') return state;
      return { step: 'requestFailed', lastInput: state.lastInput, message: action.message };

    case 'PLAN_SUCCEEDED': {
      if (state.step !== 'submitting') return state;
      const { result } = action;
      const destinationWasSuggested =
        result.status === 'ok' ? result.tripSummary.destinationWasSuggested : result.destinationWasSuggested;

      // Destination wasn't user-chosen: let them confirm or pick a different
      // one before showing feasibility/results for it.
      if (destinationWasSuggested) {
        return { step: 'destinationSuggesting', lastInput: state.lastInput, result };
      }
      return resultToState(state.lastInput, result);
    }

    case 'CONFIRM_DESTINATION': {
      if (state.step !== 'destinationSuggesting') return state;
      const destination =
        state.result.status === 'ok' ? state.result.tripSummary.destination : state.result.destination;
      const lastInput = { ...state.lastInput, destination };
      return resultToState(lastInput, state.result);
    }

    case 'EDIT_INPUT':
      if (state.step === 'input') return state;
      return { step: 'input', initialInput: state.lastInput };

    default:
      return state;
  }
}

function resultToState(lastInput: TripInput, result: PlanResult): PlannerState {
  if (result.status === 'ok') return { step: 'results', lastInput, result };
  return { step: 'budgetRevision', lastInput, result };
}

export function usePlannerMachine() {
  const [state, dispatch] = useReducer(reducer, { step: 'input' });

  const submit = useCallback((input: TripInput) => {
    dispatch({ type: 'SUBMIT', input });
    requestPlan(input).then(
      (result) => dispatch({ type: 'PLAN_SUCCEEDED', result }),
      (err: Error) => dispatch({ type: 'PLAN_FAILED', message: err.message })
    );
  }, []);

  const confirmDestination = useCallback(() => dispatch({ type: 'CONFIRM_DESTINATION' }), []);
  const editInput = useCallback(() => dispatch({ type: 'EDIT_INPUT' }), []);
  const retry = useCallback(() => {
    if (state.step === 'requestFailed') submit(state.lastInput);
  }, [state, submit]);

  return { state, submit, confirmDestination, editInput, retry };
}
