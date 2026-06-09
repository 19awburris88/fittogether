// Single switch to move between mock and real API later.
import * as mock from "./mock";
import * as api  from "./realApi";

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export const ds = {
  // dashboard + core logs
  getDashboard:  (...a) => useMock ? mock.getDashboard(...a)  : api.getDashboard(...a),
  addWater:      (...a) => useMock ? mock.addWater(...a)      : api.addWater(...a),
  logWorkout:    (...a) => useMock ? mock.logWorkout(...a)    : api.logWorkout(...a),

  // challenges/rewards/activity
  getChallenges: (...a) => useMock ? mock.getChallenges(...a) : api.getChallenges(...a),
  createChallenge:(...a) => useMock ? mock.createChallenge(...a): api.createChallenge(...a),
  getRewards:    (...a) => useMock ? mock.getRewards(...a)    : api.getRewards(...a),
  getActivity:   (...a) => useMock ? mock.getActivity(...a)   : api.getActivity(...a),

  // avatars
  setAvatar:     (...a) => useMock ? mock.setAvatar(...a)     : api.setAvatar(...a),

  // wagers / side bets
  getWagers:      (...a) => useMock ? mock.getWagers(...a)      : api.getWagers(...a),
  createWager:    (...a) => useMock ? mock.createWager(...a)    : api.createWager(...a),
  markStepsForDay:(...a) => useMock ? mock.markStepsForDay(...a): api.markStepsForDay(...a),

  // rewards
  redeemReward:    (...a) => useMock ? mock.redeemReward(...a)    : api.redeemReward(...a),

  // workout log
  getWorkoutLog:   (...a) => useMock ? mock.getWorkoutLog(...a)   : api.getWorkoutLog(...a),
  addWorkoutEntry: (...a) => useMock ? mock.addWorkoutEntry(...a) : api.addWorkoutEntry(...a),

  // progress charts
  getHistory:      (...a) => useMock ? mock.getHistory(...a)      : api.getHistory(...a),
};
