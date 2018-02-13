///fold:
// tally up the state
var numTrue = function(state) {
  var fun = function(x) {
    x ? 1 : 0
  }
  return sum(map(fun,state))
}
///

// Here is the code from the Goodman and Stuhlmüller speaker-access SI model

// red apple base rate
var baserate = 0.5

// state prior
var statePrior = function() {
  var A = flip(baserate)
  var B = flip(baserate)
  return [A,B]
}

// speaker belief function
var belief = function(actualState, access) {
  var fun = function(access,state) {
    return access ? state : uniformDraw(statePrior())
  }
  return map2(fun, access, actualState);
}

// utterance prior
var utterancePrior = function() {
  uniformDraw(['A','B','AandB','AorB','none'])
}

// meaning funtion to interpret utterances
var literalMeanings = {
  A: function(state) { return state[0]; },
  B: function(state) { return state[1]; },
  AandB: function(state) { return all(function(s){s}, state); },
  AorB: function(state) { return any(function(s){s}, state); },
  none: function(state) { return all(function(s){s==false}, state); }
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
var speaker = cache(function(access,state) {
  return Infer({model: function(){
    var utt = utterancePrior()
    var beliefState = belief(state,access)
    factor(alpha * literalListener(utt).score(beliefState))
    return utt
  }})
});

// pragmatic listener
var pragmaticListener = cache(function(access,utt) {
  return Infer({model: function(){
    var state = statePrior()
    observe(speaker(access,state),utt)
    return numTrue(state)
  }})
});

print("pragmatic listener for a full-access speaker:")
viz.auto(pragmaticListener([true,true],'AorB'))
print("pragmatic listener for a partial-access speaker:")
viz.auto(pragmaticListener([true,false],'AorB'))