// UPDATED 1/12/18 WITH THE FOLLOWING CHANGES:
// 1. COST FUNCTION ON UTTERANCES 
// 2. BY DEFAULT, SPEAKER DISTRIBUTIONS ARE VISUALIZED (THOUGH STILL POSSSIBLE TO VISUALIZE PRAG. LISTENER DISTRIBUTION)
// 3. SPEAKER PROBABILITY THRESHOLD FUNCTION - FILTER UTTERANCES BELOW CERTAIN PROBABILITY
// 4. NEW SPEAKER DISTRIBUTION, WITH LOW-PROBABILITY UTTERANCES FILTERED OUT

var statePrior = function() {
  return uniformDraw([["A"], ["B"], ["A","B"]])
};

var utterancePrior = function() {
  return uniformDraw(["A", "B", "AorB", "AandB"]);
};

// cost values for utterances (currently uniform)

var utterances = ["A", "B", "AorB", "AandB"];
var cost = {
  "A": 1,
  "B": 1,
  "AorB" : 1,
  "AandB" : 1
};

var utterancePrior = function() {
  var uttProbs = map(function(u) {return Math.exp(-cost[u]) }, utterances);
  return categorical(uttProbs, utterances);
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

// threshold function 

var threshold = function(state,threshold) {
  var supported_utts_string = speaker(state).support().toString();
  var supported_utts = supported_utts_string.split(',');
  return filter(function(x) { return Math.exp(speaker(state).score(x)) > threshold; }, supported_utts)
}

// utterance prior, filtered

var utterancePrior_filtered = function(state,theta) {
  return uniformDraw(threshold(state,theta).toString().split(','));
};

// pragmatic speaker, filtered
var speaker_filtered = cache(function(state,theta) {
  return Infer({model: function(){
    var utt = utterancePrior_filtered(state,theta)
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

print("Speaker utterance distribution for world state 'A True, B True':")
viz(speaker(["A","B"]));


// print(speaker(["B"]));
// console.log(Object.keys(speaker(["B"])));
// console.log(speaker(["B"]));

print("If the probability threshold is 0.2 and the speaker intends to communicate world state 'A True, B True', what utterances does the speaker consider?")
console.log(threshold(["A","B"],0.2))

// print(threshold(["A","B"],0.2).toString().split(','))

print("What is the utterance distribution after we filter out the low-probability utterances?")

viz(speaker_filtered(["A","B"],0.2));
