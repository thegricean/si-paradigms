var statePrior = function() {
  return uniformDraw([["A"], ["B"], ["A","B"]])
};

var utterancePrior = function() {
  return uniformDraw(['A', 'B', 'AorB', 'AandB']);
};

var literalMeanings = {
  A: function(state) { return state.includes("A"); },
  B: function(state) { return state.includes("B"); },
  AorB: function(state) { return state.includes("A") || state.includes("B"); },
  AandB: function(state) { return state.includes("A") && state.includes("B"); },
};

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

print("pragmatic listener's interpretation of 'B':")
viz.hist(pragmaticListener('B'));