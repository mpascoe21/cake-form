const slideOptions = {
  dots: true,
  infinite: true,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1
}

let dateOfCakeArr = [];
let thisYearBirthdayArr = [];

$(document).ready(function() {

  $('.slider-wrap').slick({
    dots: true,
    autoplay: true,
    fade: true,
    autoplaySpeed: 1000,
    speed: 2000,
  });

  $('.form-btn').click(function () {
    let employeeName = $('#name').val();
    let employeeDob = $('#dob').val();
    console.log('employeeDob:', employeeDob);
    let dob = new Date(employeeDob);
    // dob.setFullYear();

    console.log('BIRTHDAY:', dob);
    // console.log('DAY OF THE WEEK:', dob.getDay());

    let today = new Date();
    console.log('TODAY:', today);
    const months =  ["January","February","March","April","May","June","July",
      "August","September","October","November","December"];

    let currentYear = today.getFullYear();
    console.log('CURRENT YEAR:', currentYear);
    // console.log('this Year Birthday', );

    let thisBirthday = new Date(dob);
    console.log(thisBirthday);
    thisBirthday.setFullYear(today.getFullYear());
    console.log('BIRTHDAY THIS YEAR:', thisBirthday);

    // console.log('DAY OF THE WEEK THIS YEAR:', thisBirthday.getDay());

    let year = thisBirthday.getFullYear();
    // console.log('year:', year);
    let month = thisBirthday.getMonth();
    // console.log('month:', month);
    let thisDate = thisBirthday.getDate();
    // console.log('DATE:', thisDate);
    let thisDay = thisBirthday.getDay();
    // console.log('DAY:', thisDay);

    let dateOfCake;

    if (thisBirthday.getDay() > 0 && thisBirthday.getDay() < 6 && thisBirthday.getDay() !== 5) {
      dateOfCake = new Date(year, month, thisDate + 1);
    } else if (thisBirthday.getDay() === 0) {
      dateOfCake = new Date(year, month, thisDate + 2);
    } else if (thisBirthday.getDay() === 5) {
      dateOfCake = new Date(year, month, thisDate + 3);
    } else if (thisBirthday.getDay() === 6) {
      dateOfCake = new Date(year, month, thisDate + 3);
    }

    console.log('DAY OF CAKE:', dateOfCake.toDateString());

    let sizeOfCake = 'small';

    thisYearBirthdayArr.forEach((bday) => {
      if (bday === thisBirthday.toDateString()) {
        sizeOfCake = 'large';
      } else {
        sizeOfCake = 'small'
      }
    })

    console.log('SIZE', sizeOfCake);

    thisYearBirthdayArr.push(thisBirthday.toDateString());
    console.log('this Year Birthday Arr', thisYearBirthdayArr);


    // let monthOfCake = dateOfCake.getMonth();
    // let dayOfCake = dateOfCake.getDate();
    // let yearOfCake = dateOfCake.getFullYear();
    // let dateOfCakeOutput = new Date(dayOfCake, monthOfCake, yearOfCake);
    // console.log('OUTPUT DAY OF CAKE:', dateOfCakeOutput);

    // dateOfCakeArr.push(dateOfCake.toDateString());
    // console.log(dateOfCakeArr);

    $('.data-list').append('<li class="employee-data"><ul><li>'+ employeeName +'</li><li>'+ dob.toDateString() +'</li><li>'+ dateOfCake.toDateString() +'</li><li>'+sizeOfCake+'</li></ul></li>')
    return;
  })

  $('.test-slider').slick();



  // let myDate = new Date('29 Feb 2020');
  // let formattedDate = new Intl.DateTimeFormat("en-US", {
  //   year: "numeric",
  //   month: "short",
  //   day: "2-digit",
  // }).format(myDate);
  //
  // alert(formattedDate)

});
