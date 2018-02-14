Understanding Experimental Data in the Rational Speech Act Framework
================
Brandon Waldon

Some preliminaries:

``` r
require("rwebppl")
require("tidyverse")
require("ordinal")
```

Background
----------

Two contributions: one empirical, one theoretical

**'Sentence verification' paradigms and scalar implicature**

-   Lots of things can affect speakers' judgments about scalar implicature.
-   Pragmatic judgments change according to \`\`dependent measure used to probe linguistic intuitions" - e.g. 'sentence verification' tasks, 'word probability rating' tasks, and 'sentence interpretation' tasks (Degen and Goodman 2014: 1). Moreover, Degen and Goodman (2014) show that some experimental paradigms are more sensitive to contextual manipulations than others.
-   Building off that work, we provide evidence that judgments in 'sentence verification' tasks are furthermore sensitive to the number of response options participants have when completing the task.

**Understanding what is measured in 'sentence verification' paradigms**

-   The typical neo-Gricean way of understanding participant behavior on truth value judgment task experiments (to the extent linking hypotheses are discussed in that literature): a participant either does or does not \`calculate' an implicature when presented some sentence S. The evaluation of the sentence S as "Right"/"Wrong", "True"/"False", "Correct"/"Incorrect" depends on whether an implicature was derived and whether or not that pragmatically enriched interpretation is actually used to verify S.

-   Another proposal: building off Degen and Goodman (2014), participants' behavior on these tasks can be modeled directly as a function of a Rational Speech Act model of a pragmatic speaker.

The problem
-----------

The RSA model of a pragmatically competent speaker is a probability distribution of possible utterances given some world state the speaker intends to communicate to a listener. We'd like to be able to link this model to the categorical responses we observe in the SI-Paradigms experiment. For the purposes of this document, I'll focus on the version of the experiment where speakers rated an utterance on a two-point scale of "Right"/"Wrong".

Setting up the RSA model
------------------------

In the RSA model, the function *S*<sub>1</sub> returns the probability of an utterance given the world state the speaker intends to communicate.

Let's imagine that a speaker is in a scenario where there are exactly three animals - X, Y, and Z - that each might be on some card. We represent all of the possible world states as an nested array, where the array \['X'\] corresponds to the world state where an animal X is on the card (and no other animal is). We define a set of possible sentences a speaker might utter, assuming the speaker intends to communicate which animals are on the card. Next, we attribute meanings to those utterances. Lastly, we define the pragmatic speaker function.

``` r
model = "
var states = [['X'], ['Y'], ['Z'], ['X','Y'], ['X','Z'], ['Y','Z'], ['X','Y','Z']];
var utterances = ['X', 'Y', 'XorY', 'XandY', 'Z','XorZ','XandZ','YorZ','YandZ','XandYandZ','XorYorZ'];

var statePrior = function() {
  return uniformDraw(states)
};

var utterancePrior = function() {
  return uniformDraw(utterances);
};

var literalMeanings = {
  X: function(state) { return state.includes('X'); },
  Y: function(state) { return state.includes('Y'); },
  Z: function(state) { return state.includes('Z'); },
  XorY: function(state) { return state.includes('X') || state.includes('Y'); },
  XandY: function(state) { return state.includes('X') && state.includes('Y'); },
  XorZ: function(state) { return state.includes('X') || state.includes('Z'); },
  XandZ: function(state) { return state.includes('X') && state.includes('Z'); },
  YorZ: function(state) { return state.includes('Y') || state.includes('Z'); },
  YandZ: function(state) { return state.includes('Y') && state.includes('Z'); },
  XorYorZ: function(state) { return state.includes('X') || state.includes('Y') || state.includes('Z'); },
  XandYandZ: function(state) { return state.includes('X') && state.includes('Y') && state.includes('Z'); },
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
var alpha = 1;

// pragmatic speaker
var speaker = cache(function(state) {
  return Infer({model: function(){
    var utt = utterancePrior()
    factor(alpha * literalListener(utt).score(state))
    return utt
  }})
});
"
```

Sanity check: what is the probability distribution over possible utterances given world state \['X','Y'\]?

``` r
code <- paste(model,"speaker(['X','Y'])",sep="\n")
webppl(code)
```

    ##   support       prob
    ## 1 XorYorZ 0.08695652
    ## 2    YorZ 0.10144928
    ## 3    XorZ 0.10144928
    ## 4   XandY 0.30434783
    ## 5    XorY 0.10144928
    ## 6       Y 0.15217391
    ## 7       X 0.15217391

The empirical picture
---------------------

As we expect, the utterance 'XorY' (i.e. "there is an X or a Y on the card") is of substantially lower probability than utterance 'XandY'. We interpret this to mean that in our model, 'XorY' is not the optimal utterance given that a speaker is trying to communicate the world state denoted by \['X','Y'\] (i.e. both X and Y are on the card).

Consider this output of the model in the context of the following empirical result of the SI-Paradigms pilot: in the condition where a participant is shown a card with two animals X and Y, people overwhelmingly find a guess of "there is an X or a Y on the card" to be "Right"" rather than "Wrong".

![](linkinghypotheses_files/figure-markdown_github/unnamed-chunk-4-1.png)

Straw-man linking hypothesis: participants sample 'directly' from S:
--------------------------------------------------------------------

Our linking hypothesis should say something about why an overwhelming majority of individuals would rate an 'XorY' guess to be Right in an \['X','Y'\] world state, despite 'XorY' being a sub-optimal utterance choice in this world state according to our pragmatic speaker model.

Let's first explore a linking hypothesis that makes the wrong predictions in this regard. We might hypothesize that speakers, when confronted with a world state w (i.e. the configuration of animals on the card in a given SI-Paradigms trial) and an utterance u (the guess in that trial), have access to the probability that the *S*<sub>1</sub> distribution assigns to u in w.

``` r
commands <- "
var prob = Math.exp(speaker(['X','Y']).score('XorY'));
prob;"
code <- paste(model,commands,sep="\n")
webppl(code)
```

    ## [1] 0.1014493

On this simplistic straw-man story, we might say that all that happens next is that speakers sample from a Bernoulli distribution where the probability of success is equal to *S*<sub>1</sub>(u|w). If that sample is a success, the utterance is rated as Right; if failure, the utterance is rated as Wrong.

``` r
commands <- "
var prob = Math.exp(speaker(['X','Y']).score('XorY'));
sample(Bernoulli({p: prob}));
"
code <- paste(model,commands,sep = "\n")
webppl(code)
```

    ## [1] FALSE

Obviously, this model is going to be a very poor fit for the observed data (we could confirm this easily with a binomial test). It will predict that in the vast majority of cases, participants should actually reject 'XorY' in the \['X','Y'\] condition. Moreover, it's unclear how to extend this linking hypothesis to the experimental conditions in which there are more than two possible responses. Lastly, it doesn't even get the qualitative pattern of responses right for the binary-choice experiment. For example, in the conditions where there were two animals X and Y on the card, it was possible that speakers had to rate a guess of 'X or Y' or a guess of just 'X'. However, across both of these guess types, the proportion of "Right" responses among pilot participants is nearly identical -- despite the RSA model prediction that 'X' should be a substantially more optimal utterance than 'X or Y' in this world state. On the naive story built up so far, it is unclear as to why this would be the case.

![](linkinghypotheses_files/figure-markdown_github/unnamed-chunk-7-1.png)

A better hypothesis? The logistic function
------------------------------------------

The straw-man linking hypothesis described above was clearly inadequate. But it is a linking hypothesis: it generates predictions about categorical behavior (e.g. responses in the SI-Paradigms experiment) from our model; it "maps the response measure onto the theoretical constructs of interest" (Tanenhaus 2000:564-5). The above hypothesis achieves this by positing that the categorical behavior of interest (answering "Right"/"Wrong"") can be understood as a probabilistic process, whereby the probability that a participant responds "Right" when exposed to utterance u in world state w is equal to the speaker probability of u in w as computed by the RSA model:

P(Participant answers "Right"|u,w) = *S*<sub>1</sub>(u|w)

Perhaps the straw-man hypothesis is basically correct in conceptualizing the categorical response as a probabilistic process. If we accept the basic story that the categorical response can be represented as P("Right"|u,w), then we need a way to link P("Right"|u,w) to our RSA speaker distribution *S*<sub>1</sub>(u|w) - in a way that gets better empirical coverage than the straw-man hypothesis explored above.

One alternative would be to say that P("Right"|u,w) is a function of, but not identical to, the probability of utterance u given world state w in the *S*<sub>1</sub> model. The challenge then becomes to specify this function. Logistic regression provides one possible solution. This type of regression returns a model of the log odds of some binary categorical response (e.g. "Right"/"Wrong") as a function of an independent variable (e.g. speaker probability of utterance given a world state).

Exploring this requires some transformation to our results. We continue to look at the subset of the SI-paradigms pilot data where response was binary "Right"/"Wrong". Now, for every row in the data (each row corresponds to one response), we add a value *S*<sub>1</sub>(u|w) in a new column (speaker\_probability) of the data frame, where *S*<sub>1</sub>(u|w) is the speaker probability of u (the 'guess' presented on the screen) given w (the configuration of animals on the card).

``` r
binary <- filter(d, type == "binary")
binary <- add_column(binary, speaker_probability = 0)

code <- paste(model,"speaker(['X','Y'])",sep="\n")
speaker_probs_xy <- webppl(code)

code <- paste(model,"speaker(['X'])",sep="\n")
speaker_probs_x <- webppl(code)

for(i in 1:nrow(binary)){
  for(j in 1:nrow(speaker_probs_xy)){
    if((as.character(speaker_probs_xy[j,]$support) == as.character(binary[i,]$guess_type)) & binary[i,]$card_type == "XY"){
      binary[i,]$speaker_probability <- speaker_probs_xy[j,]$prob
    }
  }
}

for(i in 1:nrow(binary)){
  for(j in 1:nrow(speaker_probs_x)){
    if((as.character(speaker_probs_x[j,]$support) == as.character(binary[i,]$guess_type))& binary[i,]$card_type == "X"){
      binary[i,]$speaker_probability <- speaker_probs_x[j,]$prob
    }
  }
}
```

Now, specify a logistic regression model whereby categorical response (coded as "1" or "0" in the data set) is predicted by speaker\_probability.

``` r
l <- glm(as.factor(response) ~ speaker_probability, data = binary, family = "binomial")
summary(l)
```

    ## 
    ## Call:
    ## glm(formula = as.factor(response) ~ speaker_probability, family = "binomial", 
    ##     data = binary)
    ## 
    ## Deviance Residuals: 
    ##     Min       1Q   Median       3Q      Max  
    ## -3.3016  -0.3462   0.0119   0.0928   2.3852  
    ## 
    ## Coefficients:
    ##                     Estimate Std. Error z value Pr(>|z|)    
    ## (Intercept)          -2.7846     0.2216  -12.57   <2e-16 ***
    ## speaker_probability  35.8617     2.3776   15.08   <2e-16 ***
    ## ---
    ## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
    ## 
    ## (Dispersion parameter for binomial family taken to be 1)
    ## 
    ##     Null deviance: 1228.76  on 912  degrees of freedom
    ## Residual deviance:  352.93  on 911  degrees of freedom
    ## AIC: 356.93
    ## 
    ## Number of Fisher Scoring iterations: 7

``` r
#confint(l)
```

The above model provides the log odds of responding "Right" vs. "Wrong" as a function of the speaker probability of the utterance being assessed by the participant (in a particular utterance context). It is a better model than the simple straw-man model which assumed a one-to-one correspondence between a) the probability a participant judges some utterance u to be "Right" in w and b) the probability of that utterance u in a world state w, as according to our pragmatic speaker distribution \[say more? model comparison?\].

### Extending the logistic regression model to other SI-Paradigms conditions, e.g. quatenary response

``` r
quatenary <- filter(d, type == "quatenary")
quatenary <- add_column(quatenary, speaker_probability = 0)

for(i in 1:nrow(quatenary)){
  for(j in 1:nrow(speaker_probs_xy)){
    if((as.character(speaker_probs_xy[j,]$support) == as.character(quatenary[i,]$guess_type)) & quatenary[i,]$card_type == "XY"){
      quatenary[i,]$speaker_probability <- speaker_probs_xy[j,]$prob
    }
  }
}

for(i in 1:nrow(quatenary)){
  for(j in 1:nrow(speaker_probs_x)){
    if((as.character(speaker_probs_x[j,]$support) == as.character(quatenary[i,]$guess_type))& quatenary[i,]$card_type == "X"){
      quatenary[i,]$speaker_probability <- speaker_probs_x[j,]$prob
    }
  }
}

lq <- clmm2(ordered(response) ~ speaker_probability, data = quatenary,link = "logistic")
summary(lq)
```

    ## Call:
    ## clm2(location = ordered(response) ~ speaker_probability, data = quatenary, 
    ##     link = "logistic")
    ## 
    ## Location coefficients:
    ##                     Estimate Std. Error z value Pr(>|z|)  
    ## speaker_probability 20.2446   1.2476    16.2271 < 2.22e-16
    ## 
    ## No scale coefficients
    ## 
    ## Threshold coefficients:
    ##     Estimate Std. Error z value
    ## 0|1  1.0327   0.1498     6.8946
    ## 1|2  1.7402   0.1713    10.1589
    ## 2|3  3.8848   0.2504    15.5137
    ## 
    ## log-likelihood: -392.1749 
    ## AIC: 792.3498 
    ## Condition number of Hessian: 273.5264

``` r
#confint(lq)
```

Another hypothesis: thresholds
------------------------------

Another conceivable hypothesis is that for some utterance u in world state w, u is "Right" so long as *S*<sub>1</sub>(u|w) exceeds some probability threshold *θ*.

We can enrich the pragmatic speaker model provided above to model such a function. First, we specify a threshold function which takes as its input a world state w and a probability threshold *θ* and returns only those utterances for which *S*<sub>1</sub>(u|w) &gt; *θ* is true. The following model also specifies a cost function - for now, we'll keep the cost uniform on utterances.

``` r
model_threshold = "
var states = [['X'], ['Y'], ['Z'], ['X','Y'], ['X','Z'], ['Y','Z'], ['X','Y','Z']];
var utterances = ['X', 'Y', 'XorY', 'XandY', 'Z','XorZ','XandZ','YorZ','YandZ','XandYandZ','XorYorZ'];

var statePrior = function() {
  return uniformDraw(states)
};

var cost = function(u) {
  return 1
};

var utterancePrior = function() {
  return uniformDraw(utterances);
};

var literalMeanings = {
  X: function(state) { return state.includes('X'); },
  Y: function(state) { return state.includes('Y'); },
  Z: function(state) { return state.includes('Z'); },
  XorY: function(state) { return state.includes('X') || state.includes('Y'); },
  XandY: function(state) { return state.includes('X') && state.includes('Y'); },
  XorZ: function(state) { return state.includes('X') || state.includes('Z'); },
  XandZ: function(state) { return state.includes('X') && state.includes('Z'); },
  YorZ: function(state) { return state.includes('Y') || state.includes('Z'); },
  YandZ: function(state) { return state.includes('Y') && state.includes('Z'); },
  XorYorZ: function(state) { return state.includes('X') || state.includes('Y') || state.includes('Z'); },
  XandYandZ: function(state) { return state.includes('X') && state.includes('Y') && state.includes('Z'); },
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
"
```

Now it is possible to model the linking function of interest: we say that for any utterance u given world state w and probability threshold *θ*, u is "Right" so long as S(u|w) exceeds *θ* and is "Wrong" otherwise (more precisely, the model returns "Right" so long as u is in the set of utterances returned by threshold(w,*θ*), and "Wrong" otherwise).

``` r
right_or_wrong <- "
var right_or_wrong = function(utt,state,theta) {
  if (threshold(state,theta).includes(utt)) { return 'Right'; } else { return 'Wrong'; }
}
"
```

Suppose the utterance of interest is 'X or Y' in the world state \['X','Y'\] given a probability threshold of 0.2. Which categorical response does our model predict?

``` r
commands <- "right_or_wrong('XorY',['X','Y'],0.2)"
code <- paste(model_threshold,right_or_wrong,commands,sep = "\n")
webppl(code)
```

    ## [1] "Wrong"

For the experimental conditions in which more than two choices were provided, we need to specify an enriched linking function. For the ternary choice condition, we need a function that takes as its input an utterance, a world state, and two thresholds *θ*<sub>1</sub> and *θ*<sub>2</sub>. An utterance is "Wrong" in world state w just in case *S*<sub>1</sub>(u|w) is less than *θ*<sub>1</sub>. It is "Right" just in case *S*<sub>1</sub>(u|w) &gt; *θ*<sub>2</sub>. It is "Neither" just in case *θ*<sub>1</sub> &lt; *S*<sub>1</sub>(u|w) &lt; *θ*<sub>2</sub>.

What if our *θ*<sub>1</sub> is 0.1, and our *θ*<sub>2</sub> is 0.2? What does this linking model predict a respondent will say about 'X or Y' in world state \['X','Y'\]?

``` r
right_neither_wrong <- "
var right_neither_wrong = function(utt,state,thetaone,thetatwo) {
if (threshold(state,thetatwo).includes(utt)) { return 'Right'; }
if (threshold(state,thetaone).includes(utt)) { return 'Neither'; } 
else { return 'Wrong'; }
}
"

commands <- "right_neither_wrong('XorY',['X','Y'],0.1,0.2)"
code <- paste(model_threshold,right_neither_wrong,commands,sep = "\n")
webppl(code)
```

    ## [1] "Neither"

Another hypothesis: mixing log odds + the threshold parameter
-------------------------------------------------------------

Yet another possibility is that for some utterance u in world state w, P("Right"|u,w) is a function of *S*<sub>1</sub>'(u|w), where *S*<sub>1</sub>' is a transformation of the pragmatic speaker distribution. More specifically, *S*<sub>1</sub>' is a re-normalized version of *S*<sub>1</sub> after low-probability utterances are filtered from *S*<sub>1</sub> (according to some threshold of probability).

In order to explore this hypothesis, we first need to model *S*<sub>1</sub>' (specified below as speaker\_filtered). Speaker\_filtered is a function of utterancePrior\_filtered - an utterance prior function which takes as its input only high-probability utterances; that is, utterances for which *S*<sub>1</sub>(u|w) &gt; *θ* is true.

``` r
filter_utterances <- "
var utterancePrior_filtered = function(state,theta) {
  return uniformDraw(threshold(state,theta).toString().split(','));
};

var speaker_filtered = cache(function(state,theta) {
  return Infer({model: function(){
    var utt = utterancePrior_filtered(state,theta)
    factor(alpha * literalListener(utt).score(state))
    return utt
  }})
});
"

model_threshold_2 <- paste(model_threshold,filter_utterances,sep = "\n")
```

Let's explore this new *S*<sub>1</sub>' distribution over utterances, given a world state \['X','Y'\] and that we are only interested in those utterances for which it is true that *S*<sub>1</sub>(u|w) &gt; 0.12.

``` r
commands <- "speaker_filtered(['X','Y'],0.12)"
code <- paste(model_threshold_2, commands, sep = "\n")
webppl(code)
```

    ##   support prob
    ## 1       X 0.25
    ## 2       Y 0.25
    ## 3   XandY 0.50

With this model, we could revisit the logistic regression linking function explored above: the log odds of categorical response is a function of the (filtered) speaker probability of that utterance in a particular world state w and given a probability threshold *θ* (in the example below, *θ* is 0.12 - a totally arbitrary value).

``` r
binary <- add_column(binary, speaker_renorm_probability = 0)

commands <- "speaker_filtered(['X','Y'],0.12)"
code <- paste(model_threshold_2,commands,sep="\n")
speaker_renormprobs_xy <- webppl(code)

commands <- "speaker_filtered(['X'],0.12)"
code <- paste(model_threshold_2,commands,sep="\n")
speaker_renormprobs_x <- webppl(code)

for(i in 1:nrow(binary)){
  for(j in 1:nrow(speaker_renormprobs_xy)){
    if((as.character(speaker_renormprobs_xy[j,]$support) == as.character(binary[i,]$guess_type)) & binary[i,]$card_type == "XY"){
      binary[i,]$speaker_renorm_probability <- speaker_renormprobs_xy[j,]$prob
    }
  }
}

for(i in 1:nrow(binary)){
  for(j in 1:nrow(speaker_renormprobs_x)){
    if((as.character(speaker_renormprobs_x[j,]$support) == as.character(binary[i,]$guess_type)) & binary[i,]$card_type == "X"){
      binary[i,]$speaker_renorm_probability <- speaker_renormprobs_x[j,]$prob
    }
  }
}

l <- glm(as.factor(response) ~ speaker_renorm_probability, data = binary, family = "binomial")
summary(l)
```

    ## 
    ## Call:
    ## glm(formula = as.factor(response) ~ speaker_renorm_probability, 
    ##     family = "binomial", data = binary)
    ## 
    ## Deviance Residuals: 
    ##      Min        1Q    Median        3Q       Max  
    ## -2.38203  -0.73988   0.04938   0.34752   1.69081  
    ## 
    ## Coefficients:
    ##                            Estimate Std. Error z value Pr(>|z|)    
    ## (Intercept)                 -1.1557     0.1094  -10.57   <2e-16 ***
    ## speaker_renorm_probability  15.7294     1.0641   14.78   <2e-16 ***
    ## ---
    ## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
    ## 
    ## (Dispersion parameter for binomial family taken to be 1)
    ## 
    ##     Null deviance: 1228.76  on 912  degrees of freedom
    ## Residual deviance:  635.91  on 911  degrees of freedom
    ## AIC: 639.91
    ## 
    ## Number of Fisher Scoring iterations: 6
