// ############################## Helper functions ##############################

// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
  // Hide all slides
  $(".slide").hide();
  // Show just the slide we want to show
  $("#"+id).show();
}

// Get random integers.
// When called with no arguments, it returns either 0 or 1. When called with one argument, *a*, it returns a number in {*0, 1, ..., a-1*}. When called with two arguments, *a* and *b*, returns a random value in {*a*, *a + 1*, ... , *b*}.
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

// Remove Option Redundancy 
function options() {
  var ages = document.getElementById("age");
  var max  = 90;
  for (i = 18; i < max; i++) {
    var option = new Option(String(i), i);
    ages.options.add(option);
  }
}

// Randomize Radio Buttons 
function createRadioButtons() {
  var choice = random(3);
  var radios = document.getElementsByName(String(choice))
  for (i = 0; i < radios.length; i++) {
    radios[i].style.visibility = 'visible'
  }
}

// Add a random selection function to all arrays (e.g., <code>[4,8,7].random()</code> could return 4, 8, or 7). This is useful for condition randomization.
Array.prototype.random = function() {
  return this[random(this.length)];
}

// shuffle ordering of argument array -- are we missing a parenthesis?
//function shuffle (a)
//{
//    var o = [];
//
//    for (var i=0; i < a.length; i++) {
//      o[i] = a[i];
//    }
//
//    for (var j, x, i = o.length;
//         i;
//         j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//    return o;
//}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Select 6 Random Trials, one frome each 
function randomTrials(trials){
  var keys = Object.keys(trials)
  var shuf = shuffle(keys)
  var output = []
  for (i = 0; i < shuf.length; i++) {
    output.push(Object.values(trials[shuf[i]])[0])
  }
  return output
}

// from: http://www.sitepoint.com/url-parameters-jquery/
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else{
    return results[1] || 0;
  }
}

// -------------------------- Conditions and Trial Order -----------------------------------//

var trials = {
    training: ["training_dog_animal","dog.jpg", "There is an animal!", "X.A"],    
    X_X: {X_X_dog: ["X.X_dog","dog.jpg", "Bob: There is a dog!"],
          X_X_cat: ["X.X_cat","cat.jpg", "Bob: There is a cat!"],
          X_X_ele: ["X.X_ele","ele.jpg", "Bob: There is an elephant!"]},
    X_Z:{
        X_Z_dog_cat: ["X_Z_dog_cat","dog.jpg", "Bob: There is a cat!"],
        X_Z_cat_dog: ["X_Z_cat_dog","cat.jpg", "Bob: There is a dog!"],
        X_Z_ele_cat: ["X_Z_ele_cat","ele.jpg", "Bob: There is a cat!"],
        X_Z_dog_ele: ["X_Z_dog_ele","dog.jpg", "Bob: There is an elephant!"],
        X_Z_cat_ele: ["X_Z_cat_ele","cat.jpg", "Bob: There is an elephant!"],
        X_Z_ele_dog: ["X_Z_ele_dog","ele.jpg", "Bob: There is a dog!"]},
    XY_XorY:{
        XY_XorY_catdog: ["XY.XorY_catdog","catdog.jpg", "Bob: There is a cat or a dog!"],
        XY_XorY_catele: ["XY.XorY_catele","catele.jpg", "Bob: There is a cat or an elephant!"],
        XY_XorY_dogele: ["XY.XorY_dogele","dogele.jpg", "Bob: There is a dog or an elephant!"]},
    XY_XandY:{
        XY_XandY_catdog: ["XY.XandY_catdog","catdog.jpg", "Bob: There is a cat and a dog!"],
        XY_XandY_catele: ["XY.XandY_catele","catele.jpg", "Bob: There is a cat and an elephant!"],
        XY_XandY_dogele: ["XY.XandY_dogele","dogele.jpg", "Bob: There is a dog and an elephant!"]},
    XY_X: {
        XY_X_catdog_cat: ["XY_X_catdog_cat","catdog.jpg", "Bob: There is a cat!"],
        XY_X_catele_cat: ["XY_X_catele_cat","catele.jpg", "Bob: There is a cat!"],
        XY_X_dogele_dog: ["XY_X_dogele_dog","dogele.jpg", "Bob: There is a dog!"],
        XY_X_catdog_dog: ["XY_X_catdog_dog","catdog.jpg", "Bob: There is a dog!"],
        XY_X_catele_ele: ["XY_X_catele_ele","catele.jpg", "Bob: There is an elephant!"],
        XY_X_dogele_ele: ["XY_X_dogele_ele","dogele.jpg", "Bob: There is an elephant!"]},
    XY_Z: {
        XY_Z_catdog_ele: ["XY_Z_catdog_ele","catdog.jpg", "Bob: There is an elephant!"],
        XY_Z_catele_dog: ["XY_Z_catele_dog","catele.jpg", "Bob: There is a dog!"],
        XY_Z_dogele_cat: ["XY_Z_dogele_cat","dogele.jpg", "Bob: There is a cat!"]},
    X_XorY: { 
        X_XorY_cat_catdog: ["X_XorY_cat_catdog","cat.jpg", "Bob: There is a cat or a dog!"],
        X_XorY_cat_catele: ["X_XorY_cat_catele","cat.jpg", "Bob: There is a cat or an elephant!"],
        X_XorY_dog_dogele: ["X_XorY_dog_dogele","dog.jpg", "Bob: There is a dog or an elephant!"],
        X_XorY_dog_catdog: ["X_XorY_dog_catdog","dog.jpg", "Bob: There is a cat or a dog!"],
        X_XorY_ele_catele: ["X_XorY_ele_catele","ele.jpg", "Bob: There is a cat or an elephant!"],
        X_XorY_ele_dogele: ["X_XorY_ele_dogele","ele.jpg", "Bob: There is a dog or an elephant!"],},
    X_XandY: {
        X_XandY_cat_catdog: ["X_XandY_cat_catdog","cat.jpg", "Bob: There is a cat and a dog!"],
        X_XandY_cat_catele: ["X_XandY_cat_catele","cat.jpg", "Bob: There is a cat and an elephant!"],
        X_XandY_dog_dogele: ["X_XandY_dog_dogele","dog.jpg", "Bob: There is a dog and an elephant!"],
        X_XandY_dog_catdog: ["X_XandY_dog_catdog","dog.jpg", "Bob: There is a cat and a dog!"],
        X_XandY_ele_catele: ["X_XandY_ele_catele","ele.jpg", "Bob: There is a cat and an elephant!"],
        X_XandY_ele_dogele: ["X_XandY_ele_dogele","ele.jpg", "Bob: There is a dog and an elephant!"]}
}

var sample = [trials.X_X.X_X_cat, trials.X_X.X_X_dog, trials.X_X.X_X_ele]

var rsample = shuffle(sample)

var totalTrials = sample.length;

// ############################## The Experiment Code and Functions ##############################

// Show the first slide
showSlide("instructions");

var experiment = {

// DATA: The data structure that records the responses to be sent to mTurk
    data: {
        age: [],
        gender: [],
        education: [],
        version: [],
        trial: [], // what trial/video was presented to the participant
        response: [], // response
        feedback: [], // their linguistic feedback
        elapsed_ms: [], // time taken to provide an answer
        num_errors: [], // number of times participant attempted to go to the next slide without providing an answer
        expt_aim: [], // participant's comments on the aim of the study
        expt_gen: [], // participant's general comments
        language: [], // what is the native language of the participant
        user_agent: [],
        window_width: [],
        window_height: [],
    },

    start_ms: 0,  // time current trial started ms
    num_errors: 0,    // number of errors so far in current trial
    
    
// END FUNCTION: The function to call when the experiment has ended
    end: function() {
      showSlide("finished");
      setTimeout(function() {
        turk.submit(experiment.data)
      }, 1500);
    },

// LOG FUNCTION: the function that records the responses
    log_response: function() {
      var response_logged = false;
      var elapsed = Date.now() - experiment.start_ms;

      //Array of radio buttons
      var radio = document.getElementsByName("judgment");

      // Loop through radio buttons
      for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          experiment.data.response.push(radio[i].value);
          experiment.data.elapsed_ms.push(elapsed);
          experiment.data.num_errors.push(experiment.num_errors);
          response_logged = true;
        }
      }

      if (response_logged) {
        nextButton.blur();

        // uncheck radio buttons
        for (i = 0; i < radio.length; i++) {
          radio[i].checked = false
        }

        $('#stage-content').hide();
        experiment.next();
      } else {
          experiment.num_errors += 1;
          $("#testMessage").html('<font color="red">' +
               'Please make a response!' +
               '</font>');
      }
    
    experiment.data.audioTest.push(document.getElementById('feedback').value)
    },

// NEXT FUNCTION: The work horse of the sequence - what to do on every trial.
    next: function() {
      // Allow experiment to start if it's a turk worker OR if it's a test run
      if (window.self == window.top | turk.workerId.length > 0) {
          $("#testMessage").html('');   // clear the test message
          $("#prog").attr("style","width:" +
              String(100 * (1 - sample.length/totalTrials)) + "%")
          // style="width:progressTotal%"
          window.setTimeout(function() {
            $('#stage-content').show();
            experiment.start_ms = Date.now();
            experiment.num_errors = 0;
          }, 150);

          // Get the current trial - <code>shift()</code> removes the first element
          // select from our scales array and stop exp after we've exhausted all the domains
          var current_trial = sample.shift();

          //If the current trial is undefined, call the end function.
          if (typeof current_trial == "undefined") {
            return experiment.debriefing();
          }

          // Display the sentence stimuli
          // var face_filename = getFaceFile(face_dft);
          
          $("#card").attr('src', "images/".concat(current_trial[1]));
          $("#guess").text(current_trial[2]);

          // push all relevant variables into data object
          experiment.data.trial.push(current_trial[0]);
          experiment.data.window_width.push($(window).width());
          experiment.data.window_height.push($(window).height());

          showSlide("stage");
      }
    },

    //  go to debriefing slide
    debriefing: function() {
      showSlide("debriefing");
    },

    // submitcomments function
    submit_comments: function() {
        experiment.data.age.push(document.getElementById("age").value);
        experiment.data.gender.push(document.getElementById("gender").value);
        experiment.data.education.push(document.getElementById("education").value);
        experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
        experiment.data.expt_gen.push(document.getElementById("expcomments").value);
        experiment.data.language.push(document.getElementById("explanguage").value);
        experiment.data.user_agent.push(window.navigator.userAgent);
        experiment.data.version.push(trial_order);
        experiment.end();
    }
}

$(function() {
  $('form#demographics').validate({
    rules: {
      "age": "required",
      "gender": "required",
      "education": "required",
//      "race[]": "required",
    },
    messages: {
      "age": "Please choose an option",
      "gender": "Please choose an option",
      "education": "Please choose an option",
    },
    submitHandler: experiment.submit_comments
  });
});
