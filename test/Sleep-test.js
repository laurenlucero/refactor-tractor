import { expect } from "chai";

import sleepTestData from "../src/data/sleep-test-data";

import Sleep from "../src/Sleep";

describe("Sleep", function() {
  let sleep1;

  beforeEach(() => {
    sleep1 = new Sleep(sleepTestData[0]);
  });

  it("should be an instance of Sleep", function() {
    expect(sleep1).to.be.an.instanceof(Sleep);
  });

  it("should hold a userId", function() {
    expect(sleep1.userID).to.equal(1);
  });

  it("should hold a date", function() {
    expect(sleep1.date).to.equal("2019/06/15");
  });

  it("should hold hours slept", function() {
    expect(sleep1.hoursSlept).to.equal(6.1);
  });

  it("should hold sleep quality", function() {
    expect(sleep1.sleepQuality).to.equal(2.2);
  });
});
