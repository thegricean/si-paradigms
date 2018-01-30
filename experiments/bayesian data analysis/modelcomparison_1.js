var statePrior = function() {
  return uniformDraw([["A"], ["B"], ["A","B"], ["C"], ["A","C"], ["B","C"]])
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

print("speaker distribution given state where A & B true:")
viz.hist(speaker(["A","B"]));

//Bayesian data analysis. Calculate P(M^0 | D), where D = the results for how people
//responded in the "binary" condition where they saw two animals "A" and "B" on the card
//but the utterance under evaluation was of the form "A or B". M^0 is the literal 
//listener model. We compare M^0 against M^1, the pragmatic speaker model described above.
// A "success" is an answer of "Right" in this condition. 

var total_observations = 114
var observed_successes = 100
var speaker_prob = Math.exp(speaker(["A","B"]).score('AorB'))

print("probability of 'AorB' given state where A & B true: ")
display(speaker_prob)

var LH_literalLister = Math.exp(Binomial({n: total_observations, p: 0.5}).score(observed_successes))
                                
var LH_speaker = Math.exp(Binomial({n: total_observations, p: speaker_prob}).score(observed_successes))

var posterior_literalLister = LH_literalLister / (LH_literalLister + LH_speaker)

print("P(M^0 | D) (assuming uniform prior beliefs about M^0 and M^1): ")
display(posterior_literalLister)


