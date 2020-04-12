import $ from "jquery";
import "./css/base.scss";
import "./css/styles.scss";

import UserRepository from "./UserRepository";
import User from "./User";
import Activity from "./Activity";
import Hydration from "./Hydration";
import Sleep from "./Sleep";

let todayDate = "2019/09/22";
let userRepository;
let user;
let userID = Math.floor(Math.random() * 50);

Promise.all([
  fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData")
  .then(response => response.json()),
  fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData")
  .then(response => response.json()),
  fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData")
  .then(response => response.json()),
  fetch("https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData")
  .then(response => response.json())
])
  .then(data =>
    makeRepo(
      data[0].userData,
      data[1].sleepData,
      data[2].hydrationData,
      data[3].activityData
    )
  )
  .then(data => userRepository.getUser(userID))
  .then(data => getUserName(data))
  .then(data => displayDailySteps())
  .then(data => displayDailyWater())
  .then(data => displayDailyStairs())
  .then(data => displayDailySleep())
  .catch(error => console.log(error));

function makeRepo(users, sleep, hydration, activity) {
  userRepository = new UserRepository(users, hydration, activity, sleep);
  getRandomUser(hydration, activity, sleep);
}

function getRandomUser(hydration, activity, sleep) {
  user = new User(userRepository.users[userID - 1], hydration, activity, sleep);
}

function getUserName(data) {
  $("#header-name").text(`${user.getFirstName()}'S FITLIT`);
}

function displayDailySteps() {
  let steps = user.activityRecord.find(activity => {
    return activity.userID === user.id && activity.date === todayDate;
  }).numSteps;
  $("#steps-user-steps-today").text(steps);
}

function displayDailyWater() {
  let water = user.hydrationRecord.find(hydration => {
    return hydration.userID === user.id && hydration.date === todayDate;
  }).numOunces;
  $("#hydration-user-ounces-today").text(water);
}

function displayDailyStairs() {
  let stairs =
    user.activityRecord.find(activity => {
      return activity.userID === user.id && activity.date === todayDate;
    }).flightsOfStairs * 12;
  $("#stairs-user-stairs-today").text(stairs);
}

function displayDailySleep() {
  let sleep = user.sleepRecord.find(sleep => {
    return sleep.userID === user.id && sleep.date === todayDate;
  }).hoursSlept;
  $("#sleep-user-hours-today").text(sleep);
}

function showDropdown() {
  $('#dropdown-name').text(user.name.toUpperCase());
  $('#user-info-dropdown').toggleClass('hide');
  $('#dropdown-email').text(`EMAIL | ${user.email}`);
  $('#dropdown-goal').text(`DAILY STEP GOAL | ${user.dailyStepGoal}`);
  user.findFriendsTotalStepsForWeek(userRepository, todayDate);
  if ($('#dropdown-friends-steps-container').children().length === 0) {
  user.friendsWeeklySteps.forEach(friend => {
      $('#dropdown-friends-steps-container').append(`
        <p class='dropdown-p friends-steps'>${friend.firstName} |  ${friend.totalWeeklySteps}</p>
        `);
    });
  }
}

$('#profile-button').on('click', showDropdown);
$('main').on('click', showInfo);
$('#sleep-entry-button').on('click', displayForm)
$('#activity-entry-button').on('click', displayForm)
$('#hydration-entry-button').on('click', displayForm)

function displayForm(event) {
  //need to display the appropriate form
  //need to retrieve the first word of the entry button itself
 let currentCategory = $(event.target).attr('id').split('-')[0];
 let allPages = $('.allPageInfo').children().toArray().splice(0, 5);
 console.log(`.${currentCategory}-data-form`)
 allPages.forEach(page => $(page).addClass('hide'))
 $(`.${currentCategory}-data-form`).removeClass('hide');
 if (currentCategory === "sleep") {
   console.log('I\'m in here')
   $(`.${currentCategory}-data-form`).html(`<form id="formInfo" action="https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData"  method="POST">
      <label for="date">Date(YYYY/MM/DD)</label>
      <input type="text" id="sleep-date" name="date" class="dateInfo">
      <label for="hoursSlept">Hours of Sleep</label>
      <input type="text" id="hoursSlept" name="hoursSlept">
      <label for="sleepQuality">Estimated Sleep Quality</label>
      <input type="text" id="sleepQuality" name="sleepQuality">

      <button type="submit">Submit</button>
      </form>`)
      $('#formInfo').on('submit', postFormData)
 } else if (currentCategory === "activity") {
   // $(`.${currentCategory}-data-form`).html(`<form id="formInfo" action="https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData" method="POST">
   //    <label for="date">Date(YYYY/MM/DD)</label>
   //    <input type="date" id="activity-date" name="date" class="dateInfo">
   //    <label for="numSteps">Number of Steps</label>
   //    <input type="text" id="numSteps" name="numSteps">
   //    <label for="minutesActive">Active Minutes</label>
   //    <input type="text" id="minutesActive" name="minutesActive">
   //    <label for="flightsOfStairs">Active Minutes</label>
   //    <input type="text" id="flightsOfStairs" name="flightsOfStairs">
   //    <button type="submit">Submit</button>
   //    </form>`)

 } else if (currentCategory === "hydration") {

 }
}

$('#activity-entry-form').on('submit', (event)=> {
  event.preventDefault();
  let url = "https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData"
  // let activityDate = $('#activity-date')

  // console.log(date.value.split('-').join('/'))
  console.log(+$('#minutesActive').val())

  //  let completedForm = new FormData();
  //  completedForm.append('userID', +user.id);
  //  console.log($('#activity-date').val().split('-').join('/'))
  //  completedForm.append('date', $('#activity-date').val().split('-').join('/'));
  //  completedForm.append('numSteps', +$('#numSteps').val());
  //  completedForm.append('minutesActive', +$('#minutesActive').val());
  //  completedForm.append('flightsOfStairs', +$('#flightsOfStairs').val());
  //  // console.log(typeof completedForm[1])
  // console.log(...completedForm)
  let mainBody = {
    "userID": user.id,
    "date": todayDate,
    "numSteps": +$('#numSteps').val(),
    "minutesActive": +$('#minutesActive').val(),
    "flightsOfStairs": +$('#flightsOfStairs').val()
  }
// console.log(typeof mainBody.date)
// console.log(mainBody.userID)
// console.log(mainBody.numSteps)
// console.log(mainBody.minutesActive)
console.log(mainBody)
  // mainBody.userID = user.id;
  // mainBody.date = $('#activity-date').val().split('-').join('/');
  // mainBody.numSteps = +$('#numSteps').val();
  // mainBody.minutesActive = +$('#minutesActive').val();
  // mainBody.flightsOfStairs = +$('#flightsOfStairs').val()
  // console.log(mainBody)

  fetch(url, {
  method: "POST",
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  body: JSON.stringify(mainBody)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
});


function postFormData() {
  let url = "https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData"

  event.preventDefault();

  // console.log(date.value.split('-').join('/'))

   let completedForm = new FormData();
   completedForm.append('userID', +user.id);
   completedForm.append('date', $('#sleep-date').val().split('-').join('/'));
   completedForm.append('hoursSlept', +$('#hoursSlept').val());
   completedForm.append('sleepQuality', +$('#sleepQuality').val());
   // console.log(typeof completedForm[1])
  // console.log(...completedForm)
  fetch(url, {
  method: "POST",
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  body: JSON.stringify(completedForm),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  }

// let stairsFriendsCard = document.querySelector('#stairs-friends-card');

// allStepCards =
let stepCard = $('#steps-card-container').children().toArray()
let waterCard = $('#hydration-card-container').children().toArray()
let sleepCard = $('#sleep-card-container').children().toArray()
let stairsCard = $('#stairs-card-container').children().toArray()


function showInfo(event) {
  // let category = event.target.parentsUntil('main').toArray()[1] variable
  // category.children().toArray();
  //
  let categoryCard = $(event.target).parentsUntil('main').toArray()[1];
  let type = $(event.target).attr('class').split(' ');
  let cat = type[0]
  let allCategoryCards = $(`#${type[0]}-card-container`).children().toArray();
  // cardName = 'steps'
  // let cardArray = $('#${cardName}-card-container').children().toArray()
  // console.log(categoryCard.parents('main').toArray());
  //trying to get array using categoryCard to cycle through in order to do the for forEach
  if($(event.target).hasClass(`${type[0]}-info-button`) && $(`#${type[0]}-info-card`).hasClass('hide')) {
    allCategoryCards.forEach(element => $(element).addClass('hide'))
    $(`#${type[0]}-info-card`).removeClass('hide');
    // flipCard(event)
  } else if ($(event.target).hasClass(`${type[0]}-friends-button`) && $(`#${type[0]}-friends-card`).hasClass('hide')) {
    allCategoryCards.forEach(element => $(element).addClass('hide'))
    $(`#${type[0]}-friends-card`).removeClass('hide');

  } else if($(event.target).hasClass(`${type[0]}-calendar-button`) && $(`#${type[0]}-calendar-card`).hasClass('hide')) {
    allCategoryCards.forEach(element => $(element).addClass('hide'))
    $(`#${type[0]}-calendar-card`).removeClass('hide');

  } else if ($(event.target).hasClass(`${type[0]}-trending-button`) && $(`#${type[0]}-trending-card`).hasClass('hide')) {
    allCategoryCards.forEach(element => $(element).addClass('hide'))
    $(`#${type[0]}-trending-card`).removeClass('hide');
    updateTrendingStepDays();
  } else if ($(event.target).hasClass(`${cat}-go-back-button`))
    clear(type[0], allCategoryCards);
}

function clear(category, allCategoryCards) {  allCategoryCards.forEach(element => $(element).addClass('hide'))
  $(`#${category}-main-card`).removeClass('hide');
}

function flipCard(event) {
  event.target.classList.addClass('hide');
  cardToShow.classList.removeClass('hide');
}





function updateTrendingStepDays() {
  user.findTrendingStepDays();
  $('.trending-steps-phrase-container').html(`<p class='trend-line'>${user.trendingStepDays[0]}</p>`);
}
//for each that excludes event.target
//for each for all elements in an array of cards
//then you would toggle show for the event.target
//can you interpolate that?

// inner text
// $('#hydration-friend-ounces-today').text(userRepository.calculateAverageDailyWater(todayDate));
// $('#hydration-info-glasses-today').text(hydrationData.find(hydration => {return hydration.userID === user.id && hydration.date === todayDate}).numOunces / 8);
// $('#sleep-calendar-hours-average-weekly').text(user.calculateAverageHoursThisWeek(todayDate));
// $('#sleep-friend-longest-sleeper').text(userRepository.users.find(user => {return user.id === userRepository.getLongestSleepers(todayDate)}).getFirstName());
// $('#sleep-friend-worst-sleeper').text(userRepository.users.find(user => {return user.id === userRepository.getWorstSleepers(todayDate)}).getFirstName());
// $('#sleep-info-hours-average-alltime').text(user.hoursSleptAverage);
// $('#sleep-info-hours-average-alltime').text(user.hoursSleptAverage);
// $('#sleep-info-quality-today').text(sleepData.find(sleep => {return sleep.userID === user.id && sleep.date === todayDate;}).sleepQuality);
// $('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate) * 12).toFixed(0));
// $('#stairs-calendar-flights-average-weekly').text(user.calculateAverageFlightsThisWeek(todayDate));
// $('#stairs-friend-flights-average-today').text((userRepository.calculateAverageStairs(todayDate) / 12).toFixed(1));
// $('#stairs-info-flights-today').text(activityData.find(activity => {return activity.userID === user.id && activity.date === todayDate}).flightsOfStairs);
// $('#steps-calendar-total-active-minutes-weekly').text(user.calculateAverageMinutesActiveThisWeek(todayDate));
// $('#steps-calendar-total-steps-weekly').text(user.calculateAverageStepsThisWeek(todayDate));
// $('#steps-friend-active-minutes-average-today').text(userRepository.calculateAverageMinutesActive(todayDate));
// $('#steps-friend-average-step-goal').text(`${userRepository.calculateAverageStepGoal()}`);
// $('#steps-friend-steps-average-today').text(userRepository.calculateAverageSteps(todayDate));
// $('#steps-info-active-minutes-today').text(activityData.find(activity => {return activity.userID === user.id && activity.date === todayDate}).minutesActive);
// $(stepsInfoMilesWalkedToday).text(user.activityRecord.find(activity => {return (activity.date === todayDate && activity.userId === user.id)}).calculateMiles(userRepository));
//$('#sleep-info-quality-average-alltime').text(user.sleepQualityAverage);

// original code below

// user.findFriendsNames(userRepository.users);

//EM: too many variables
// let dailyOz = document.querySelectorAll('.daily-oz');
// let hydrationCalendarCard = document.querySelector('#hydration-calendar-card');
// let hydrationFriendsCard = document.querySelector('#hydration-friends-card');
// let hydrationInfoCard = document.querySelector('#hydration-info-card');
// let hydrationMainCard = document.querySelector('#hydration-main-card');
// let sleepCalendarCard = document.querySelector('#sleep-calendar-card');
// let sleepCalendarHoursAverageWeekly = document.querySelector('#sleep-calendar-hours-average-weekly');
// let sleepFriendsCard = document.querySelector('#sleep-friends-card');
// let sleepInfoCard = document.querySelector('#sleep-info-card');
// let sleepMainCard = document.querySelector('#sleep-main-card');

// //EM: sortedHydrationDataByDate should be in a function?
// // let sortedHydrationDataByDate = user.ouncesRecord.sort((a, b) => {
// //   if (Object.keys(a)[0] > Object.keys(b)[0]) {
// //     return -1;
// //   }
// //   if (Object.keys(a)[0] < Object.keys(b)[0]) {
// //     return 1;
// //   }
// //   return 0;
// // });

// let stairsCalendarCard = document.querySelector('#stairs-calendar-card');
// let stairsInfoCard = document.querySelector('#stairs-info-card');
// let stairsMainCard = document.querySelector('#stairs-main-card');
// let stairsTrendingButton = document.querySelector('.stairs-trending-button');
// let stairsTrendingCard = document.querySelector('#stairs-trending-card');
// let stepsInfoMilesWalkedToday = document.querySelector('#steps-info-miles-walked-today');
// let stepsTrendingButton = document.querySelector('.steps-trending-button');
// let trendingStairsPhraseContainer = document.querySelector('.trending-stairs-phrase-container');


// event listeners
// // stairsTrendingButton.addEventListener('click', updateTrendingStairsDays());
// // stepsTrendingButton.addEventListener('click', updateTrendingStepDays());




// //EM: needs refactoring


// // function updateTrendingStairsDays() {
// //   user.findTrendingStairsDays();
// //   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
// // }

// //EM: duplicate function?
// function updateTrendingStepDays() {
//   user.findTrendingStepDays();
//   trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
// }

// //EM: for loop outside of function?
// for (var i = 0; i < dailyOz.length; i++) {
//   dailyOz[i].innerText = user.addDailyOunces(Object.keys(sortedHydrationDataByDate[i])[0])
// }

// //EM: should be inside function
// stairsTrendingButton.addEventListener('click', function() {
//   user.findTrendingStairsDays();
//   trendingStairsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStairsDays[0]}</p>`;
// });

// stepsTrendingButton.addEventListener('click', function() {
//   user.findTrendingStepDays();
//   trendingStepsPhraseContainer.innerHTML = `<p class='trend-line'>${user.trendingStepDays[0]}</p>`;
// });

// user.findFriendsTotalStepsForWeek(userRepository.users, todayDate);


// let friendsStepsParagraphs = document.querySelectorAll('.friends-steps');

// //EM: refactor
// friendsStepsParagraphs.forEach(paragraph => {
//   if (friendsStepsParagraphs[0] === paragraph) {
//     paragraph.classList.add('green-text');
//   }
//   if (friendsStepsParagraphs[friendsStepsParagraphs.length - 1] === paragraph) {
//     paragraph.classList.add('red-text');
//   }
//   if (paragraph.innerText.includes('YOU')) {
//     paragraph.classList.add('yellow-text');
//   }
// });
