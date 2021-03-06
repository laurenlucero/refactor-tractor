import { expect } from "chai";

import userTestData from "../src/data/users-test-data";
import activityTestData from "../src/data/activity-test-data";
import sleepTestData from "../src/data/sleep-test-data";
import hydrationTestData from "../src/data/hydration-test-data";

import UserRepository from "../src/UserRepository";

describe("UserRepository", function() {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository(
      userTestData,
      hydrationTestData,
      activityTestData,
      sleepTestData
    );
  });

  it("should be an instance of user repository", function() {
    expect(userRepository).to.be.an.instanceof(UserRepository);
  });

  it("should hold an array of users", function() {
    expect(userRepository.users.length).to.equal(4);
  });

  it.only("should return user object when given a user id", function() {
    expect(userRepository.getUser(2)).to.equal(userRepository.users[1]);
  });

  it("should return average step goal for all users", function() {
    expect(userRepository.calculateAverageStepGoal()).to.equal(6000);
  });

  it("should calculate average amount of activity for users", function() {
    expect(
      userRepository.calculateAverageActivity("2019/06/15", "numSteps")
    ).to.equal(5091);
    expect(
      userRepository.calculateAverageActivity("2019/06/15", "minutesActive")
    ).to.equal(131);
    expect(
      userRepository.calculateAverageActivity("2019/06/15", "flightsOfStairs")
    ).to.equal(20);
  });

  it("should return 0 if no activity on specified date", function() {
    expect(
      userRepository.calculateAverageActivity("2020/04/05", "numSteps")
    ).to.equal(0);
  });

  it("should find the top sleeper", function() {
    expect(userRepository.getLongestSleepers("2019/09/22")).to.equal('Herminia Witting');
  });

  it("should find the worst sleeper", function() {
    expect(userRepository.getWorstSleepers("2019/09/22")).to.equal('Luisa Hane');
  });

  it("should calculate the average sleep quality for all users", function() {
    expect(userRepository.calculateAverageSleepQuality()).to.equal(3.2);
  });
});
