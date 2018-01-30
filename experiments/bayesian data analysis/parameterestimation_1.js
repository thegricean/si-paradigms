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

// pragmatic speaker
var speaker = function(state, alpha){ //alpha is now an argument
  Infer({model: function(){
    var utterance = utterancePrior()
    factor(alpha * literalListener(utterance).score(state))
    return utterance
  }})
}

// pragmatic listener
var pragmaticListener = cache(function(utt) {
  return Infer({model: function(){
    var state = statePrior()
    observe(speaker(state),utt)
    return state
  }})
});

print("speaker distribution given state where A & B true, given alpha 1:")
viz.hist(speaker(["A","B"], 1));

var non_normalized_posterior = function(){
  // prior over model parameter
  var alpha = uniform({a:0, b:10})
  var predicted_probability =
      Math.exp(speaker(["A","B"], alpha).score('AorB'))
  var likelihood = Binomial({n: 114, p: predicted_probability}).score(100)    
  factor(likelihood)
  return {alpha}
}

// cache(Infer, 50000)

var posterior_samples = Infer({
  method: "MCMC",
  samples: 10000, // how many samples to obtain
  burn: 1500,     // number of steps for algorithm to adapt
  model: non_normalized_posterior})

print("Estimating alpha given our model and observed data:")

viz(posterior_samples)