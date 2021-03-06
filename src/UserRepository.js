import User from "./User";


class UserRepository {
  constructor(userList, hydrationData, activityData, sleepData) {
    this.users = this.makeUsers(
      userList,
      hydrationData,
      activityData,
      sleepData
    );
  }

  makeUsers(userList, hydrationData, activityData, sleepData) {
    return userList.map(currentUser => {
      let user = new User(currentUser, hydrationData, activityData, sleepData);
      return user;
    });
  }

  getUser(id) {
    return this.users.find(user => {
      return user.id === id;
    });
  }

  calculateAverageStepGoal() {
    let total = this.users.reduce((sum, user) => {
      sum += user.dailyStepGoal;
      return sum;
    }, 0);
    return total / this.users.length;
  }

  calculateAverageActivity(date, property) {
    let result;
    let activityCounts = this.users.reduce((acc, user) => {
      user.activityRecord.forEach(item => {
        if (item.date === date) {
          acc.push(item);
        }
      });
      return acc;
    }, []);
    let totalCount = activityCounts.reduce((acc, count) => {
      acc += count[property];
      return acc;
    }, 0);
    if (totalCount === 0 && activityCounts.length === 0) {
      result = 0;
      return result;
    }
    result = Math.round(totalCount / activityCounts.length);
    return result;
  }

  calculateAverageSleepQuality() {
    let divisor = 0;
    let totalSleepQuality = this.users.reduce((acc, user) => {
      user.sleepRecord.forEach(sleep => {
        acc += sleep.sleepQuality;
        divisor++;
      });
      return acc;
    }, 0);
    return totalSleepQuality / divisor;
  }

  getLongestSleepers(date) {
    let topSleeper = this.users
      .filter(user => {
        return user.sleepRecord.filter(sleep => sleep.date === date);
      })
      .sort((a, b) => {
        return b.sleepRecord[0].hoursSlept - a.sleepRecord[0].hoursSlept;
      })
      .shift()
    return topSleeper.name;
  }

  getWorstSleepers(date) {
    let worstSleeper = this.users
      .filter(user => {
        return user.sleepRecord.filter(sleep => sleep.date === date);
      })
      .sort((a, b) => {
        return a.sleepRecord[0].hoursSlept - b.sleepRecord[0].hoursSlept;
      })
      .shift()
    return worstSleeper.name;
  }
}

export default UserRepository;
