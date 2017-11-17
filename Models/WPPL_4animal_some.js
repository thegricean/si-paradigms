// Model of "some", assuming 4 animals, and animals can be cats for dogs

// possible states of the world (number of dogs)
var statePrior = function() {
  return uniformDraw([0, 1, 2, 3, 4])
};

// possible utterances
var utterancePrior = function() {
  return uniformDraw(['all_dogs', 'some_dogs', 'none_dogs','all_cats', 'some_cats', 'none_cats']);
};

// meaning funtion to interpret the utterances
var literalMeanings = {
  all_dogs: function(state) { return state === 4; },
  some_dogs: function(state) { return state > 0; },
  none_dogs: function(state) { return state === 0; },
  all_cats: function(state) { return state === 0; },
  some_cats: function(state) { return state !== 4; },
  none_cats: function(state) { return state === 4; },
};

// literal listener
var literalListener = cache(function(utt) {
  return Infer({model: function(){
    var state = statePrior()
    var meaning = literalMeanings[utt]
    condition(meaning(state))
    return state
  }})
});

// set speaker optimality
var alpha = 1

// pragmatic speaker
var speaker = cache(function(state) {
  return Infer({model: function(){
    var utt = utterancePrior()
    factor(alpha * literalListener(utt).score(state))
    return utt
  }})
});

// pragmatic listener
var pragmaticListener = cache(function(utt) {
  return Infer({model: function(){
    var state = statePrior()
    observe(speaker(state),utt)
    return state
  }})
});

print("pragmatic listener's interpretation of 'some of the animals are dogs':")
viz.auto(pragmaticListener('some_dogs'));